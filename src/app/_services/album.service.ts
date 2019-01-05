import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store, select } from '@ngrx/store';
import { HttpService } from './http.service';
import { AppStore } from '../app.store';
import 'rxjs/add/operator/map';
import { Album } from '../_models/album';

@Injectable()
export class AlbumService {
  // Redux based variables
  tracks: Observable<Array<Album>>;

  constructor(private http: HttpService,
    private store: Store<AppStore>
  ) {
    this.tracks = store.pipe(select('album'));
  }

  loadTracks(username: string, name: string)  {
    return this.http.post('/album/list', { 'username': username, 'album': name })
    .map((payload: String[]) => {
      return { type: 'ADD_TRACKS', payload: payload };
    })
    .subscribe((action) => {
      this.store.dispatch(action);
    });
  }

  clearAlbum() {
    this.store.dispatch({ type: 'CLEAR_ALBUM' });
  }
}
