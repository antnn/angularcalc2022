/*
 * Copyright (C) 2018 Anton
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private _measurementSeries: Array<Array<any>> = [];
  private _results:  any[] = [];
  private _cursor: any[] = [];
  private _expr: any;
  constructor() {
    this._measurementSeries.push(this._cursor);
  }

  set expression(expr: string) {
    this._expr = expr;
  }

  get expression() {
    return this._expr;
  }

  get cursor() {
    return this._cursor;
  }

  clearAll() {
  this._measurementSeries = [];
  this._results = [];
  this._cursor = [];
  this._expr = [];
  }

  add(series: any) {
    this._cursor.push(series);
  }

  addResult(result: any) {
    this._results.push(result);
  }
  get getResults() {
    return this._results;
  }

  get(numS: any, num: any) {
    return this._measurementSeries[numS][num];
  }

  addSeries() {
    this._cursor = [];
    this._measurementSeries.push(this._cursor);
  }
  getSeries() {
    return this._cursor;
  }
  remove(seriesNumber: number, num: number) {
    this._measurementSeries[seriesNumber].splice(num, 1);
  }

  update(series: any, seriesNumber: number, num: number) {
    this._measurementSeries[seriesNumber][num] = series;
  }
}

export function deepCopy(o: any) {
  return JSON.parse(JSON.stringify(o))
}
