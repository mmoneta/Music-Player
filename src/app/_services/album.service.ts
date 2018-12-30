import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store, select } from '@ngrx/store';
import { HttpService } from './http.service';
import { Response, Http } from '@angular/http';
import { AppStore } from '../app.store';
import { map } from 'rxjs/operators';
import 'rxjs/add/operator/map';

@Injectable()
export class AlbumService {
  // Redux based variables
  tracks: Observable<Array<String>>;

  constructor(private http: HttpService,
    private store: Store<AppStore>
  ) {
    // tslint:disable-next-line:no-shadowed-variable
    this.tracks = store.pipe(select('album'));
  }

  loadTracks(username: string, name: string)  {
    return this.http.post('/album/list', { 'username': username, 'album': name })
    .map((payload: String[]) => {
      return { type: 'ADD_TRACK', payload: payload };
    })
    .subscribe((action) => {
      this.store.dispatch(action);
    });
  }
}
