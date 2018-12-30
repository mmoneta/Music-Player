import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { HttpService } from '../../../_services/http.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'albums',
  exportAs: 'albums',
  template: `
    <mat-list>
      <mat-list-item *ngFor="let album of albums" class="album" (click)="open_album(album)">
        <mat-icon mat-list-icon>album</mat-icon>
        <h4 class="album-header-name" mat-line>{{ album }}</h4>
        <mat-divider [vertical]="true"></mat-divider>
      </mat-list-item>
    </mat-list>
  `,
  styles: [`
    .mat-list-item {
      color: white;
    }

    .mat-list-item:hover {
      background: #009897;
      border-radius: 25px;
    }

    .album {
      margin-top: 20px;
    }

    .album-header-name {
      padding: 5px;
    }
  `]
})
export class AlbumsComponent implements OnInit {

  lengthValue: number;

  @Input()
  get length() {
    return this.lengthValue;
  }

  set length(val) {
    this.lengthValue = val;
    this.lengthChange.emit(this.lengthValue);
  }

  @Output() lengthChange = new EventEmitter<number>();

  @Input() pageSize: number;
  @Input() pageIndex: number;
  albums;

  // tslint:disable-next-line:no-output-on-prefix
  @Output() onAlbumSelect = new EventEmitter<string>();

  constructor(private http: HttpService) { }

  ngOnInit() {
    this.get_albums();
  }

  get_albums() {
    this.http.post('/albums/list', { 'username': localStorage.getItem('username') }).subscribe(
      data => {
        const selected_data = Object.values(data).slice(this.pageIndex * this.pageSize, this.pageIndex * this.pageSize + this.pageSize);
        this.albums = selected_data;
        this.length = Object.values(data).length;
      },
      error => {
        console.log('Error', error);
      }
    );
  }

  open_album(name: string): void {
    this.onAlbumSelect.emit(name);
  }
}
