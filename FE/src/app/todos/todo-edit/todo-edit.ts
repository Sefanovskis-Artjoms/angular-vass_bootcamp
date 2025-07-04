import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { TodoDataService } from '../todo-data-service';
import { UserDataService } from '../../users/user-data-service';
import { NotificationService } from '../../shared/notification';
import { Todo } from '../../models/todo';
import { User } from '../../models/user';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import {
  catchError,
  EMPTY,
  filter,
  finalize,
  map,
  Observable,
  of,
  startWith,
  Subject,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import { UsersViewModel } from '../../models/user-view-model';

@Component({
  selector: 'app-todo-edit',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './todo-edit.html',
  styleUrl: './todo-edit.scss',
})
export class TodoEdit implements OnInit, OnDestroy {
  editTodoForm: FormGroup;
  todo: Todo | undefined;
  destroy$ = new Subject<void>();
  isUpdating = false;
  userVm$: Observable<UsersViewModel>;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private todoDataService: TodoDataService,
    private userDataService: UserDataService,
    private notificationService: NotificationService
  ) {
    this.editTodoForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      type: ['', Validators.required],
      status: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(10)]],
      assignedTo: [''],
    });

    this.userVm$ = this.userDataService.getUsers().pipe(
      map((users) => ({
        users,
        isLoading: false,
        hasError: false,
      })),
      startWith({
        users: [],
        isLoading: true,
        hasError: false,
      }),
      catchError(() => {
        this.notificationService.showMessage(
          'Failed to load users. Please try again later.'
        );
        return of({
          users: [],
          isLoading: false,
          hasError: true,
        });
      }),
      takeUntil(this.destroy$)
    );
  }

  ngOnInit() {
    this.activatedRoute.params
      .pipe(
        switchMap((params) => {
          const id: number = Number(params['id']);
          if (!id) {
            this.router.navigate(['/todo-list']);
            return EMPTY;
          }
          return this.todoDataService.getTodoById(id);
        }),
        tap((todo) => {
          if (!todo) {
            this.router.navigate(['/todo-list']);
          }
        }),
        filter((todo) => !!todo),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (todo) => {
          this.todo = todo;

          this.editTodoForm.patchValue({
            title: this.todo.title,
            type: this.todo.type,
            status: this.todo.status,
            assignedTo: this.todo.assignedTo || 'unassigned',
            description: this.todo.description,
          });
        },
        error: () => {
          this.notificationService.showMessage(
            'Failed to load todo. Please try again later.'
          );
          this.router.navigate(['/todo-list']);
        },
      });
  }
  get title() {
    return this.editTodoForm.get('title');
  }
  get type() {
    return this.editTodoForm.get('type');
  }
  get status() {
    return this.editTodoForm.get('status');
  }
  get description() {
    return this.editTodoForm.get('description');
  }

  onSubmit() {
    if (!this.editTodoForm.valid || !this.todo) return;
    if (this.editTodoForm.value.assignedTo === 'unassigned') {
      this.editTodoForm.value.assignedTo = null;
    }
    const updatedTodo: Todo = {
      ...this.todo,
      ...this.editTodoForm.value,
    };
    this.isUpdating = true;
    this.todoDataService
      .updateTodo(updatedTodo)
      .pipe(
        finalize(() => {
          this.isUpdating = false;
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: () => {
          this.router.navigate(['/todo-details', this.todo?.id]);
        },
        error: () => {
          this.notificationService.showMessage(
            'Failed to update todo. Please try again later.'
          );
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
