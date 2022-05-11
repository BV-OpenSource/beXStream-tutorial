import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router} from '@angular/router';


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
    

    this.http.post<any>('https://bexstream.beyond-vision.pt/api/v1/auth/user', this.user)
    .subscribe((result) => {
				if (result.user) {
          alert(`${result.user.username} has benn successfully logged in!`);
          this.webStorage.storageToken(result.token);
          this.router.navigate([this.defaultURLRoute]);
				} else {
          alert(`Error on login. Please check the username and the password!.`);
        }
			});
	}
}
