import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'album-header',
  exportAs: 'album-header',
  template: `
    <div class="row">
      <div class="col-md-3 col-xs-3 d-flex justify-content-center">
        <button mat-icon-button (click)="list_of_albums()">
          <mat-icon>arrow_back_ios</mat-icon>
        </button>
      </div>
      <div class="col-md-9 col-xs-9 d-flex justify-content-center">
        <h3>{{ 'DASHBOARD.PANEL-TITLE-ALBUM' | translate }}</h3>
      </div>
    </div>
  `,
  styles: [`
    h3 {
      color: white;
      font-weight: bold;
    }

    button {
      margin-top: 12px;
    }
  `]
})
export class AlbumHeaderComponent {

  // tslint:disable-next-line:no-output-on-prefix
  @Output() onListedOfAlbums = new EventEmitter<void>();

  list_of_albums(): void {
    this.onListedOfAlbums.emit();
  }
}
