import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TodoDataService } from '../todo-data-service';
import { UserDataService } from '../../users/user-data-service';
import { NotificationService } from '../../shared/notification';
import { Todo } from '../../models/todo';
import { User } from '../../models/user';
import { Component, OnDestroy, inject } from '@angular/core';
import {
  catchError,
  EMPTY,
  filter,
  finalize,
  Observable,
  of,
  Subject,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

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
    MatProgressSpinnerModule,
  ],
  templateUrl: './todo-details.html',
  styleUrl: './todo-details.scss',
})
export class TodoDetails implements OnDestroy {
  private todoDataService = inject(TodoDataService);
  private userDataService = inject(UserDataService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private notificationService = inject(NotificationService);

  todo$: Observable<Todo>;
  user$: Observable<User | null>;
  private destroy$ = new Subject<void>();
  isDeleting = false;

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {
    this.todo$ = this.activatedRoute.params.pipe(
      switchMap((params) => {
        const id: number | undefined = Number(params['id']);
        if (!id) {
          this.router.navigate(['/todo-list']);
          return EMPTY;
        }
        return this.todoDataService.getTodoById(id).pipe(
          catchError(() => {
            this.notificationService.showMessage(
              'Failed to load todo. Please try again later.'
            );
            this.router.navigate(['/todo-list']);
            return EMPTY;
          })
        );
      }),
      tap((todo) => {
        if (!todo) {
          this.router.navigate(['/todo-list']);
        }
      }),
      filter((todo) => !!todo), // Comment for myself !! turns a value into a boolean, its just double ! operator
      // Another comment for myself: tap deals with side effects, while filter is to prevent issues whre undefined is passed to the template
      takeUntil(this.destroy$)
    );

    this.user$ = this.todo$.pipe(
      switchMap((todo) => {
        if (!todo.assignedTo) return of(null);
        return this.userDataService.getUserById(todo.assignedTo).pipe(
          catchError(() => {
            this.notificationService.showMessage(
              'Failed to load assigned user details. Please try again later.'
            );
            this.router.navigate(['/todo-list']);
            return EMPTY;
          })
        );
      }),
      takeUntil(this.destroy$)
    );
  }

  handleDelete(id: number): void {
    this.isDeleting = true;
    this.todoDataService
      .deleteTodo(id)
      .pipe(
        finalize(() => {
          this.isDeleting = false;
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: () => {
          this.router.navigate(['/todo-list']);
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
  }
}
