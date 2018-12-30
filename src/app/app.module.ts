import { BrowserModule } from '@angular/platform-browser';
import { CookieService } from 'ngx-cookie-service';
import { NgModule } from '@angular/core';
import { Observable, Subject, ReplaySubject, from, of, range } from 'rxjs';
import { map, filter, switchMap } from 'rxjs/operators';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { Http, HttpModule} from '@angular/http';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { httpLoaderFactory } from './_services/httpLoaderFactory';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HelperComponent } from './helper/helper.component';
import { CreatorComponent } from './creator/creator.component';
import { UploaderComponent } from './uploader/uploader.component';
import { SettingsComponent } from './settings/settings.component';
import { VisualizationComponent } from './visualization/visualization.component';

import { AlbumHeaderComponent } from './directives/Collection/Header/album-header.component';
import { AlbumsHeaderComponent } from './directives/Collection/Header/albums-header.component';
import { AlbumComponent } from './directives/Collection/Content/album.component';
import { AlbumsComponent } from './directives/Collection/Content/albums.component';

import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';

import { MaterialModule } from './_services/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';

import { CarouselComponent, CarouselItemElement } from './directives/Carousel/carousel.component';
import { CarouselItemDirective } from './directives/Carousel/carousel-item.directive';

import { WINDOW_PROVIDERS } from './_services/window.provider';

import { Language } from './_services/language';

import { SimpleNotificationsModule } from 'angular2-notifications';
import { Notifications } from './_services/notifications';

import { StoreModule } from '@ngrx/store';
import { AlbumReducer } from './_reducers/album.reducer';
import { AlbumService } from './_services/album.service';


@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    DashboardComponent,
    HelperComponent,
    UploaderComponent,
    SettingsComponent,
    VisualizationComponent,
    AlbumHeaderComponent,
    AlbumsHeaderComponent,
    AlbumComponent,
    AlbumsComponent,
    CarouselComponent,
    CarouselItemDirective,
    CarouselItemElement,
    CreatorComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MaterialModule,
    FlexLayoutModule,
    BrowserAnimationsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
          useFactory: httpLoaderFactory,
          deps: [HttpClient]
        }
    }),
    SimpleNotificationsModule.forRoot(),
    StoreModule.forRoot({ album: AlbumReducer })
  ],
  providers: [AlbumService, CookieService, Language, AuthService, AuthGuard, WINDOW_PROVIDERS],
  bootstrap: [AppComponent],
  entryComponents: [CreatorComponent, UploaderComponent, HelperComponent, SettingsComponent]
})

export class AppModule { }
