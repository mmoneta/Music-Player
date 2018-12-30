import { Injectable } from '@angular/core';
import { NotificationsService } from 'angular2-notifications';

@Injectable({
  providedIn: 'root'
})
export class Notifications {

  constructor(private _notifications: NotificationsService) { }

  options = {
    timeOut: 5000,
    showProgressBar: true,
    pauseOnHover: true,
    clickToClose: true,
    animate: 'fromRight'
  };

  open(title: string, content: string, type) {
    this._notifications.create(title, content, type, this.options);
  }
}
