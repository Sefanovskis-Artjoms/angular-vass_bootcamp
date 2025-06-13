package com.example.todo_backend.service;

import com.example.todo_backend.model.Todo;

import java.util.List;
import java.util.Optional;

public interface TodoService {
    List<Todo> getAllTodos();
    Optional<Todo> getTodoById(Long id);
    Todo addTodo(Todo todo);
    Todo updateTodo(Todo todo);
    void deleteTodo(Long id);
}
