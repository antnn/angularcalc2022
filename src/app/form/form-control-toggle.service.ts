/*
 * Copyright (C) 2018 Anton
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */
import {Injectable} from '@angular/core';
import {CanbeDisabledDirective} from './canbe-disabled.directive';


@Injectable({
  providedIn: 'root'
})
export class FormControlToggleService {
  private _elm: any[] = [];
  private _disabled = false;

  constructor() {
  }

  add(control: CanbeDisabledDirective) {
    this._elm.push(control);
  }

  disable() {
    if (!this._disabled) {
      this._disabled = true;
      for (const el of this._elm)
        el.disable();
    }
  }

  enable() {
    if (this._disabled)
      this._disabled = false;
    for (const el of this._elm)
      el.enable();
  }
}

