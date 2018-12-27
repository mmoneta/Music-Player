import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { HttpService } from '../../../services/http.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'album',
  exportAs: 'album',
  template: `
    <mat-list>
      <mat-list-item *ngFor="let track of tracks" class="track" (click)="open_track(track)">
        <mat-icon mat-list-icon>music_note</mat-icon>
        <h4 class="track-header-name" mat-line>{{ track }}</h4>
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

    .track {
      margin-top: 20px;
    }

    .track-header-name {
      padding: 5px;
    }
  `]
})
export class AlbumComponent implements OnInit {

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
  tracks;

  constructor(private http: HttpService) { }

  ngOnInit() {
    this.get_tracks(localStorage.getItem('album'));
  }

  get_tracks(name: string): void {
    this.http.post('/album/list', { 'username': localStorage.getItem('username'), 'album': name }).subscribe(
      data => {
        if (data) {
          const selected_data = Object.values(data).slice(this.pageIndex * this.pageSize, this.pageIndex * this.pageSize + this.pageSize);
          this.tracks = selected_data;
          this.length = Object.values(data).length;
        } else {
          this.length = 0;
        }
      },
      error => {
        console.log('Error', error);
      }
    );
  }

  open_track(name: string): void {
    console.log(name);
  }
}
