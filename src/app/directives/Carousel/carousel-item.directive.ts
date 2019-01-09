import { Directive, TemplateRef } from '@angular/core';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[carouselItem]'
})

export class CarouselItemDirective {

  constructor(public tpl: TemplateRef<any>) { }

}
