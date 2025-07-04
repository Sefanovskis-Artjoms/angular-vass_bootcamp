import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { Todo } from '../../models/todo';
import { TodoDataService } from '../todo-data-service';
import { UserDataService } from '../../users/user-data-service';
import {
  catchError,
  finalize,
  map,
  Observable,
  of,
  startWith,
  Subject,
  takeUntil,
} from 'rxjs';
import { Component, OnDestroy } from '@angular/core';
import { NotificationService } from '../../shared/notification';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UsersViewModel } from '../../models/user-view-model';

@Component({
  selector: 'app-todo-create',
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './todo-create.html',
  styleUrl: './todo-create.scss',
})
export class TodoCreate implements OnDestroy {
  createTodoForm: FormGroup;
  private destroy$ = new Subject<void>();
  isSubmitting = false;
  userVm$: Observable<UsersViewModel>;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private todoDataService: TodoDataService,
    private userDataService: UserDataService,
    private notificationService: NotificationService
  ) {
    this.createTodoForm = this.formBuilder.group({
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

  get title() {
    return this.createTodoForm.get('title');
  }
  get status() {
    return this.createTodoForm.get('status');
  }
  get type() {
    return this.createTodoForm.get('type');
  }
  get description() {
    return this.createTodoForm.get('description');
  }
  onSubmit() {
    if (!this.createTodoForm.valid) return;
    if (this.createTodoForm.value.assignedTo === 'unassigned') {
      this.createTodoForm.value.assignedTo = null;
    }
    const newTodo: Todo = {
      ...this.createTodoForm.value,
    };
    this.isSubmitting = true;
    this.todoDataService
      .addTodo(newTodo)
      .pipe(
        finalize(() => {
          this.isSubmitting = false;
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (createdTodo) => {
          this.router.navigate(['/todo-details', createdTodo.id]);
        },
        error: () => {
          this.notificationService.showMessage(
            'Failed to create todo. Please try again later.'
          );
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
