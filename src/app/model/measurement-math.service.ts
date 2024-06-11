/*
 * Copyright (C) 2018 Anton
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */
import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { Instrument } from './Instrument';
import * as math from 'mathjs';
import { AbstractControl } from '@angular/forms';
import { LeastSquaresMathService } from './least-squares.service';

var Big = (x: any) => math.bignumber(x);
var pow2 = (x: any) => math.pow(Big(x), 2) as math.BigNumber;
var sqrt = (x: any) => math.sqrt(x);
var div = (x, y) => math.divide(x, y);
var mul = (x, y) => math.multiply(x, y);
var minus = (x, y) => math.subtract(x, y);
var add = (...x) => (math as any).add(...x);

const accumulate = (accumulator, currentValue) =>
  add(accumulator, currentValue);

@Injectable({
  providedIn: 'root'
})
export class MeasurementMathService {
  private _indirectError: any;
  private _mathExpr: any;
  private _indirect: any;
  private im: IndirectMeasurementService;
  constructor(private dataService: DataService) {
    this.im = new IndirectMeasurementService();
  }
  process(measurement: any, includeIndirect: boolean) {
    for (const key of Object.keys(measurement)) {
      const o = measurement[key];
      measurement[key] = (Instrument as any)[o.type].compute(o);
    }
    if (includeIndirect) {
      if (!this._indirectError) {
        this._mathExpr = new MathExpression(this.dataService.expression);
        this._indirectError = this.im.deriveError(this._mathExpr);
      }
      measurement = this.getIndirect(measurement);
    }
    return measurement;
  }
  getIndirect(measurement: any) {
    if (!this._indirect) {
      this._indirect = this.im.indirectMeasurementFactory(
        measurement,
        this._mathExpr.name,
        this.dataService.expression,
        this._indirectError
      )();
    }
    return this._indirect.compute(measurement);
  }
  average(measurements: any[]) {
    const n = measurements.length;
    let indirect = false;
    let avg: any = {};
    const first = measurements[0];
    const keys = Object.keys(first);

    for (const key of keys) {
      avg[key] = avg[key] ? avg[key] : {};
      for (const p of Object.keys(first[key])) {
        avg[key][p] = first[key][p];
      }
      avg[key].value = Big(0);
    }

    for (const m of measurements) {
      for (const key of keys) {
        if (this.isIndirect(m[key])) {
          indirect = true;
          continue;
        }
        avg[key].value = avg[key].value.add(m[key].value.div(n));
      }
    }

    for (const key of keys) {
      if (this.isIndirect(avg[key])) {
        indirect = true;
        continue;
      }
      avg[key] = (Instrument as any)[avg[key].type].compute(avg[key]);
    }

    avg = this.sdom(avg, measurements);

    // will overwrite indirectAvg values using derivative;
    if (indirect) {
      avg = this.getIndirect(avg);
    }
    return avg;
  }

  sdom(avg: any, measurements: any[]) {
    const n = measurements.length;
    const tAvg: any = {};
    const keys = Object.keys(measurements[0]);
    for (const m of measurements) {
      for (const key of keys) {
        tAvg[key] = tAvg[key]
          ? tAvg[key]
          : div(add(0, pow2(minus(m[key].value, avg[key].value))), n * (n - 1));
        //tAvg[key] = (tAvg[key] ? tAvg[key] : Big(0)).add(pow2(m//[key].value.minus(avg[key].value)).div(n * (n - 1)));
      }
    }
    for (const key of keys) {
      avg[key].randomError = sqrt(tAvg[key]);
    }
    return avg;
  }
  isIndirect(m: any) {
    return m.type === 'indirect';
  }
}

class IndirectMeasurementService {
  constructor() {}

  deriveError(expr: MathExpression) {
    let derivative = 'sqrt(';
    for (const arg of expr.argsNames) {
      const f = math.derivative(expr.value.toString(), arg);
      derivative = derivative.concat(`(${f})^2 * _E_${arg}^2 +`);
    }
    return derivative.slice(0, derivative.length - 1) + ')';
  }

  indirectMeasurementFactory(
    measurement: any,
    name: any,
    expr: string,
    errorExpr: string
  ) {
    const keys = Object.keys(measurement);
    return () => {
      return {
        compute: (m: any) => {
          const o: any = { type: 'indirect' };
          const p = math.parser();
          for (const key of keys) {
            p.set(key, Big(m[key].value));
          }
          o.value = p.evaluate(expr);
          for (const key of keys) {
            p.set(`_E_${key}`, Big(m[key].sysError));
          }
          o.sysError = p.evaluate(errorExpr);

          if (m[keys[0]].randomError) {
            for (const key of keys) {
              p.set(`_E_${key}`, Big(m[key].randomError));
            }
            o.randomError = p.evaluate(errorExpr);
          }
          m[name] = o;
          return m;
        }
      };
    };
  }
}

export class MathExpression {
  private _expr;
  private _argsNames: any[] = [];
  constructor(expr: string) {
    this._expr = math.parse(expr);
  }
  get name() {
    return this._expr.name;
  }
  get value() {
    return this._expr.value;
  }
  get argsNames() {
    if (this._argsNames) {
      for (const arg of this._expr.value.args) {
        this._argsNames.push(arg.name);
      }
    }
    return this._argsNames;
  }
  toString() {
    return this._expr.toString();
  }
}

export function mathExprValidator(
  control: AbstractControl
): { [key: string]: any } | null {
  let syntaxError;
  let err;
  try {
    math.parse(control.value);
  } catch (e) {
    err = e.message;
    syntaxError = true;
  }
  return syntaxError ? { syntaxError: { value: err } } : null;
}
