import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, Validators, FormGroup, FormControl } from '@angular/forms';
import { HttpService } from '../services/http.service';
import { Notifications } from '../services/notifications';
import { Language } from '../services/language';

@Component({
  selector: 'app-register',
  templateUrl: 'register.component.html',
  styleUrls: ['register.component.scss']
})

export class RegisterComponent implements OnInit {

  constructor(private http: HttpService, private _notifications: Notifications, private language: Language) { }

  registerForm: FormGroup;
  username: FormControl;
  email: FormControl;
  password: FormControl;
  repeat_password: FormControl;

  ngOnInit() {
    this.createFormControls();
    this.createForm();
  }

  createFormControls(): void {
    this.username = new FormControl('', Validators.required);
    this.email = new FormControl('', [
      Validators.required,
      Validators.pattern('[^ @]*@[^ @]*')
    ]);
    this.password = new FormControl('', [
      Validators.required,
      Validators.minLength(8)
    ]);
    this.repeat_password = new FormControl('', [
      Validators.required,
      Validators.minLength(8)
    ]);
  }

  createForm(): void {
    this.registerForm = new FormGroup({
      username: this.username,
      email: this.email,
      password: this.password,
      repeat_password: this.repeat_password
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.http.post('/auth/register', { 'username': this.username.value, 'email': this.email.value, 'password': this.password.value }).subscribe(
        data => {
          const key = `REGISTER.${data['alert']}`;
          this.language.translate(key).subscribe((value: string) => {
            if (data['reset']) {
              this._notifications.open('Status', value, 'success');
              this.registerForm.reset();
              return true;
            }
            this._notifications.open('Status', value, 'error');
          });
        },
        error => {
          console.log('Error', error);
        }
      );
    }
  }
}
