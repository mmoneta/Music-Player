import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription, fromEvent } from 'rxjs';
import { AlbumService } from '../../../_services/album.service';
import { Album } from '../../../_models/album';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'album',
  exportAs: 'album',
  template: `
    <visualization [active]="!visualizationView" [hidden]="visualizationView" [src]="src"></visualization>
    <mat-list>
      <mat-list-item *ngFor="let track of (tracks | async)" class="track" (click)="open_track($event, track.file)">
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

    .mat-list-item:hover, .current {
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

  visualizationView = true;
  keyboardSubscription: Subscription;

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

    this.keyboardSubscription = fromEvent(document, 'keydown').subscribe(
      (e: KeyboardEvent) => {
        switch (e.keyCode) {
          case 86:
            this.visualizationView = !this.visualizationView;
            break;
        }
      },
      error => console.log(error)
    );
  }

  open_track(e: MouseEvent, name: string): void {
    if (document.querySelector('.current')) {
      document.querySelector('.current').classList.remove('current');
    }
    (<HTMLElement> e.target).closest('mat-list-item').classList.add('current');

    this.src = `uploads/${localStorage.getItem('username')}/${localStorage.getItem('album')}/${name}`;
  }

  ngOnDestroy() {
    this.tracksSubscription.unsubscribe();
    this.keyboardSubscription.unsubscribe();
    this.albumService.clearAlbum();
  }
}
