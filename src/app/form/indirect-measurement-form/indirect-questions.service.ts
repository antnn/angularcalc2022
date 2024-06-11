/*
 * Copyright (C) 2018 Anton
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */
import { Injectable} from '@angular/core';
import * as katex from 'katex';
import {Instrument} from '../../model/Instrument';
import {Dropdown, FormSubGroup, Textbox} from '../form-element';
import {DomSanitizer} from '@angular/platform-browser';
import {mathExprValidator} from '../../model/measurement-math.service';


type MeasuringVar = string;
type InstrumentType = string;


@Injectable({
  providedIn: 'root'
})
export class IndirectQuestionsService {
  private instrumentsArray: any[] = [];
  constructor(private sanitizer: DomSanitizer) {
    this._queryInstruments();
  }
  public toDropdownQuestion(args: any[]) {
    const arr: any[] = [];
    for (const arg of args) {
      const d = new Dropdown ({key: arg, label: arg, options: this.instrumentsArray, required: true});
      arr.push(d);
    }
    return arr;
  }
  public toFormSubgroupQuestion($event: any, arr: any[]) {
    for (const arg of Object.keys($event)) {
      const instr = (Instrument as any)[$event[arg]];
      const t = this.__toQuestions(arg, instr.fields);
      t.questions = t.questions.map((el) =>  { el.validators = [mathExprValidator]; return new Textbox(el); }  );
      arr.push(new FormSubGroup(t));
    }
    return arr;
  }
  private _queryInstruments() {
    for (const key of Object.keys(Instrument)) {
      this.instrumentsArray.push({key: key, value: (Instrument as any)[key].label});
    }
  }
  private __toQuestions(akey: MeasuringVar, fields: any) {
    const questions: any[] = [];
    for (const key of Object.keys(fields)) {
      const f = fields[key];
      questions.push({
        key: key,
        value: f.value,
        label: f.label,
        hidden: f.hidden,
        canbeDisabled: f.canbeDisabled,
        required: true,
      });
    }
    const label = this.__toMath(`${akey} =\\space\\space`);
    return {key: akey, label, questions };
  }
  private __toMath(str: string) {
    return this.sanitizer.bypassSecurityTrustHtml(katex.renderToString(str));
  }
}


