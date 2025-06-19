package com.example.todo_backend.service.impl;

import com.example.todo_backend.dto.UserDto;
import com.example.todo_backend.exception.InvalidInputException;
import com.example.todo_backend.exception.InvalidPasswordException;
import com.example.todo_backend.exception.InvalidPasswordFormatException;
import com.example.todo_backend.exception.ResourceNotFoundException;
import com.example.todo_backend.model.User;
import com.example.todo_backend.repository.UserRepository;
import com.example.todo_backend.service.UserService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder){
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    private void checkUsernameUniqueness(String username) {
        Optional<User> existingUser = userRepository.findByUsername(username);

        if (existingUser.isPresent()) {
            throw new InvalidInputException("Username '" + username + "' is already taken");
        }
    }

    private void validateUserFields(User user) {
        if (user.getFirstName() == null || user.getFirstName().isBlank()) {
            throw new InvalidInputException("First name cannot be empty");
        }
        if (user.getLastName() == null || user.getLastName().isBlank()) {
            throw new InvalidInputException("Last name cannot be empty");
        }
        if (user.getUsername() == null || user.getUsername().isBlank()) {
            throw new InvalidInputException("Username cannot be empty");
        }
    }

    private UserDto mapUserToDto(User user) {
        UserDto userDto = new UserDto();
        userDto.setId(user.getId());
        userDto.setFirstName(user.getFirstName());
        userDto.setLastName(user.getLastName());
        userDto.setUsername(user.getUsername());
        return userDto;
    }

    private void validateUserPassword(String password){
        if(password == null || password.isBlank()){
            throw new InvalidPasswordFormatException("Password cannot be empty");
        }
        if(password.length() < 8){
            throw new InvalidPasswordFormatException("Password must be at least 8 characters");
        }
        if (!Pattern.compile(".*\\d.*").matcher(password).matches()) {
            throw new InvalidPasswordFormatException("Password must contain at least one digit");
        }
        if (!Pattern.compile(".*[^a-zA-Z0-9\\s].*").matcher(password).matches()) {
            throw new InvalidPasswordFormatException("Password must contain at least one special character");
        }
    }

    @Override
    public List<UserDto> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::mapUserToDto)
                .collect(Collectors.toList());
    }

    @Override
    public UserDto getUserById(Long id) {
       return userRepository
               .findById(id)
               .map(this::mapUserToDto)
               .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));
    }

    @Override
    public UserDto addUser(User user) {
        validateUserFields(user);
        checkUsernameUniqueness(user.getUsername());
        validateUserPassword(user.getPassword());
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        User savedUser = userRepository.save(user);
        return mapUserToDto(savedUser);
    }

    @Override
    public UserDto updateUserDetails(Long id,User updatedUserDetails) {
        validateUserFields(updatedUserDetails);
        User user = userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));;
        if (!user.getUsername().equals(updatedUserDetails.getUsername())) {
            checkUsernameUniqueness(updatedUserDetails.getUsername());
        }
        user.setFirstName(updatedUserDetails.getFirstName());
        user.setLastName(updatedUserDetails.getLastName());
        user.setUsername(updatedUserDetails.getUsername());
        User savedUser = userRepository.save(user);
        return mapUserToDto(savedUser);
    }

    @Override
    public void updateUserPassword(Long id, String newPassword, String oldPassword){
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));

        if (newPassword.equals(oldPassword)) {
            throw new InvalidPasswordFormatException("New password cannot match old one");
        }

        validateUserPassword(newPassword);

        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new InvalidPasswordException("Incorrect old password provided");
        }

        user.setPassword(passwordEncoder.encode(newPassword));

        userRepository.save(user);
    }

    @Override
    public void deleteUserById(Long id){
        if (!userRepository.existsById(id)) {
            throw  new ResourceNotFoundException("User not found with ID: " + id);
        }
        userRepository.deleteById(id);
    }
}
