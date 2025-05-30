import { Component } from '@angular/core';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { TodoDataService } from '../todo-data-service';
import { Todo } from '../../models/todo';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

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
  ],
  templateUrl: './todo-edit.html',
  styleUrl: './todo-edit.scss',
})
export class TodoEdit {
  editTodoForm: FormGroup;
  todo!: Todo;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private todoDataService: TodoDataService
  ) {
    const id: number = Number(activatedRoute.snapshot.paramMap.get('id'));
    const response: Todo | undefined = this.todoDataService.getTodo(id);
    if (!response) this.router.navigate(['/todo-list']);
    else {
      this.todo = response;
    }

    this.editTodoForm = this.formBuilder.group({
      title: [this.todo.title, [Validators.required, Validators.minLength(3)]],
      type: [this.todo.type, Validators.required],
      status: [this.todo.status, Validators.required],
      description: [
        this.todo.description,
        [Validators.required, Validators.minLength(10)],
      ],
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
    if (!this.editTodoForm.valid) return;
    const updatedTodo: Todo = {
      ...this.todo,
      ...this.editTodoForm.value,
    };
    this.todoDataService.updateTodo(updatedTodo);
    this.router.navigate(['/todo-details', this.todo.id]);
  }
}
