import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-todo-edit',
  imports: [
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
}
