import { Component, OnInit, EventEmitter } from '@angular/core';
import { HttpService } from '../_services/http.service';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, Validators, FormGroup, FormControl } from '@angular/forms';
import { Notifications } from '../_services/notifications';
import { Language } from '../_services/language';

@Component({
  selector: 'app-creator',
  templateUrl: './creator.component.html',
  styleUrls: ['./creator.component.scss', './creator.responsive.component.scss']
})

export class CreatorComponent implements OnInit {

  creatorForm: FormGroup;
  name: FormControl;
  onUpdateList = new EventEmitter();
  onClose = new EventEmitter<void>();

  constructor(private http: HttpService, private _notifications: Notifications, private language: Language) { }

  ngOnInit() {
    this.createFormControls();
    this.createForm();
  }

  createFormControls(): void {
    this.name = new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.pattern('^[a-zA-ZĄĆĘŁŃÓŚŹŻąćęłńóśźż0-9-_ ]+$')
    ]);
  }

  createForm(): void {
    this.creatorForm = new FormGroup({
      name: this.name
    });
  }

  save(): void {
    if (this.creatorForm.valid) {
      this.http.post('/album/create', { 'username': localStorage.getItem('username'), 'album': this.name.value }).subscribe(
        data => {
          const key = `CREATOR.${data['alert']}`;
          this.language.translate(key).subscribe((value: string) => {
            if (data['reset']) {
              this._notifications.open('Status', value, 'success');
              this.creatorForm.reset();
              this.onUpdateList.emit();
              return true;
            }
            this._notifications.open('Status', value, 'info');
          });
        },
        error => {
          console.log('Error', error);
        }
      );
    }
  }

  close(): void {
    this.onClose.emit();
  }
}
