/*
 * Copyright (C) 2018 Anton
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */
import {Component, OnInit} from '@angular/core';
import {FormElement, Textbox} from '../form-element';
import {IndirectQuestionsService} from './indirect-questions.service';
import {DataService, deepCopy} from '../../model/data.service';
import {FormControlToggleService} from '../form-control-toggle.service';
import {MathExpression, mathExprValidator, MeasurementMathService} from '../../model/measurement-math.service';
import {RendererMeasurementsService} from './renderer-measurements.service';


@Component({
  selector: 'app-indirect-form',
  templateUrl: './indirect-measurement-form.component.html',
  styleUrls: ['./indirect-measurement-form.component.css']
})
export class IndirectMeasurementFormComponent implements OnInit {
  _previous: any;
  rendered: any[] = [];
  questions2: any;
  questions3: any;
  questions: FormElement[] = [
    new Textbox({
      key: 'formula',
      label: 'Expression',
      hint: 'for indirect measurements',
      value: 'T=t/N',
      required: true,
      order: 1,
      validators: [mathExprValidator]
    })
  ];
  constructor(private qs: IndirectQuestionsService,
              private dataService: DataService,
              private mathService: MeasurementMathService,
              private formToggle: FormControlToggleService,
              private measurementRender: RendererMeasurementsService) {
  }
  ngOnInit() {
    this.dataService.clearAll();
  }
  onSaved($event: any) {
    this.questions = undefined as any;
    const arg = $event.formula;
    this.dataService.expression = arg;
    const r = new MathExpression(arg);
    this.questions2 = this.qs.toDropdownQuestion(r.argsNames);
  }
  onSaved2($event: any) {
    this.questions2 = undefined;
    const arr: any[] = [];
    this.questions3 = this.qs.toFormSubgroupQuestion($event, arr);
  }
  onSaved3($event: any) {
    let measurement = deepCopy($event);
    measurement = this.mathService.process(measurement, true);
    this.dataService.add(measurement);
    this.formToggle.disable();
    const ren = this.measurementRender._render(measurement);
    this._previous = ren.map((m) => m.value).join(';\\space');
    // to do enable addSeries button
  }
  addSeries($event: any) {
    const r = this.mathService.average(this.dataService.cursor);
    this.dataService.addResult(r);
    this.dataService.addSeries();
    this.formToggle.enable();
  }
  showAddSeries() {
    return this.dataService.cursor.length < 5;
  }
  showShowResults() {
    return ! this.dataService.getResults.length;
  }

  showResults($event: any) {
    this.questions3 = undefined;
    const results = this.dataService.getResults;
    for (const res of results) {
      const ren = this.measurementRender._render(res, true);
      this.rendered.push(ren);
    }
  }
  buttonGuard = (data: Array<any>) => {
    return !!data.length;
  }
}

