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

import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

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
  ],
  templateUrl: './todo-create.html',
  styleUrl: './todo-create.scss',
})
export class TodoCreate {
  createTodoForm: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private todoDataService: TodoDataService
  ) {
    this.createTodoForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      type: ['', Validators.required],
      status: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(10)]],
    });
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
    const newTodo: Todo = {
      // ID is temporary solution, later it will be removed
      // and replaced with a proper ID from the backend
      // Also because of that, later ID will be marked as optional in the model
      id: Date.now(),
      createdOn: new Date(),
      ...this.createTodoForm.value,
    };
    this.todoDataService.addTodo(newTodo);
    this.router.navigate(['/todo-details', newTodo.id]);
  }
}
