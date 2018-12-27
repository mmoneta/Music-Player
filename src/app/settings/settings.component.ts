import { Component, OnInit, EventEmitter } from '@angular/core';
import { Language } from '../services/language';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss', './settings.responsive.component.scss']
})
export class SettingsComponent implements OnInit {

  languages = new Array();
  language_index: number;
  onClose = new EventEmitter<void>();

  constructor(private language: Language) { }

  ngOnInit() {
    const current_language = this.language.current,
    languages_list = this.language.list;

    this.language_index = languages_list.findIndex(item => item.value === current_language);
    this.languages.push(languages_list[this.language_index]);

    for (const lang of languages_list) {
      if (lang.value !== current_language) {
        this.languages.push(lang);
      }
    }

    this.language_index = -1;
  }

  onValueChanged(value: number): void {
    this.language_index = value;
  }

  save(): void {
    const current_language = this.language.current;
    if (this.language_index !== -1 && this.languages[this.language_index].value !== current_language) {
      this.language.change(this.languages[this.language_index].value);
      this.onClose.emit();
    }
  }

  close(): void {
    this.onClose.emit();
  }
}
