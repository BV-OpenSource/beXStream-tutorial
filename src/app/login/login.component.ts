import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';


import { User } from './models/user';
import { WebStorageService } from '../lib/web-storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {

  user: User = new User();

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
            const token = result.token;
            this.webStorage.storageToken(token);
            this.http.post<any>(
              '/api/v1/auth/get/current',
              null, // no body, just the bearer token
              { headers: { 'Authorization': `Bearer ${token}` } }
            ).subscribe((result) => {
              alert(`${result.username} has benn successfully logged in!`);
              this.router.navigate([this.defaultURLRoute]);
            });
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
