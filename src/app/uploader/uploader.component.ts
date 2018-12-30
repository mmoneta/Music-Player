import { Component, OnInit, EventEmitter, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { ReactiveFormsModule, Validators, FormGroup, FormControl } from '@angular/forms';
import { Notifications } from '../_services/notifications';
import { Language } from '../_services/language';
import { HttpService } from '../_services/http.service';
import { AlbumService } from '../_services/album.service';

@Component({
  selector: 'app-uploader',
  templateUrl: 'uploader.component.html',
  styleUrls: ['uploader.component.scss']
})

export class UploaderComponent implements OnInit {

  albums: Object;

  uploaderForm: FormGroup;
  album: FormControl;
  trackname: FormControl;
  file: FormControl;
  selected_file;
  onClose = new EventEmitter<void>();

  @ViewChild('fileInput') fileInput: ElementRef;

  constructor(private http: HttpService,
    private albumService: AlbumService,
    private _notifications: Notifications,
    private language: Language,
    private cd: ChangeDetectorRef) { }

  ngOnInit() {
    this.createFormControls();
    this.createForm();

    this.http.post('/albums/list', { 'username': localStorage.getItem('username') }).subscribe(
      data => {
        this.albums = data;
      },
      error => {
        console.log('Error', error);
      }
    );
  }

  createFormControls(): void {
    this.album = new FormControl('', [
      Validators.required
    ]);
    this.trackname = new FormControl('', [
      Validators.required,
      Validators.minLength(4)
    ]);
    this.file = new FormControl('', [
      Validators.required
    ]);
  }

  createForm(): void {
    this.uploaderForm = new FormGroup({
      album: this.album,
      trackname: this.trackname,
      file: this.file
    });
  }

  openInput() {
    this.fileInput.nativeElement.click();
  }

  onFileChange(event) {
    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);

      reader.onload = () => {
        this.selected_file = reader.result;
        this.cd.markForCheck();
      };
    }
  }

  save(): void {
    if (this.uploaderForm.valid) {
      const uploadData = new FormData();
      uploadData.append('username', localStorage.getItem('username'));
      uploadData.append('album', this.album.value);
      uploadData.append('trackname', this.trackname.value);
      uploadData.append('file', this.selected_file);

      this.http.post('/album/upload', uploadData).subscribe(
        data => {
          this.albumService.loadTracks(localStorage.getItem('username'), localStorage.getItem('album'));
          this.uploaderForm.reset();
          const key = `UPLOADER.${data['alert']}`;
          this.language.translate(key).subscribe((value: string) => {
            this._notifications.open('Status', value, 'success');
          });
        },
        error => {
          console.log('Error', error);
        }
      );
    }
  }

  close(): void {
    this.onClose.emit();
  }
}
