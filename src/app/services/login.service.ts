import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LoginInterface {
  data: {
    token: string;
  };
  succeeded: boolean;
  statusCode: string;
  errors: string[];
}

export enum LoginStatus {
  Success = 0,
  Fail = 1,
}

export interface LogInterface {
  id: number;
  email: string;
  loggedAt: Date;
  status: LoginStatus;
}

export interface LogDataInterface {
  data: {
    items: LogInterface[];
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

export const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    authorization: `Bearer ${localStorage.getItem('token')}`,
  }),
};

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private apiUrl = 'https://localhost:7059/logins';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<LoginInterface> {
    const data = {
      email: email,
      password: password,
    };
    return this.http.post<LoginInterface>(`${this.apiUrl}/login`, data, httpOptions);
  }

  logs(pageNumber: number, pageSize: number): Observable<LogDataInterface> {
    const params = new HttpParams().set('pageNumber', pageNumber.toString()).set('pageSize', pageSize.toString());
    return this.http.get<LogDataInterface>(this.apiUrl, { params, headers: httpOptions.headers });
  }

  filter(pageNumber: number, pageSize: number, searchQuery: string): Observable<LogDataInterface> {
    const data = {
      searchQuery: searchQuery,
      pageNumber: pageNumber,
      pageSize: pageSize,
    };
    return this.http.post<LogDataInterface>(`${this.apiUrl}/filter`, data, httpOptions);
  }
}
