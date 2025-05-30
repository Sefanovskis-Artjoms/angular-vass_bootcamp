import { Injectable } from '@angular/core';
import { Todo } from '../models/todo';

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

  getTodos(): Todo[] {
    return this.todos;
  }

  getTodo(id: number): Todo | undefined {
    return this.todos.find((todo) => todo.id === id);
  }

  addTodo(todo: Todo): void {
    this.todos.push(todo);
  }

  deleteTodoReturn(id: number): Todo[] {
    return (this.todos = this.todos.filter((todo) => todo.id !== id));
  }
  deleteTodo(id: number): void {
    this.todos = this.todos.filter((todo) => todo.id !== id);
  }

  updateTodo(updatedTodo: Todo): void {
    const index = this.todos.findIndex((todo) => todo.id === updatedTodo.id);
    this.todos[index] = updatedTodo;
  }
  constructor() {}
}
