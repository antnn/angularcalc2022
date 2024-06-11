/*
 * Copyright (C) 2018 Anton
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */
import {Component, OnInit} from '@angular/core';
import {DataService, deepCopy} from '../../model/data.service';
import {FormControlToggleService} from '../form-control-toggle.service';
import {LSMQuestionsService} from './lsmquestions.service';
import {LeastSquaresMathService} from '../../model/least-squares.service';
import {RendererMeasurementsService} from '../indirect-measurement-form/renderer-measurements.service';

@Component({
  selector: 'app-least-squares-form',
  styleUrls: ['./least-squares-form.component.css'],
  template: `
    <ng-container>
      <app-form *ngIf="questions" [formElements]="questions"  (saved)="onSaved($event)"></app-form>
      <app-form *ngIf="questions2" [formElements]="questions2" [appFormActions]="form_actions" (saved)="onSaved2($event)">
        <div>
          <mat-card-header >
            <ng-container>Previous value:&nbsp;
              <app-math-expr *ngIf="_previous" [expr]="_previous"></app-math-expr>
            </ng-container>
          </mat-card-header>
        </div>
      </app-form>
      <mat-card  *ngIf="rendered">
          <app-math-expr [expr]="rendered"></app-math-expr>
      </mat-card>
    </ng-container>
    <ng-template cdkPortal #form_actions="cdkPortal">
      <button *ngIf="questions2" [disabled]="finishButton()" mat-flat-button (click)="lsm()">Finish</button>
    </ng-template>
  `
})
export class LeastSquaresFormComponent implements OnInit {
  _previous:any;
  rendered: any;
  questions2!: any[];
  questions!: any[];
  constructor(private qs: LSMQuestionsService,
              private dataService: DataService,
              private formToggle: FormControlToggleService,
              private rendererMeasurement: RendererMeasurementsService,
              private leastSquaresM: LeastSquaresMathService) {

  }
  ngOnInit() {
    this.questions = this.qs.toDropdownQuestion();
    this.dataService.clearAll();
  }
  onSaved($event: any) {
    this.questions = undefined as any;
    const arr: any[] = [];
    this.questions2 = this.qs.toFormSubgroupQuestion($event, arr);
  }
  onSaved2($event: any) {
    const measurement = deepCopy($event);
    this.dataService.add(measurement);
    const ren = this.rendererMeasurement.renderFields(measurement);
    this._previous = Object.values(ren).join(';\\space ').replace('sigma', '\\sigma_');
    this.formToggle.disable();
  }
  lsm() {
    this.questions2 = undefined as any;
    const result = this.leastSquaresM.process(this.dataService.cursor);
    let ren = this.rendererMeasurement.renderFields(result);
    ren = Object.values(ren).join('\\newline ').replace(/error/gi, '\\sigma_').toLowerCase();
    this.rendered = ren;
  }
  finishButton(): boolean {
    return !this.dataService.cursor.length;
  }
}


