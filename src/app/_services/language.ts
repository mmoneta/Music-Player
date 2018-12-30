import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Language {

  list: { value: string, view_value: string }[] = [{ value: 'pl', view_value: 'Polski' }, { value: 'en', view_value: 'English' }];
  current_language: string;

  constructor (private cookieService: CookieService, private _translate: TranslateService) {
    this.current_language = this.cookieService.get('Language') || 'en';
    this._translate.setDefaultLang(this.current_language);
    this._translate.use(this.current_language);
  }

  get current(): string {
    this.current_language = this.cookieService.get('Language') || 'en';
    return this.current_language;
  }

  translate(key: string | string[]): Observable<String> {
    return this._translate.get(key);
  }

  change(value: string): void {
    this.cookieService.set('Language', value);
    this._translate.setDefaultLang(value);
    this._translate.use(value);
  }
}
