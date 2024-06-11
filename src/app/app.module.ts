/*
 * Copyright (C) 2018 Anton
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {PortalModule} from '@angular/cdk/portal';

import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatDividerModule} from '@angular/material/divider';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule}from '@angular/material/select'
import {MatToolbarModule} from '@angular/material/toolbar'
import {MatFormFieldModule} from '@angular/material/form-field'
import {MatTabsModule} from '@angular/material/tabs'



import { AppComponent } from './app.component';

import { FormComponent } from './form/form.component';
import {FormElementComponent, FormGroupComponent} from './form/form-element.component';
import {IndirectMeasurementFormComponent} from './form/indirect-measurement-form/indirect-measurement-form.component';
import { HideFormElDirective } from './form/hide-form-el.directive';
import { CanbeDisabledDirective } from './form/canbe-disabled.directive';
import { LeastSquaresFormComponent } from './form/least-squares-form/least-squares-form.component';
import { MathExprComponent } from './math-expr/math-expr.component';
import {AboutComponent} from './about/about.component';




@NgModule({
  declarations: [
    AppComponent,
    FormElementComponent,
    FormComponent,
    FormGroupComponent,
    IndirectMeasurementFormComponent,
    HideFormElDirective,
    CanbeDisabledDirective,
    LeastSquaresFormComponent,
    MathExprComponent,
    AboutComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatButtonModule, MatCheckboxModule, MatCardModule, MatFormFieldModule,
    MatInputModule, MatSelectModule, MatDividerModule, MatToolbarModule,
    MatTabsModule,
    PortalModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }


