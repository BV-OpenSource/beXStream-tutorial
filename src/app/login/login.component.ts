import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { WebStorageService } from '../lib/web-storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {

  user = { username: '', password: '' }; // see body on OpenAPI definition for POST /api/v1/auth/user

  loginForm = this.formBuilder.group({
    username: '',
    password: ''
  });

  private readonly defaultURLRoute = 'drones';

  constructor(private formBuilder: FormBuilder,
    private http: HttpClient,
    private webStorage: WebStorageService,
    private router: Router) { }

  ngOnInit(): void {
    this.user = { username: '', password: '' };
    this.webStorage.removeStoredToken(); // implicit logout on init
  }

  /**
   * User authentication
   */
  public authenticate(): void {
    const loginFormValues = this.loginForm.value;
    this.user.username = loginFormValues.username;
    this.user.password = loginFormValues.password;

    this.http.post<{ token: string }>('/api/v1/auth/user', this.user)
      .subscribe({
        next: (result) => {
          if (result?.token) {
            this.webStorage.storageToken(result.token as string);
            alert(`${this.user.username} has been successfully logged in!`);
          } else {
            alert(`Unexpected response from the server for /api/v1/auth/user. Check the network request/response for details!`);
          }
        },
        error: (err) => {
          alert(`Error on login. Please check the username and the password!.`);
        }
      });
  }
}
