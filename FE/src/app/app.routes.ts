import { Routes } from '@angular/router';
import { TodoList } from './todos/todo-list/todo-list';
import { TodoCreate } from './todos/todo-create/todo-create';
import { TodoEdit } from './todos/todo-edit/todo-edit';
import { TodoDetails } from './todos/todo-details/todo-details';

export const routes: Routes = [
  { path: '', redirectTo: 'todo-list', pathMatch: 'full' },
  { path: 'todo-list', component: TodoList },
  { path: 'todo-create', component: TodoCreate },
  { path: 'todo-edit/:id', component: TodoEdit },
  { path: 'todo-details/:id', component: TodoDetails },
  { path: '**', redirectTo: 'todo-list' },
];
