/*
 * Copyright (C) 2018 Anton
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */
import {Injectable} from '@angular/core';
import {Dropdown, Textbox} from '../form-element';
import {mathExprValidator} from '../../model/measurement-math.service';


type MeasuringVar = string;


@Injectable({
  providedIn: 'root'
})
export class LSMQuestionsService {
  constructor() {
  }
  public toDropdownQuestion() {
    return [new Dropdown({
      key: 'eq',
      label: 'Model',
      options: [{key: 'y_b', value: 'y = b'},
        {key: 'y_ax', value: 'y = ax'},
        {key: 'y_ax_b', value: 'y = ax + b'}],
      required: true
    }), new Dropdown({
      key: 'sigma',
      label: 'Standard deviation',
      options: [{key: 'sigma_i', value: 'Different values'},
        {key: 'sigma0', value: 'The same'},
        {key: 'sigmaCalc', value: 'Calculate'}],
      required: true
    })];
  }
  public toFormSubgroupQuestion($event: any, arr: any[]) {
    arr.push(new Textbox({key: 'y', label: 'y', required: true, validators: [mathExprValidator]}));
    if ($event.eq === 'y_ax' || $event.eq === 'y_ax_b') {
      arr.push(new Textbox({key: 'x', label: 'x', required: true, validators: [mathExprValidator]}));
    }
    if ($event.sigma === 'sigma_i') {
      arr.push(new Textbox({key: 'sigmai', label: 'sigma', required: true, validators: [mathExprValidator]}));
    } else if ($event.sigma === 'sigma0') {
      arr.push(new Textbox({key: 'sigma0', label: 'sigma0', required: true, canbeDisabled: true, validators: [mathExprValidator]}));
    }
    arr.push(new Textbox({key: 'type', value: $event.eq, hidden: true}));
    return arr;
  }
  private _queryInstruments() {

  }
  private __toQuestions(akey: MeasuringVar, fields: any) {
    const questions = [];
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
    return {key: akey, label: `${akey}`, questions };
  }
}







