import { Injectable } from '@angular/core';
import { Todo } from '../models/todo';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TodoDataService {
  private todoApiUrl = environment.apiUrl + '/todos';
  constructor(private http: HttpClient) {}

  getTodos(): Observable<Todo[]> {
    return this.http.get<Todo[]>(this.todoApiUrl);
  }

  getTodoById(id: number): Observable<Todo> {
    return this.http.get<Todo>(`${this.todoApiUrl}/${id}`);
  }

  addTodo(todo: Todo): Observable<Todo> {
    return this.http.post<Todo>(this.todoApiUrl, todo);
  }

  deleteTodo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.todoApiUrl}/${id}`);
  }

  updateTodo(updatedTodo: Todo): Observable<void> {
    return this.http.put<void>(
      `${this.todoApiUrl}/${updatedTodo.id}`,
      updatedTodo
    );
  }
}
