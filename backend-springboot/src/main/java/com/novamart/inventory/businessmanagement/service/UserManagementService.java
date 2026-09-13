package com.novamart.inventory.businessmanagement.service;

import com.novamart.inventory.businessmanagement.dto.CreateUserRequest;
import com.novamart.inventory.businessmanagement.dto.RoleDto;
import com.novamart.inventory.businessmanagement.dto.UpdateUserRequest;
import com.novamart.inventory.businessmanagement.dto.UserDto;
import com.novamart.inventory.common.dto.PagedResponse;

import java.util.List;

public interface UserManagementService {

    PagedResponse<UserDto> getUsers(String search, Boolean isActive, int page, int size);

    UserDto getUserById(Integer userId);

    UserDto getUserByUsername(String username);

    UserDto createUser(CreateUserRequest request, String performedBy);

    UserDto updateUser(Integer userId, UpdateUserRequest request, String performedBy);

    void toggleUserStatus(Integer userId, boolean active, String performedBy);

    void deleteUser(Integer userId, String performedBy);

    List<RoleDto> getAllRoles();
}
