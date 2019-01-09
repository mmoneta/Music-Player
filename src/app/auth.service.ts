import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class AuthService {
  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<any> {
    return this.http.post<{ access_token: string, alert: string }>('/auth/login', { username: username, password: password })
      .pipe(
        map(result => {
          if (result.access_token) {
            localStorage.setItem('access_token', result.access_token);
            localStorage.setItem('username', username);
            return true;
          }
          return result.alert;
        })
      );
  }

  logout() {
    localStorage.clear();
  }

  public get loggedIn(): boolean {
    return (localStorage.getItem('access_token') !== null);
  }
}
