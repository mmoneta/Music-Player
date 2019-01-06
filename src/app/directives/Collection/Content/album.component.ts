import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { AlbumService } from '../../../_services/album.service';
import { Album } from '../../../_models/album';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'album',
  exportAs: 'album',
  template: `
    <visualization [src]="src"></visualization>
    <mat-list>
      <mat-list-item *ngFor="let track of (tracks | async)" class="track" (click)="open_track(track.file)">
        <mat-icon mat-list-icon>music_note</mat-icon>
        <h4 class="track-header-name" mat-line>{{ track.name }}</h4>
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
export class AlbumComponent implements OnInit, OnDestroy {

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

  tracks: Observable<Array<Album>>;
  private tracksSubscription: Subscription;
  src: string;

  constructor(private albumService: AlbumService) {
    this.tracks = albumService.tracks;
  }

  ngOnInit() {
    this.albumService.loadTracks(localStorage.getItem('username'), localStorage.getItem('album'));

    this.tracksSubscription = this.tracks.subscribe(
      tracks => {
        setTimeout(() => {
          this.length = tracks.length;
        }, 0);
      },
      error => console.log(error)
    );
  }

  open_track(name: string): void {
    this.src = `uploads/${localStorage.getItem('username')}/${localStorage.getItem('album')}/${name}`;
  }

  ngOnDestroy() {
    this.tracksSubscription.unsubscribe();
    this.albumService.clearAlbum();
  }
}
