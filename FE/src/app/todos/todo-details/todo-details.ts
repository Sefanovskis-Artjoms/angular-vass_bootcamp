import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { Component } from '@angular/core';
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
export class TodoDetails {
  todo = {
    id: 1,
    title: 'Implement new feature',
    description:
      'This feature will enhance user experience by providing additional functionality.',
    type: 'Feature',
    status: 'Todo',
    createdOn: new Date('2025-05-26'),
  };
}
