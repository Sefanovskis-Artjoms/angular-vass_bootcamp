import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';

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
  todo = {
    id: 1,
    title: 'Implement new feature',
    description:
      'This feature will enhance user experience by providing additional functionality.',
    type: 'Feature',
    status: 'Todo',
    createdOn: new Date('2025-05-26'),
  };
  editTodoForm: FormGroup;
  constructor(private formBuilder: FormBuilder) {
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
    console.log('All good');
  }

  
}
