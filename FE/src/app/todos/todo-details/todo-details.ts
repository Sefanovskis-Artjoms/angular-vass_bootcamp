import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TodoDataService } from '../todo-data-service';
import { Todo } from '../../models/todo';

import { Component } from '@angular/core';
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
export class TodoDetails {
  todo!: Todo;
  constructor(
    private todoDataService: TodoDataService,
    activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    const id: number = Number(activatedRoute.snapshot.paramMap.get('id'));
    const response: Todo | undefined = this.todoDataService.getTodo(id);
    if (!response) this.router.navigate(['/todo-list']);
    else {
      this.todo = response;
    }
  }

  handleDelete(): void {
    if (!this.todo) return;
    this.todoDataService.deleteTodo(this.todo.id);
    this.router.navigate(['/todo-list']);
  }
}
