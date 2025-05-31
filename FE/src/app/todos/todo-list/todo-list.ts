import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TodoDataService } from '../todo-data-service';
import { Todo } from '../../models/todo';

import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-todo-list',
  imports: [
    RouterModule,
    CommonModule,
    MatCardModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
  ],
  templateUrl: './todo-list.html',
  styleUrl: './todo-list.scss',
})
export class TodoList implements OnInit {
  todos: Todo[] = [];
  constructor(private todoDataService: TodoDataService) {}
  ngOnInit(): void {
    this.todoDataService.getTodos().subscribe((todos) => {
      this.todos = todos;
    });
  }

  handleDelete(id: number): void {
    this.todoDataService.deleteTodoReturn(id).subscribe((todos: Todo[]) => {
      this.todos = todos;
    });
  }
}
