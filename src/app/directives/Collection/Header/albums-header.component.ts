import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'albums-header',
  exportAs: 'albums-header',
  template: `
    <h3>{{ 'DASHBOARD.PANEL-TITLE-ALBUMS' | translate }}</h3>
  `,
  styles: [`
    h3 {
      color: white;
      font-weight: bold;
    }
  `]
})
export class AlbumsHeaderComponent {

  // tslint:disable-next-line:no-output-on-prefix
  @Output() onListedOfAlbums = new EventEmitter<void>();

  list_of_albums(): void {
    this.onListedOfAlbums.emit();
  }
}
