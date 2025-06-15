package com.example.todo_backend.service;

import com.example.todo_backend.model.User;

import java.util.List;
import java.util.Optional;

public interface UserService {
    List<User> getAllUsers();
    Optional<User> getUserById(Long id);
    User addUser(User user);
    User updateUser(User user);
    void deleteUser(Long id);
}