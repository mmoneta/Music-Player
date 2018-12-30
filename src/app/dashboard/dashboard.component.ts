import { Component, Inject, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, ElementRef, HostListener, ViewEncapsulation } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { Router } from '@angular/router';

import { CreatorComponent } from '../creator/creator.component';
import { UploaderComponent } from '../uploader/uploader.component';
import { SettingsComponent } from '../settings/settings.component';
import { HelperComponent } from '../helper/helper.component';
import { VisualizationComponent } from '../visualization/visualization.component';

import { AuthService } from '../auth.service';
import { DialogService } from '../_services/dialog.service';
import { HttpService } from '../_services/http.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit, OnDestroy {

  dialogRef: any;

  view: string;

  length: number;
  pageSize: number;
  currentPage: number;

  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  constructor(private auth: AuthService,
    private dialog: DialogService,
    private router: Router,
    private http: HttpService,
    private changeDetectorRef: ChangeDetectorRef,
    private media: MediaMatcher
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit() {
    if (localStorage.getItem('album')) {
      this.view = 'album';
    } else {
      this.view = 'albums';
    }

    this.pageSize = 10;
    this.currentPage = 0;
  }

  onListedOfAlbums(): void {
    localStorage.removeItem('album');
    this.view = 'albums';

    this.pageSize = 10;
    this.currentPage = 0;
  }

  onAlbumSelect(name: string) {
    localStorage.setItem('album', name);
    this.view = 'album';

    this.pageSize = 10;
    this.currentPage = 0;
  }

  open_creator(): void {
    this.dialog.open(CreatorComponent, '80%', '60%');
  }

  open_uploader(): void {
    this.dialog.open(UploaderComponent, '80%', '60%');
  }

  open_settings(): void {
    this.dialog.open(SettingsComponent, '80%', '60%');
  }

  open_helper(): void {
    this.dialog.open(HelperComponent, '80%', '60%');
  }

  public handlePaginator(event: { pageIndex: number; pageSize: number; }) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['./login']);
  }

  ngOnDestroy() {
    this.dialog.close();
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
}
