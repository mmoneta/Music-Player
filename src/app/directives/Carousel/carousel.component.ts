import {
  AfterViewInit,
  Component,
  ContentChildren,
  Directive,
  ElementRef,
  Input,
  Output,
  QueryList,
  ViewChild,
  ViewChildren,
  EventEmitter,
  HostListener
} from '@angular/core';
import { CarouselItemDirective } from './carousel-item.directive';
import { animate, AnimationBuilder, AnimationFactory, AnimationPlayer, style } from '@angular/animations';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '.carousel-item'
})

// tslint:disable-next-line:directive-class-suffix
export class CarouselItemElement { }

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'carousel',
  exportAs: 'carousel',
  template: `
    <div class="parent">
      <div *ngIf="showControls" style="margin-right: 10px;">
        <div class='arrow' (click)="prev()">
          <mat-icon>arrow_back_ios</mat-icon>
        </div>
      </div>
      <section class="carousel-wrapper" [ngStyle]="carouselWrapperStyle">
        <ul class="carousel-inner" #carousel>
          <li *ngFor="let item of items;" class="carousel-item">
            <ng-container [ngTemplateOutlet]="item.tpl"></ng-container>
          </li>
        </ul>
      </section>
      <div *ngIf="showControls" style="margin-left: 10px;">
        <div class='arrow' (click)="next()">
          <mat-icon>arrow_forward_ios</mat-icon>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .parent {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .arrow {
      background: transparent;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 10px;
      cursor: pointer;
    }

    ul {
      list-style: none;
      margin: 0;
      padding: 0;
      width: 6000px;
    }

    .carousel-wrapper {
      overflow: hidden;
    }

    .carousel-inner {
      display: flex;
    }
  `]
})
export class CarouselComponent implements AfterViewInit {

  @ContentChildren(CarouselItemDirective) items: QueryList<CarouselItemDirective>;
  @ViewChildren(CarouselItemElement, { read: ElementRef }) private itemsElements: QueryList<ElementRef>;
  @ViewChild('carousel') private carousel: ElementRef;
  @Input() timing = '250ms ease-in';
  @Input() showControls = true;
  private player: AnimationPlayer;
  private itemWidth: number;
  private currentSlide = 0;
  carouselWrapperStyle = {};
  screenWidth: number;
  // tslint:disable-next-line:no-output-on-prefix
  @Output() onValueChanged = new EventEmitter<any>();

  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.changeItemWidth();
  }

  @HostListener('window:orientationchange', ['$event'])
  onOrientationChange($event?) {
    this.changeItemWidth();
  }

  constructor(private builder: AnimationBuilder) { }

  changeItemWidth(): void {
    this.itemWidth = this.itemsElements.first.nativeElement.getBoundingClientRect().width;
    this.carouselWrapperStyle = {
      width: `${this.itemWidth}px`
    };
  }

  next() {
    if (this.currentSlide + 1 === this.items.length) { return; }
    this.currentSlide = (this.currentSlide + 1) % this.items.length;
    const offset = this.currentSlide * this.itemWidth;
    const myAnimation: AnimationFactory = this.buildAnimation(offset);
    this.player = myAnimation.create(this.carousel.nativeElement);
    this.player.play();
    this.onValueChanged.emit(this.currentSlide);
  }

  private buildAnimation(offset) {
    return this.builder.build([
      animate(this.timing, style({ transform: `translateX(-${offset}px)` }))
    ]);
  }

  prev() {
    if (this.currentSlide === 0) { return; }

    this.currentSlide = ((this.currentSlide - 1) + this.items.length) % this.items.length;
    const offset = this.currentSlide * this.itemWidth;

    const myAnimation: AnimationFactory = this.buildAnimation(offset);
    this.player = myAnimation.create(this.carousel.nativeElement);
    this.player.play();
    this.onValueChanged.emit(this.currentSlide);
  }

  ngAfterViewInit() {
    this.onResize();
    this.onOrientationChange();
  }
}
