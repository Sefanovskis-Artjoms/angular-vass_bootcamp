package com.example.todo_backend.controller;


import java.util.List;
import java.util.Optional;

import com.example.todo_backend.service.TodoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.todo_backend.model.Todo;

@RestController
@RequestMapping("api/todos")

public class TodoController {
  private final TodoService todoService;

  public TodoController(TodoService todoService) {
    this.todoService = todoService;
  }

  @GetMapping
  public List<Todo> getAllTodos() {
    return todoService.getAllTodos();
  }

  @GetMapping("/{id}")
  public ResponseEntity<Todo> getTodoById(@PathVariable Long id){
      Todo todo = todoService.getTodoById(id);
      return ResponseEntity.ok(todo);
  }

  @PostMapping
  public ResponseEntity<Todo> createTodo(@RequestBody Todo todo){
      Todo createdTodo = todoService.addTodo(todo);
      return ResponseEntity
              .status(HttpStatus.CREATED)
              .body(createdTodo);
  }

  @PutMapping("/{id}")
  public ResponseEntity<Todo> updateTodo(@PathVariable Long id, @RequestBody Todo updatedTodoData){
      Todo updatedTodo = todoService.updateTodo(id, updatedTodoData);
      return ResponseEntity.ok(updatedTodo);
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteTodo(@PathVariable Long id) {
      todoService.deleteTodo(id);
      return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
  }

}
