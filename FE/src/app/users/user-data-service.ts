import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { User } from '../models/user';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserDataService {
  private http = inject(HttpClient);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(environment.userApiUrl);
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${environment.userApiUrl}/${id}`);
  }

  addUser(user: User): Observable<User> {
    return this.http.post<User>(environment.userApiUrl, user);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.userApiUrl}/${id}`);
  }

  updateUser(updatedUser: User): Observable<User> {
    return this.http.put<User>(
      `${environment.userApiUrl}/${updatedUser.id}`,
      updatedUser
    );
  }
}
