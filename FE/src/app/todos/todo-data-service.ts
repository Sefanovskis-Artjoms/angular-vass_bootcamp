import { Injectable } from '@angular/core';
import { Todo } from '../models/todo';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TodoDataService {
  private todos: Todo[] = [
    {
      id: 1,
      title: 'Implement new feature',
      description:
        'This feature will enhance user experience by providing additional functionality.',
      type: 'Feature',
      status: 'Todo',
      createdOn: new Date('2025-05-26'),
    },
    {
      id: 2,
      status: 'Done',
      type: 'Bug',
      title: 'Fix login issue',
      description: 'Resolve the issue preventing users from logging in.',
      createdOn: new Date('2025-05-25'),
    },
  ];

  getTodos(): Observable<Todo[]> {
    return of(this.todos);
  }

  getTodo(id: number): Observable<Todo | undefined> {
    const todo = this.todos.find((todo) => todo.id === id);
    return of(todo);
  }

  addTodo(todo: Todo): Observable<void> {
    this.todos.push(todo);
    return of(void 0);
  }

  deleteTodoReturn(id: number): Observable<Todo[]> {
    this.todos = this.todos.filter((todo) => todo.id !== id);
    return of(this.todos);
  }

  deleteTodo(id: number): Observable<void> {
    this.todos = this.todos.filter((todo) => todo.id !== id);
    return of(void 0);
  }

  updateTodo(updatedTodo: Todo): Observable<void> {
    const index = this.todos.findIndex((todo) => todo.id === updatedTodo.id);
    if (index !== -1) {
      this.todos[index] = updatedTodo;
    }
    return of(void 0);
  }
  constructor() {}
}
