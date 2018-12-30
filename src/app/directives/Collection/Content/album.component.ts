import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { AlbumService } from '../../../_services/album.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'album',
  exportAs: 'album',
  template: `
    <mat-list>
      <mat-list-item *ngFor="let track of (tracks | async)" class="track" (click)="open_track(track)">
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
  tracks: Observable<Array<String>>;
  private subscription: Subscription;

  constructor(private albumService: AlbumService) {
    this.tracks = albumService.tracks;
  }

  ngOnInit() {
    this.albumService.loadTracks(localStorage.getItem('username'), localStorage.getItem('album'));
    this.subscription = this.tracks.subscribe(
      tracks => {
        setTimeout(() => {
          this.length = tracks.length;
        }, 0);
      },
      error => console.log(error)
    );
  }

  open_track(name: string): void {
    const audio = document.createElement('audio');
    audio.src = `http://localhost:3000/server/uploads/mmoneta/Andrzej_Piaseczny/${name}`;
    document.body.appendChild(audio);
    audio.play();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.albumService.clearAlbum();
  }
}
