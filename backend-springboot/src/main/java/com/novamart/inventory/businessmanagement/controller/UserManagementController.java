package com.novamart.inventory.businessmanagement.controller;

import com.novamart.inventory.businessmanagement.dto.CreateUserRequest;
import com.novamart.inventory.businessmanagement.dto.RoleDto;
import com.novamart.inventory.businessmanagement.dto.UpdateUserRequest;
import com.novamart.inventory.businessmanagement.dto.UserDto;
import com.novamart.inventory.businessmanagement.service.UserManagementService;
import com.novamart.inventory.common.dto.ApiResponse;
import com.novamart.inventory.common.dto.PagedResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/business")
@CrossOrigin(origins = "*")
public class UserManagementController {

    @Autowired
    private UserManagementService userManagementService;

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<PagedResponse<UserDto>>> getUsers(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Boolean isActive,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        PagedResponse<UserDto> response = userManagementService.getUsers(search, isActive, page, size);
        return ResponseEntity.ok(ApiResponse.success("Users retrieved successfully", response));
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<ApiResponse<UserDto>> getUserById(@PathVariable("id") Integer userId) {
        UserDto user = userManagementService.getUserById(userId);
        return ResponseEntity.ok(ApiResponse.success("User details retrieved", user));
    }

    @PostMapping("/users")
    public ResponseEntity<ApiResponse<UserDto>> createUser(
            @Valid @RequestBody CreateUserRequest request,
            Authentication authentication
    ) {
        String performedBy = (authentication != null) ? authentication.getName() : "admin";
        UserDto created = userManagementService.createUser(request, performedBy);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("User account created successfully", created));
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<ApiResponse<UserDto>> updateUser(
            @PathVariable("id") Integer userId,
            @Valid @RequestBody UpdateUserRequest request,
            Authentication authentication
    ) {
        String performedBy = (authentication != null) ? authentication.getName() : "admin";
        UserDto updated = userManagementService.updateUser(userId, request, performedBy);
        return ResponseEntity.ok(ApiResponse.success("User account updated successfully", updated));
    }

    @PatchMapping("/users/{id}/status")
    public ResponseEntity<ApiResponse<Void>> toggleStatus(
            @PathVariable("id") Integer userId,
            @RequestParam boolean active,
            Authentication authentication
    ) {
        String performedBy = (authentication != null) ? authentication.getName() : "admin";
        userManagementService.toggleUserStatus(userId, active, performedBy);
        return ResponseEntity.ok(ApiResponse.success("User status changed to " + (active ? "ACTIVE" : "INACTIVE"), null));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteUser(
            @PathVariable("id") Integer userId,
            Authentication authentication
    ) {
        String performedBy = (authentication != null) ? authentication.getName() : "admin";
        userManagementService.deleteUser(userId, performedBy);
        return ResponseEntity.ok(ApiResponse.success("User account deleted successfully", null));
    }

    @GetMapping("/roles")
    public ResponseEntity<ApiResponse<List<RoleDto>>> getAllRoles() {
        List<RoleDto> roles = userManagementService.getAllRoles();
        return ResponseEntity.ok(ApiResponse.success("Roles retrieved successfully", roles));
    }
}
