import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TodoDataService } from '../todo-data-service';
import { Todo } from '../../models/todo';
import { Component, OnDestroy } from '@angular/core';
import {
  EMPTY,
  filter,
  first,
  Observable,
  Subject,
  switchMap,
  take,
  takeUntil,
  tap,
} from 'rxjs';

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
export class TodoDetails implements OnDestroy {
  todo$: Observable<Todo>;
  private destroy$ = new Subject<void>();

  constructor(
    private todoDataService: TodoDataService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.todo$ = this.activatedRoute.params.pipe(
      switchMap((params) => {
        const id: number | undefined = Number(params['id']);
        if (!id) {
          this.router.navigate(['/todo-list']);
          return EMPTY;
        }
        return this.todoDataService.getTodo(id);
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
  }

  handleDelete(id: number): void {
    this.todoDataService
      .deleteTodo(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.router.navigate(['/todo-list']);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
