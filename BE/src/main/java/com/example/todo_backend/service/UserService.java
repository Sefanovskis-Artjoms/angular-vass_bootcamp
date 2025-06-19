package com.example.todo_backend.service;

import com.example.todo_backend.dto.UserDto;
import com.example.todo_backend.model.User;

import java.util.List;

public interface UserService {
    List<UserDto> getAllUsers();
    UserDto getUserById(Long id);
    UserDto addUser(User user);
    UserDto updateUserDetails(Long id, User user);
    void updateUserPassword(Long id, String newPassword, String oldPassword);
    void deleteUserById(Long id);
}