/*
 * Copyright (C) 2018 Anton
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */
import {Component, Input, OnInit} from '@angular/core';
import { FormGroup }      from '@angular/forms';
import { FormElement, Dropdown, Textbox, FormSubGroup } from './form-element';



@Component({
  selector: 'app-form-element',
  templateUrl: './form-element.component.html',
  styles: [`.errorMessage{color:red}
  :host-context(.lastEl) .mat-divider { display:none; }
  .mat-divider{ margin-top: 0.625rem; }`]
})
export class FormElementComponent {
  @Input() formElement!: FormElement;
  @Input() form!: FormGroup;
  public readonly Dropdown = Dropdown;
  public readonly Textbox = Textbox;
  public readonly UserFormGroup = FormSubGroup;
  hasError(errorCode:any) {
    return this.form.controls[this.formElement.key].hasError(errorCode);
  }
  /*get isValid() { return this.form.controls[this.formElement.key].disabled ||
    this.form.controls[this.formElement.key].valid; }*/
}


@Component({
  selector: 'app-form-subgroup',
  template: `<ng-content></ng-content>
  <div>
    <ng-container *ngFor="let element of formElements" class="form-row">
      <app-form-element [formElement]="element" [form]="innerFormGroup"></app-form-element>
    </ng-container>
    </div>
  `,
  styles: [`:host-context(.firstEl) {margin-top: 0;}
  div {display: inline-grid;}
  :host {display: block; margin-top:24px;}`]
})

export class FormGroupComponent implements OnInit {
  @Input() formElements: FormElement[] | undefined = [];
  @Input() form!: FormGroup;
  @Input() formGroupName!: string | number;
  innerFormGroup!: FormGroup;
  ngOnInit() {
    this.innerFormGroup = this.form.controls[this.formGroupName] as FormGroup;
  }
}
