/*
 * Copyright (C) 2018 Anton
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */
export class FormElement {
  value: string | number | undefined;
  key: string;
  label: string;
  hint: string;
  required: boolean;
  order: number;
  type: string;
  hidden: boolean;
  canbeDisabled: boolean;
  validators: Function[];
  options?: {key: string, value: string}[];
  questions?: FormElement[];

  constructor(params: {
    value?: string | number,
    key?: string,
    label?: string,
    hint?: string,
    required?: boolean,
    order?: number,
    controlType?: string,
    hidden?: boolean,
    canbeDisabled?: boolean,
    validators?: Function[]
  } = {}) {
    this.value = params.value;
    this.key = params.key || '';
    this.label = params.label || '';
    this.hint = params.hint || '';
    this.required = !!params.required;
    this.order = params.order === undefined ? 1 : params.order;
    this.type = params.controlType || '';
    this.hidden = params.hidden || false;
    this.canbeDisabled = params.canbeDisabled || false;
    this.validators = params.validators || [];
  }
}

export class FormSubGroup extends FormElement {
  questions: FormElement[] = [];
  constructor(params: {} = {}) {
    super(params);
    this.questions = (params as any)['questions'] || [];
  }
}

export class Dropdown extends FormElement {
  options: {key: string, value: string}[] = [];
  constructor(params: {} = {}) {
    super( params );
    this.options = (params as any)['options'] || [];
  }
}

export class Textbox extends FormElement {
  constructor(params: {} = {}) {
    super( params );
    this.type = (params as any)['type'] || '';
  }
}
