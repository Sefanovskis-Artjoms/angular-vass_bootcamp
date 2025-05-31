import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TodoDataService } from '../todo-data-service';
import { Todo } from '../../models/todo';
import { Component, OnInit } from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-todo-details',
  imports: [
    RouterModule,
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './todo-details.html',
  styleUrl: './todo-details.scss',
})
export class TodoDetails implements OnInit {
  todo: Todo | undefined;
  constructor(
    private todoDataService: TodoDataService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      const id: number | undefined = Number(params['id']);
      if (!id) {
        this.router.navigate(['/todo-list']);
      }
      const response: Todo | undefined = this.todoDataService.getTodo(id);
      if (!response) {
        this.router.navigate(['/todo-list']);
      } else {
        this.todo = response;
      }
    });
  }

  handleDelete(): void {
    if (!this.todo) return;
    this.todoDataService.deleteTodo(this.todo.id);
    this.router.navigate(['/todo-list']);
  }
}
