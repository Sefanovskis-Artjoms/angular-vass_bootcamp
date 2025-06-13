import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TodoDataService } from '../todo-data-service';
import { Todo } from '../../models/todo';
import { NotificationService } from '../../shared/notification';

import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import {
  catchError,
  finalize,
  Observable,
  of,
  startWith,
  Subject,
  switchMap,
  takeUntil,
} from 'rxjs';

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
    MatProgressSpinnerModule,
  ],
  templateUrl: './todo-list.html',
  styleUrl: './todo-list.scss',
})
export class TodoList implements OnDestroy {
  todos$: Observable<Todo[]>;
  private destroy$ = new Subject<void>();
  private refreshTodos$ = new Subject<void>();
  isDeletingIds = new Set<number>();

  constructor(
    private todoDataService: TodoDataService,
    private notificationService: NotificationService
  ) {
    this.todos$ = this.refreshTodos$.pipe(
      startWith(undefined),
      switchMap(() =>
        this.todoDataService.getTodos().pipe(
          catchError(() => {
            this.notificationService.showMessage(
              'Failed to load todos. Please try again later.'
            );
            return of([]);
          })
        )
      ),
      takeUntil(this.destroy$)
    );
  }

  handleDelete(id: number): void {
    this.isDeletingIds.add(id);
    this.todoDataService
      .deleteTodo(id)
      .pipe(
        finalize(() => {
          this.isDeletingIds.delete(id);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: () => {
          this.refreshTodos$.next();
        },
        error: () => {
          this.notificationService.showMessage(
            'Failed to delete todo. Please try again later.'
          );
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.refreshTodos$.complete();
  }
}
