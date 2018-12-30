import { Component, OnInit, Input } from '@angular/core';
import { Language } from './_services/language';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})

export class AppComponent implements OnInit {

  languages: { value: string, view_value: string }[];
  current_language: string;

  constructor(private language: Language) { }

  ngOnInit() {
    this.languages = this.language.list;
    this.current_language = this.language.current;
  }

  changeLanguage(value: string) {
    this.language.change(value);
  }
}
