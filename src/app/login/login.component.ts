import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, Validators, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Notifications } from '../_services/notifications';

import { AuthService } from '../auth.service';
import { Language } from '../_services/language';

@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.scss']
})

export class LoginComponent implements OnInit {

  constructor(private auth: AuthService, private _notifications: Notifications, private language: Language, private router: Router) { }

  loginForm: FormGroup;
  username: FormControl;
  password: FormControl;
  error: string;

  ngOnInit() {
    this.createFormControls();
    this.createForm();
  }

  createFormControls(): void {
    this.username = new FormControl('', Validators.required);
    this.password = new FormControl('', [
      Validators.required,
      Validators.minLength(8)
    ]);
  }

  createForm(): void {
    this.loginForm = new FormGroup({
      username: this.username,
      password: this.password
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.auth.login(this.username.value, this.password.value)
      .subscribe(
        result => {
          if (result === true) {
            return this.router.navigate(['./dashboard']);
          }
          const key = `LOGIN.${result}`;
          this.language.translate(key).subscribe((value: string) => {
            this._notifications.open('Status', value, 'error');
          });
        },
        err => this.error = 'Could not authenticate'
      );
    }
  }
}
