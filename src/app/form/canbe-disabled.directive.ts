/*
 * Copyright (C) 2018 Anton
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */
import {Directive, ElementRef, Input, Renderer2} from '@angular/core';
import {FormControlToggleService} from './form-control-toggle.service';



@Directive({
  selector: '[appCanbeDisabled]'
})
export class CanbeDisabledDirective {
  @Input() set appCanbeDisabled(flag: boolean) {
    if (flag) { this.fct.add(this); }
  }
  constructor(private el: ElementRef, private renderer: Renderer2, private fct: FormControlToggleService) { }
  disable() {
    this.renderer.setAttribute(this.el.nativeElement, 'disabled', '');
  }
  enable() {
    this.renderer.removeAttribute(this.el.nativeElement, 'disabled');
  }
}
