/*
 * Copyright (C) 2018 Anton
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */
import {Directive, ElementRef, Input, Renderer2} from '@angular/core';

@Directive({
  selector: '[appHideFormEl]'
})
export class HideFormElDirective {
  constructor(private el: ElementRef, private renderer: Renderer2) { }
  @Input() set appHideFormEl(hidden: boolean) {
    let p = hidden? 'none' : '';
    this.renderer.setStyle(this.el.nativeElement, 'display', p);
  }
}
