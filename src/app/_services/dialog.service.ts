import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  dialogRef: any;

  constructor(private dialog: MatDialog) { }

  open(component, width: string, height: string) {
    this.dialogRef = this.dialog.open(component, {
      width: width,
      height: height,
      minHeight: '350px',
      disableClose: true
    });

    const sub = this.dialogRef.componentInstance.onClose.subscribe(() => {
      this.dialogRef.close();
    });

    this.dialogRef.afterClosed().subscribe(() => {
      sub.unsubscribe();
    });
  }

  close() {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }
}
