package com.novamart.inventory.businessmanagement.service.impl;

import com.novamart.inventory.businessmanagement.dto.CreateUserRequest;
import com.novamart.inventory.businessmanagement.dto.RoleDto;
import com.novamart.inventory.businessmanagement.dto.UpdateUserRequest;
import com.novamart.inventory.businessmanagement.dto.UserDto;
import com.novamart.inventory.businessmanagement.model.RoleEntity;
import com.novamart.inventory.businessmanagement.model.UserEntity;
import com.novamart.inventory.businessmanagement.repository.RoleRepository;
import com.novamart.inventory.businessmanagement.repository.UserRepository;
import com.novamart.inventory.businessmanagement.service.AuditLogService;
import com.novamart.inventory.businessmanagement.service.UserManagementService;
import com.novamart.inventory.common.dto.PagedResponse;
import com.novamart.inventory.common.exception.BadRequestException;
import com.novamart.inventory.common.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UserManagementServiceImpl implements UserManagementService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private AuditLogService auditLogService;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Override
    public PagedResponse<UserDto> getUsers(String search, Boolean isActive, int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<UserEntity> userPage = userRepository.searchUsers(
                (search != null && !search.trim().isEmpty()) ? search.trim() : null,
                isActive,
                pageRequest
        );

        List<UserDto> content = userPage.getContent().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());

        return new PagedResponse<>(
                content,
                userPage.getNumber(),
                userPage.getSize(),
                userPage.getTotalElements(),
                userPage.getTotalPages(),
                userPage.isLast()
        );
    }

    @Override
    public UserDto getUserById(Integer userId) {
        UserEntity entity = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        return convertToDto(entity);
    }

    @Override
    public UserDto getUserByUsername(String username) {
        UserEntity entity = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));
        return convertToDto(entity);
    }

    @Override
    @Transactional
    public UserDto createUser(CreateUserRequest request, String performedBy) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BadRequestException("Username '" + request.getUsername() + "' is already taken.");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email '" + request.getEmail() + "' is already in use.");
        }

        UserEntity user = new UserEntity();
        user.setUsername(request.getUsername().trim());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName().trim());
        user.setEmail(request.getEmail().trim().toLowerCase());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setIsActive(true);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        Set<RoleEntity> roles = resolveRoles(request.getRoles());
        user.setRoles(roles);

        UserEntity saved = userRepository.save(user);

        auditLogService.logAction(
                null,
                (performedBy != null) ? performedBy : "SYSTEM",
                "CREATE_USER",
                "BUSINESS_MANAGEMENT",
                "127.0.0.1",
                "Created new user account: " + saved.getUsername() + " with roles: " + request.getRoles(),
                "INFO"
        );

        return convertToDto(saved);
    }

    @Override
    @Transactional
    public UserDto updateUser(Integer userId, UpdateUserRequest request, String performedBy) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        if (!user.getEmail().equalsIgnoreCase(request.getEmail()) && userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email '" + request.getEmail() + "' is already in use by another account.");
        }

        user.setFullName(request.getFullName().trim());
        user.setEmail(request.getEmail().trim().toLowerCase());
        user.setPhoneNumber(request.getPhoneNumber());
        if (request.getIsActive() != null) {
            user.setIsActive(request.getIsActive());
        }

        if (request.getNewPassword() != null && !request.getNewPassword().trim().isEmpty()) {
            user.setPasswordHash(passwordEncoder.encode(request.getNewPassword().trim()));
        }

        if (request.getRoles() != null && !request.getRoles().isEmpty()) {
            user.setRoles(resolveRoles(request.getRoles()));
        }

        user.setUpdatedAt(LocalDateTime.now());
        UserEntity updated = userRepository.save(user);

        auditLogService.logAction(
                null,
                (performedBy != null) ? performedBy : "SYSTEM",
                "UPDATE_USER",
                "BUSINESS_MANAGEMENT",
                "127.0.0.1",
                "Updated user account: " + updated.getUsername(),
                "INFO"
        );

        return convertToDto(updated);
    }

    @Override
    @Transactional
    public void toggleUserStatus(Integer userId, boolean active, String performedBy) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        user.setIsActive(active);
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);

        auditLogService.logAction(
                null,
                (performedBy != null) ? performedBy : "SYSTEM",
                active ? "ACTIVATE_USER" : "DEACTIVATE_USER",
                "BUSINESS_MANAGEMENT",
                "127.0.0.1",
                "Changed status of user '" + user.getUsername() + "' to " + (active ? "ACTIVE" : "INACTIVE"),
                "WARNING"
        );
    }

    @Override
    @Transactional
    public void deleteUser(Integer userId, String performedBy) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        userRepository.delete(user);

        auditLogService.logAction(
                null,
                (performedBy != null) ? performedBy : "SYSTEM",
                "DELETE_USER",
                "BUSINESS_MANAGEMENT",
                "127.0.0.1",
                "Deleted user account: " + user.getUsername(),
                "CRITICAL"
        );
    }

    @Override
    public List<RoleDto> getAllRoles() {
        return roleRepository.findAll().stream()
                .map(r -> new RoleDto(r.getRoleId(), r.getRoleName(), r.getDescription()))
                .collect(Collectors.toList());
    }

    private Set<RoleEntity> resolveRoles(Set<String> roleNames) {
        Set<RoleEntity> roles = new HashSet<>();
        for (String roleName : roleNames) {
            String sanitized = roleName.trim();
            RoleEntity role = roleRepository.findByRoleName(sanitized)
                    .orElseGet(() -> roleRepository.save(new RoleEntity(sanitized, "Auto-created role " + sanitized)));
            roles.add(role);
        }
        return roles;
    }

    private UserDto convertToDto(UserEntity entity) {
        UserDto dto = new UserDto();
        dto.setUserId(entity.getUserId());
        dto.setUsername(entity.getUsername());
        dto.setFullName(entity.getFullName());
        dto.setEmail(entity.getEmail());
        dto.setPhoneNumber(entity.getPhoneNumber());
        dto.setIsActive(entity.getIsActive());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setLastLoginAt(entity.getLastLoginAt());
        dto.setRoles(entity.getRoles().stream().map(RoleEntity::getRoleName).collect(Collectors.toSet()));
        return dto;
    }
}
