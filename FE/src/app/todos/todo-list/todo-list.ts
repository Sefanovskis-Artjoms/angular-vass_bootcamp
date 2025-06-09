import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TodoDataService } from '../todo-data-service';
import { Todo } from '../../models/todo';

import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { Observable, startWith, Subject, switchMap, takeUntil } from 'rxjs';

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
export class TodoList implements OnDestroy {
  todos$: Observable<Todo[]>;
  private destroy$ = new Subject<void>();
  private refreshTodos$ = new Subject<void>();

  constructor(private todoDataService: TodoDataService) {
    this.todos$ = this.refreshTodos$.pipe(
      startWith(undefined),
      switchMap(() => this.todoDataService.getTodos()),
      takeUntil(this.destroy$)
    );
  }

  handleDelete(id: number): void {
    this.todoDataService
      .deleteTodo(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.refreshTodos$.next();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.refreshTodos$.complete();
  }
}
