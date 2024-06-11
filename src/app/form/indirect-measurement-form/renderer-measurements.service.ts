/*
 * Copyright (C) 2018 Anton
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RendererMeasurementsService {

  constructor() { }
  _render(measurement: any, avg?: boolean) {
    const arr: any[]= [];
    for (const key of Object.keys(measurement)) {
      const strA = this.renderFields(measurement[key], key, avg);
      arr.push(strA);
    }
    return arr;
  }
  public renderFields(obj: any, name?: any, avg?: any) {
    const overline = avg ? `\\overline` : '';
    const object: any = {};
    for (const key of Object.keys(obj)) {
      let s;
      if (key === 'value') {
        s = `${overline}{${name}} = ${obj[key].toString().slice(0, 20)}`;
      } else if (key === 'sysError') {
        s = `\\sigma_{${overline}{${name}}, sys} = ${obj[key].toString(3).slice(0, 20)}`;
      } else if (key === 'randomError') {
        s = `\\sigma_{${overline}{${name}}, rand} = ${obj[key].toString().slice(0, 20)}`;
      } else if (key === 'type') {
        continue;
      } else {
        s = `${key} = ${obj[key].toString().slice(0, 20)}`;
        // continue;
      }
      object[key] = s;
    }
    return object;
  }

}
