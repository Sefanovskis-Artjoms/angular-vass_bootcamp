import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

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
export class TodoList {
  todos = [
    {
      id: 1,
      title: 'Implement new feature',
      description:
        'This feature will enhance user experience by providing additional functionality.',
      type: 'Feature',
      status: 'Todo',
      createdOn: new Date('2025-05-26'),
    },
    {
      id: 2,
      status: 'Done',
      type: 'Bug',
      title: 'Fix login issue',
      createdOn: new Date('2025-05-25'),
    },
  ];
}
