package com.example.todo_backend.service.impl;

import com.example.todo_backend.model.Todo;
import com.example.todo_backend.repository.TodoRepository;
import com.example.todo_backend.service.TodoService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TodoServiceImpl implements TodoService {
    private final TodoRepository todoRepository;

    public TodoServiceImpl(TodoRepository todoRepository){
        this.todoRepository = todoRepository;
    }

    @Override
    public List<Todo> getAllTodos() {
        return todoRepository.findAll();
    }

    @Override
    public Optional<Todo> getTodoById(Long id) {
        return todoRepository.findById(id);
    }

    @Override
    public Todo addTodo(Todo todo) {
        return todoRepository.save(todo);
    }

    @Override
    public Todo updateTodo(Todo updatedTodo) {
        return todoRepository.findById(updatedTodo.getId())
                .map(existing -> {
                    existing.setTitle(updatedTodo.getTitle());
                    existing.setDescription(updatedTodo.getDescription());
                    existing.setType(updatedTodo.getType());
                    existing.setStatus(updatedTodo.getStatus());
                    return todoRepository.save(existing);
                }).orElse(null);
    }

    @Override
    public void deleteTodo(Long id) {
        todoRepository.deleteById(id);
    }
}
