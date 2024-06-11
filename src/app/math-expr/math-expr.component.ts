/*
 * Copyright (C) 2018 Anton
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */
import { Component, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import * as katex from 'katex';

@Component({
  selector: 'app-math-expr',
  template: '<div [innerHTML]="_expr"></div>',
})
export class MathExprComponent {
  public _expr: any;
  @Input() set expr(str: string) {
    this._expr = this.sanitizer.bypassSecurityTrustHtml(
      katex.renderToString(str)
    );
  }
  constructor(private sanitizer: DomSanitizer) {}
}
