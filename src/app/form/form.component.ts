/*
 * Copyright (C) 2018 Anton
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {FormElement} from './form-element';
import {FormControlService} from './form-control.service';


@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  //styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
  @Input() formElements: FormElement[] = [];
  @Input() appFormActions:any;
  @Output() saved = new EventEmitter<string>();
  form!: FormGroup;

  constructor(private fcs: FormControlService) {  }

  ngOnInit() {
    this.form = this.fcs.toFormGroup(this.formElements) as any;
  }

  onSubmit() {
    this.saved.emit(this.form.value);
  }
}
