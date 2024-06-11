/*
 * Copyright (C) 2018 Anton
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */
import {Injectable} from '@angular/core';

import  * as math from 'mathjs';

var Big  = (x: any) => math.bignumber(x);
var pow2  = (x: any) => math.pow(Big(x),2) as math.BigNumber;
var sqrt = (x: any) => math.sqrt(x);
var div =  (x, y) => math.divide(x, y)
var mul = (x,y) => math.multiply(x, y)
var minus = (x, y) => math.subtract(x, y)
var add = (...x) => (math as any).add(...x)

const accumulate = (accumulator, currentValue) => add(accumulator,currentValue);

@Injectable({
  providedIn: 'root'
})
export class LeastSquaresMathService {
  process(data: any[]) {
    const y = data.map(a => a.y);
    const x = data.map(a => a.x);
    const sigma = data[0].sigma0 || data.map(a => a.sigmai);

    const lsm = new LeastSquaresMathService();

    if (data[0].type === 'y_b') {
      const _y = data.map(a => a.y);
      return lsm.b_sigma(_y, sigma);
    } else if (data[0].type === 'y_ax') {
      return lsm.ax_sigma(y, x, sigma);
    } else {
      return lsm.ax_b_sigma(y, x, sigma);
    }
  }
  b_sigma(y: number[], sigma: number[] | number) {
    const _y = y.map((v) => Big(v));
    if (sigma instanceof Array) {
      const _sigma = sigma.map((v) => Big(v));
      return this.b_sigma_i(_y, _sigma);
    } else {
      return this.b_sigma0(_y, Big(sigma));
    }
  }

  private b_sigma_i(y: math.BigNumber[], sigma: math.BigNumber[]) {
    const n = y.length;
    let numerator = Big(0);
    let denominator = Big(0);
    const one = Big(1);
    for (let i = 0; i < n; i++) {
      numerator = add(div(numerator,pow2(sigma[i])))
      denominator = add(denominator, div(1,pow2(sigma[i])))
      //numerator = numerator.add(y[i].div(pow(sigma[i])));
      //denominator = denominator.add(one.div(pow(sigma[i])));
    }
    const b = div(numerator, denominator).toString();
    const errorB = sqrt(div(1,denominator)).toString();
    //const b = numerator.div(denominator).toString();
    //const errorB = sqrt(one.div(denominator)).toString();
    return {a: 0, errorA: 0, b, errorB};
  }

  private b_sigma0(y: math.BigNumber[], sigma?: math.BigNumber) {
    const n = y.length;
    const b = div(y.reduce(accumulate), n)
    //const b = y.reduce(accumulate).div(n);
    if (!sigma) {
      sigma = y.map((v) => minus(v, b)).reduce(accumulate) as any
      sigma = (sqrt(div(sigma, (n - 1))) as any);
      //sigma = y.map((v) => v.minus(b)).reduce(accumulate);
      //sigma = sqrt(sigma.div((n - 1)));
    }
    const errorB = sqrt(div(pow2(sigma),n));
    return {a: 0, errorA: 0, b: b.toString(), errorB: errorB.toString()};
  }

  ax_sigma(y: number[], x: number[], sigma: number[] | number) {
    const _y = y.map((v) => Big(v));
    const _x = x.map((v) => Big(v));
    if (sigma instanceof Array) {
      const _sigma = sigma.map((v) => Big(v));
      return this.ax_sigma_i(_y, _x, _sigma);
    } else {
      return this.ax_sigma0(_y, _x, Big(sigma));
    }
  }

  private ax_sigma_i(y: math.BigNumber[], x: math.BigNumber[], sigma: math.BigNumber[]) {
    const n = y.length;
    let numerator = Big(0);
    let denominator = Big(0);
    const one = Big(1);
    for (let i = 0; i < n; i++) {
      numerator = add(numerator, mul(x[i],div(y[i],pow2(sigma[i]))));
      denominator = add(denominator,div(pow2(x[i]),pow2(sigma[i])))
      //numerator = numerator.add(x[i].times(y[i]).div(pow2(sigma[i])));
      //denominator = denominator.add(pow2(x[i]).div(pow2(sigma[i])));
    }
    const a = div(numerator, denominator);
    const errorA = sqrt(div(1,denominator));
    //const a = numerator.div(denominator);
    //const errorA = sqrt(one.div(denominator));
    return {a: a.toString(), errorA: errorA.toString(), b: 0, errorB: 0};
  }

  private ax_sigma0(y: math.BigNumber[], x: math.BigNumber[], sigma?: math.BigNumber) {
    const n = y.length;
    let numerator = Big(0);
    for (let i = 0; i < n; i++) {
      numerator = add(numerator, mul(x[i],y[i]));
      //numerator = numerator.add(x[i].times(y[i]));
    }
    const denominator = x.map(pow2).reduce(accumulate);
    const a = div(numerator, denominator);
    //const a = numerator.div(denominator);
    if (!sigma) {
      sigma = Big(0);
      for (let i = 0; i < n; i++) {
        sigma = add(sigma,pow2(minus(y[i],mul(a,x[i]))));
        //sigma = sigma.add(pow2(y[i].minus(a.times(x[i]))));
      }
      sigma = (sqrt(div(sigma,n - 1)) as any);
    }
    const errorA = sqrt(div(pow2(sigma),denominator));
    return {a: a.toString(), errorA: errorA.toString(), b: 0, errorB: 0};
  }

  ax_b_sigma(y: number[], x: number[], sigma: number[] | number) {
    const _y = y.map((v) => Big(v));
    const _x = x.map((v) => Big(v));
    if (sigma instanceof Array) {
      const _sigma = sigma.map((v) => Big(v));
      return this.ax_b_sigma_i(_y, _x, _sigma);
    } else {
      return this.ax_b_sigma0(_y, _x, Big(sigma));
    }
  }

  private ax_b_sigma_i(y: math.BigNumber[], x: math.BigNumber[], sigma: math.BigNumber[]) {
    const n = y.length;
    let x2_s2 = Big(0);
    let one_s2 = Big(0);
    let xy_s2 = Big(0);
    let x_s2 = Big(0);
    let y_s2 = Big(0);
    for (let i = 0; i < n; i++) {
      x2_s2 = add(x2_s2, pow2(div(x[i],pow2(sigma[i]))));
      one_s2 = add(one_s2,div(1, pow2(sigma[i])));
      xy_s2 = add(xy_s2, div(mul(x[i],y[i]), pow2(sigma[i])));
      x_s2 = add(x_s2,div(x[i], pow2(sigma[i])));
      y_s2 = add(y_s2, div(y[i],pow2(sigma[i])));
      /*x2_s2 = x2_s2.add(pow2(x[i]).div(pow2(sigma[i])));
      one_s2 = one_s2.add(Big(1).div(pow2(sigma[i])));
      xy_s2 = xy_s2.add(x[i].mul(y[i]).div(pow2(sigma[i])));
      x_s2 = x_s2.add(x[i].div(pow2(sigma[i])));
      y_s2 = y_s2.add(y[i].div(pow2(sigma[i])));*/
    }
    const delta = minus(mul(x2_s2,one_s2),pow2(x_s2));
    const deltaA = minus(mul(xy_s2,one_s2),mul(x_s2,y_s2));
    const deltaB = minus(mul(x2_s2, y_s2), mul(x_s2,xy_s2));
    const a = div(deltaA, delta);
    const b = div(deltaB, delta);

    const errorA = div(one_s2,delta);
    const errorB = div(x2_s2, delta);

    return {a: a.toString(), errorA: errorA.toString(), b: b.toString(), errorB: errorB.toString()};
  }

  private ax_b_sigma0(y: math.BigNumber[], x: math.BigNumber[], sigma?: math.BigNumber) {
    const n = y.length;
    let xy = Big(0);
    for (let i = 0; i < n; i++) {
      xy = add(xy,mul(x[i],y[i]));
    }
    const x2 = x.map(pow2).reduce(accumulate);
    const _x = x.reduce(accumulate);
    const _y = y.reduce(accumulate);

    const delta = minus(mul(x2, n), pow2(_x));
    const deltaA = minus(mul(xy,n), mul(_x,_y));
    const deltaB = minus(mul(x2,_y), mul(_x,xy));
    const a = div(deltaA, delta);
    const b = div(deltaB, delta);

    if (!sigma) {
      sigma = Big(0);
      for (let i = 0; i < n; i++) {
        sigma = add(sigma, pow2(minus(minus(y[i],mul(a,x[i])),b)));
        //sigma = sigma.add(pow2(Big(y[i]).minus(a.mul(x[i])).minus(b)));
      }
      sigma = (sqrt(div(sigma,n - 2)) as any);
    }
    const errorA = div(mul(pow2(sigma),n),delta);
    const errorB = div(mul(pow2(sigma),x2),delta);

    return {a: a.toString(), errorA: errorA.toString(), b: b.toString(), errorB: errorB.toString()};
  }
}
