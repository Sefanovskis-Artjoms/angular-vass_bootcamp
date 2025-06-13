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
    return todoService
            .getTodoById(id)
            .map(ResponseEntity::ok).
            orElse(ResponseEntity.notFound().build());
  }

  @PostMapping
  public ResponseEntity<Todo> createTodo(@RequestBody Todo todo){
    return ResponseEntity
            .status(HttpStatus.CREATED).
            body(todoService.addTodo(todo));
  }

  @PutMapping("/{id}")
  public ResponseEntity<Todo> updateTodo(@PathVariable Long id, @RequestBody Todo updatedTodo){
    if (updatedTodo.getId() != null && !updatedTodo.getId().equals(id)) {
      return ResponseEntity.badRequest().build();
    }
    return todoService.getTodoById(id)
        .map(existing -> {
          Todo updated = todoService.updateTodo(updatedTodo);
          return ResponseEntity.ok(updated);
        })
        .orElse(ResponseEntity.notFound().build());
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteTodo(@PathVariable Long id) {
      Optional<Todo> todo = todoService.getTodoById(id);
      if(todo.isPresent()){
          todoService.deleteTodo(id);
          return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
      }else{
          return ResponseEntity.notFound().build();
      }
  }

}
