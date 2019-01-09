import { Component, OnInit, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-helper',
  templateUrl: 'helper.component.html',
  styleUrls: ['helper.component.scss']
})
export class HelperComponent implements OnInit {

  onClose = new EventEmitter<void>();

  constructor() { }

  ngOnInit() {
  }

  close(): void {
    this.onClose.emit();
  }

}
