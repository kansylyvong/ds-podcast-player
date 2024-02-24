import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(username: string, password: string) {
    const url = 'http://localhost:3000/login';
    const body = { username, password };
    return this.http.post(url, body,{ responseType: 'text' });
  }
}
