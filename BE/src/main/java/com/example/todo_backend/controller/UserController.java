package com.example.todo_backend.controller;


import com.example.todo_backend.dto.UserDto;
import com.example.todo_backend.dto.UserPasswordUpdateDto;
import com.example.todo_backend.model.User;
import com.example.todo_backend.service.UserService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("api/users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService){this.userService = userService;}

    @GetMapping
    public List<UserDto> getAllUsers(){ return userService.getAllUsers();}

    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getUserById(@PathVariable Long id){
        UserDto userDto = userService.getUserById(id);
        return ResponseEntity.ok(userDto);
    }

    @PostMapping
    public ResponseEntity<UserDto> createUser(@RequestBody User user){
        UserDto createdUser = userService.addUser(user);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(createdUser);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserDto> updateUserDetails(@PathVariable Long id, @RequestBody User updatedUserData){
        UserDto updatedUser = userService.updateUserDetails(id, updatedUserData);
        return ResponseEntity.ok(updatedUser);
    }

    @PutMapping("/{id}/password")
    public ResponseEntity<Void> updateUserPassword(@PathVariable Long id, @RequestBody UserPasswordUpdateDto userPasswords){
        userService.updateUserPassword(id, userPasswords.getNewPassword(), userPasswords.getOldPassword());
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUserById(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
