package com.example.todo_backend.service.impl;

import com.example.todo_backend.exception.InvalidInputException;
import com.example.todo_backend.exception.ResourceNotFoundException;
import com.example.todo_backend.model.Todo;
import com.example.todo_backend.repository.TodoRepository;
import com.example.todo_backend.repository.UserRepository;
import com.example.todo_backend.service.TodoService;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
public class TodoServiceImpl implements TodoService {
    private final TodoRepository todoRepository;
    private final UserRepository userRepository;

    public TodoServiceImpl(TodoRepository todoRepository,UserRepository userRepository){
        this.todoRepository = todoRepository;
        this.userRepository = userRepository;
    }

    private void validateTodoFields(Todo todo){
        if (todo.getTitle() == null || todo.getTitle().isBlank()) {
            throw new InvalidInputException("Todo title cannot be empty");
        }
        if (todo.getDescription() == null || todo.getDescription().isBlank()) {
            throw new InvalidInputException("Todo description cannot be empty");
        }
        if (todo.getType() == null || todo.getType().isBlank()) {
            throw new InvalidInputException("Todo type cannot be empty");
        }
        if (todo.getStatus() == null || todo.getStatus().isBlank()) {
            throw new InvalidInputException("Todo status cannot be empty.");
        }
        if (!Arrays.asList("Todo", "Done", "In progress").contains(todo.getStatus())) {
            throw new InvalidInputException("Invalid status");
        }
        if (!Arrays.asList("Feature", "Story", "Bug", "Other").contains(todo.getType())) {
            throw new InvalidInputException("Invalid type");
        }
        if(todo.getAssignedTo() != null && !userRepository.existsById(todo.getAssignedTo())){
            throw new InvalidInputException("Todo cannot be assigned to non-existing user");
        }
    }

    @Override
    public List<Todo> getAllTodos() {
        return todoRepository.findAll();
    }

    @Override
    public Todo getTodoById(Long id) {
        return todoRepository
                .findById(id)
                .orElseThrow(()-> new ResourceNotFoundException("Todo not found with ID:"+ id));
    }

    @Override
    public Todo addTodo(Todo todo) {
        validateTodoFields(todo);
        return todoRepository.save(todo);
    }

    @Override
    public Todo updateTodo(Long id, Todo updatedTodo) {
        validateTodoFields(updatedTodo);
        Todo existingTodo = todoRepository
                .findById(id)
                .orElseThrow(()-> new ResourceNotFoundException("Todo not found with ID:"+ id));

        existingTodo.setTitle(updatedTodo.getTitle());
        existingTodo.setDescription(updatedTodo.getDescription());
        existingTodo.setType(updatedTodo.getType());
        existingTodo.setStatus(updatedTodo.getStatus());
        existingTodo.setAssignedTo(updatedTodo.getAssignedTo());

        return todoRepository.save(existingTodo);
    }

    @Override
    public void deleteTodo(Long id) {
        if(!todoRepository.existsById(id)){
            throw new ResourceNotFoundException("Todo not found with ID:" + id);
        }
        todoRepository.deleteById(id);
    }
}
