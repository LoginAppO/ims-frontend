import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { httpOptions } from './login.service';

export interface UserInterface {
  id: number;
  email: string;
}

export interface UserDataInterface {
  data: {
    items: UserInterface[];
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    pageNumber: number;
    pageSize: number;
    totalCount: number;
  };
  succeeded: boolean;
  statusCode: string;
  errors: string[];
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'https://localhost:7059/users';

  constructor(private http: HttpClient) {}

  add(email: string, password: string): Observable<UserInterface> {
    const data = {
      email: email,
      password: password,
    };
    return this.http.post<UserInterface>(`${this.apiUrl}`, data, httpOptions);
  }

  users(pageNumber: number, pageSize: number): Observable<UserDataInterface> {
    const params = new HttpParams().set('pageNumber', pageNumber.toString()).set('pageSize', pageSize.toString());
    return this.http.get<UserDataInterface>(this.apiUrl, { params, headers: httpOptions.headers });
  }

  filter(pageNumber: number, pageSize: number, searchQuery: string): Observable<UserDataInterface> {
    const data = {
      searchQuery: searchQuery,
      pageNumber: pageNumber,
      pageSize: pageSize,
    };
    return this.http.post<UserDataInterface>(`${this.apiUrl}/filter`, data, httpOptions);
  }
}
