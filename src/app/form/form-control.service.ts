
import {Inject, Injectable} from '@angular/core';
import { FormControl, FormGroup, Validators} from '@angular/forms';
import {FormSubGroup} from './form-element';

@Injectable({
  providedIn: 'root'
})
export class FormControlService {
  toFormGroup(questions: any[]) {
    let result;
    this._toForm(questions, (res:any) => {
      result = res;
    });
    return result;
  }
  private _toForm(questions: any, ret: Function) {
    const form: any = {};
    for (const q of questions) {
      if (q.constructor === FormSubGroup) {
        this._toForm(q.questions, (fc:any) => { form[q.key] = fc; ret(form); });
      } else {
        form[q.key] = q.required ? new FormControl(q.value || '', q.validators.concat(Validators.required))
          : new FormControl(q.value || '', q.validators);
      }
    }
    ret(new FormGroup(form));
  }
}

