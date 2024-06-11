/*
 * Copyright (C) 2018 Anton
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  constructor() { }
  log(e: any) {
    window.console.log(e);
  }
}
