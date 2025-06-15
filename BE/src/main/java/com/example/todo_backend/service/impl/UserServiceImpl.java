package com.example.todo_backend.service.impl;

import com.example.todo_backend.model.User;
import com.example.todo_backend.repository.UserRepository;
import com.example.todo_backend.service.UserService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder){
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public Optional<User> getUserById(Long id) {
       return userRepository.findById(id);
    }

    @Override
    public User addUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    @Override
    public User updateUser(User updatedUser) {
        return userRepository.findById(updatedUser.getId())
                .map(existing -> {
                    existing.setFirstName(updatedUser.getFirstName());
                    existing.setLastName(updatedUser.getLastName());
                    existing.setUsername(updatedUser.getUsername());

                    if (updatedUser.getPassword() != null && !updatedUser.getPassword().isBlank()) {
                        existing.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
                    }
                    return userRepository.save(existing);
                }).orElse(null);
    }

    @Override
    public void deleteUser(Long id){ userRepository.deleteById(id);}
}
