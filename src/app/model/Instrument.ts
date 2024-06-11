/*
 * Copyright (C) 2018 Anton
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */
import * as math from 'mathjs';

var Big = (x: any) => math.bignumber(x);
var pow2 = (x: any) => math.pow(Big(x), 2) as math.BigNumber;
var sqrt = (x: any) => math.sqrt(x);
var div = (x, y) => math.divide(x, y);
var mul = (x, y) => math.multiply(x, y);
var minus = (x, y) => math.subtract(x, y);
var add = (...x) => (math as any).add(...x);

type LimitingError = any;

const subjectiveError = 0.3; // standard deviation for human reaction in seconds

interface Measurement {
  error: any;
  sysError: any;
  randomError: any;
}

export class Instrument {
  static manual = {
    label: `Manually`,
    fields: {
      value: { label: 'Value' },
      sysError: { label: 'Systematic Error', canbeDisabled: true },
      type: { value: 'manual', hidden: true }
    },
    compute: (o: any) => {
      o.value = Big(o.value);
      o.sysError = Big(o.sysError);
      return o;
    }
  };
  static ruler = {
    label: `Ruler`,
    fields: {
      value: { label: 'Value in meters' },
      smallestDivision: { label: 'Smallest division', canbeDisabled: true },
      type: { value: 'ruler', hidden: true }
    },
    compute: (o: any): Measurement => {
      o.value = Big(o.value);
      let e = new InstrError(
        o.smallestDivision,
        roundingError(o.smallestDivision)
      );
      o.sysError = e.sysError;
      return o;
    }
  };
  static stopwatch = {
    label: `Stopwatch`,
    fields: {
      value: { label: 'Value in seconds' },
      smallestDivision: {
        label: 'Smallest division on a scale',
        canbeDisabled: true
      },
      type: { value: 'stopwatch', hidden: true }
    },
    compute: (o: any) => {
      o.value = Big(o.value);
      let limErr = stopwatchLimitingError(o.value);
      let e: any = limErr.div(3);
      e = new InstrError(e, roundingError(o.smallestDivision), subjectiveError);
      o.sysError = e.sysError;
      return o;
    }
  };
  static digitalStopwatch = {
    label: `Digital Stopwatch`,
    fields: {
      value: { label: 'Value in seconds' },
      smallestDivision: {
        label: 'Smallest division on a scale',
        canbeDisabled: true
      },
      type: { value: 'digitalStopwatch', hidden: true }
    },
    compute: (o: any) => {
      o.value = Big(o.value);
      let limErr = digitalStopwatchLimitingError(o.value);
      let e: any = limErr.div(3);
      e = new InstrError(e, roundingError(o.smallestDivision), subjectiveError);
      o.sysError = e.sysError;
      return o;
    }
  };
  static multiplicative = {
    label: `Multiplicative`,
    fields: {
      value: { label: 'Value' },
      smallestDivision: {
        label: 'Smallest division on a scale',
        canbeDisabled: true
      },
      precisionClass: { label: 'Precision class', canbeDisabled: true },
      type: { value: 'multiplicative', hidden: true }
    },
    compute: (o: any) => {
      o.value = Big(o.value);
      let limErr = multiplicativeLimitingError(o.value, o.precisionClass);
      let e: any = div(limErr, 3); //limErr.div(3)
      e = new InstrError(e, roundingError(o.smallestDivision));
      o.sysError = e.sysError;
      return o;
    }
  };
  static additive = {
    label: `Additive`,
    fields: {
      value: { label: 'Value' },
      smallestDivision: {
        label: 'Smallest division on a scale',
        canbeDisabled: true
      },
      precisionClass: { label: 'Precision class', canbeDisabled: true },
      normValue: { label: 'Normalizing value', canbeDisabled: true },
      type: { value: 'additive', hidden: true }
    },
    compute: (o: any) => {
      o.value = Big(o.value);
      let limErr = additiveLimitingError(o.precisionClass, o.normValue);
      let e: any = div(limErr, 3); //limErr.div(3)
      e = new InstrError(e, roundingError(o.smallestDivision));
      o.sysError = e.sysError;
      return o;
    }
  };
  static combined = {
    label: `Combined`,
    fields: {
      value: { label: 'Value' },
      precisionClassLB: {
        label: 'Precision class for lower limit',
        canbeDisabled: true
      },
      precisionClassUB: {
        label: 'Precision class for upper limit',
        canbeDisabled: true
      },
      upperLimit: { label: 'Upper limit of the range', canbeDisabled: true },
      type: { value: 'combined', hidden: true }
    },
    compute: (o: any) => {
      o.value = Big(o.value);
      let limErr = combinedLimitingError(
        o.value,
        o.precisionClassLB,
        o.precisionClassUB,
        o.upperLimit
      );
      let e: any = div(limErr, 3); //limErr.div(3)
      e = new InstrError(e, roundingError(o.smallestDivision));
      o.sysError = e.sysError;
      return o;
    }
  };
  static nonUniform = {
    label: `Non-uniform scale`,
    fields: {
      value: { label: 'Value' },
      scaleFactor: { label: 'Scale factor' },
      smallestDivision: {
        label: 'Smallest division on a scale',
        canbeDisabled: true
      },
      length: { label: 'Length of scale' },
      precisionClass: { label: 'Precision class', canbeDisabled: true },
      type: { value: 'nonUniform', hidden: true }
    },
    compute: (o: any) => {
      o.value = Big(o.value);
      let limErr = nonUniformLimitingError(
        o.scaleFactor,
        o.length,
        o.precisionClass
      );
      let e: any = div(limErr, 3); //limErr.div(3)
      e = new InstrError(e, roundingError(o.smallestDivision));
      o.sysError = e.sysError;
    }
  };
}

class InstrError {
  public sysError;
  constructor(
    public instr: any,
    public rounding: any,
    public subjective = 0,
    public method = 0
  ) {
    this.sysError = sqrt(
      add(
        pow2(Big(instr)),
        pow2(Big(rounding)),
        pow2(Big(subjective)),
        pow2(Big(method))
      )
    );
    /*this.sysError = sqrt(pow2(Big(instr)).add(pow2(Big(rounding))).add(pow2(Big(subjective))).add(pow2(Big(method))));*/
  }
}

function roundingError(smallestDivision: any) {
  return div(Big(smallestDivision), sqrt(12));
  //return Big(smallestDivision).div(sqrt(12));
}

function stopwatchLimitingError(val: any) {
  return add(0.1, mul(Big(0.001), val));
  //return Big(0.001).mul(val).add(0.1);
}

function digitalStopwatchLimitingError(val: any) {
  return add(0.1, mul(Big(0.0001), val));
  //return Big(0.0001).mul(val).add(0.001);
}

function multiplicativeLimitingError(val: any, pc: any): LimitingError {
  return div(mul(pc, val), 100);
  //return Big(pc).mul(val).div(100);
}

function additiveLimitingError(pc: any, norm: any): LimitingError {
  return div(mul(pc, norm), 100);
  //return Big(pc).mul(norm).div(100);
}

function combinedLimitingError(
  val: any,
  pcL: any,
  pcU: any,
  upperLimit: any
): LimitingError {
  //return (pcU - pcL)*val/100 +(pcL)*upperLimit/100;
  return add(
    div(mul(minus(pcU, pcL), val), 100),
    div(mul(pcL, upperLimit), 100)
  );
  //return (Big(pcU).minus(pcL)).mul(val).div(100).add(Big(pcL).mul(upperLimit).div(100));
}

function nonUniformLimitingError(sf: any, len: any, pc: any): LimitingError {
  return div(mul(mul(sf, pc), len), 100);
  //return Big(sf).mul(pc).mul(len).div(100);
}
