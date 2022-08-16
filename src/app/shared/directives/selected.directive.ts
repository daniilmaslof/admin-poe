import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appSelected]'
})
export class SelectedDirective {

  constructor(
    private el: ElementRef,
  ) {
  }

}
