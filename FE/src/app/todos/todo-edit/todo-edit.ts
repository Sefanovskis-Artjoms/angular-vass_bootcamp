import { Component, OnInit } from '@angular/core';
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
export class TodoEdit implements OnInit {
  editTodoForm: FormGroup;
  todo: Todo | undefined;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private todoDataService: TodoDataService
  ) {
    this.editTodoForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      type: ['', Validators.required],
      status: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      const id: number | undefined = Number(params['id']);
      if (!id) {
        this.router.navigate(['/todo-list']);
      }
      const response: Todo | undefined = this.todoDataService.getTodo(id);
      if (!response) {
        this.router.navigate(['/todo-list']);
      } else {
        this.todo = response;
      }

      this.editTodoForm.patchValue({
        title: this.todo?.title,
        type: this.todo?.type,
        status: this.todo?.status,
        description: this.todo?.description,
      });
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
    this.router.navigate(['/todo-details', this.todo?.id]);
  }
}
