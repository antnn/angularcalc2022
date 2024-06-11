/*
 * Copyright (C) 2018 Anton
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */
import {Component} from '@angular/core';


const s = `div {
    font-family: Roboto, "Helvetica Neue", sans-serif;
    font-size: 10px;
    margin-left: 14px;
    margin-top: 14px;
    max-width: 100px;
    overflow: hidden;
    padding-bottom: 6px;
    padding-left: 8px;
    padding-right: 8px;
    padding-top: 6px;
    position: fixed;
    bottom:0;
    right:0;
    z-index:1000;
    opacity: 0.4;
}`;


@Component({
  selector: 'app-about-component',
  template: `<div>Anton</div>`,
  styles: [s]
})
export class AboutComponent {
}
