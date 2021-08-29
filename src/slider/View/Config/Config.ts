import clamp from 'slider/helpers/clamp';
import numberDecimalPlaces from 'slider/helpers/numberDecimalPlaces';
import { IConfig, typeExtremums, IAllPositions } from './IConfig';

abstract class Config {
  protected n!: number
  protected divisionNumber!: number
  protected relativeStep!: number
  protected fakeDiff!: number
  protected positions!: number[]
  protected extremums!: typeExtremums

  constructor(protected response: IResponse) {
    this.update(response);
  }

  update(response: IResponse = this.response): void {
    const { min, max, step, from, to } = response;
    this.n = numberDecimalPlaces(step);
    this.divisionNumber = Math.ceil(+(max - min).toFixed(this.n) / step);
    this.relativeStep = 1 / this.divisionNumber;
    this.fakeDiff = +(this.divisionNumber * step).toFixed(this.n);
    this.positions = [from, to].map(this.calcPosition, this);
    this.extremums = this.getExtremums();
    this.response = response;
  }

  getResponse(): IResponse {
    return { ...this.response };
  }

  getPositions(): number[] {
    return [...this.positions];
  }

  setPositions(positions: number[]): void {
    this.positions = positions.map(this.validate, this);
    this.updateExtremums();
    this.updateResponse();
  }

  protected sampling(p: number): number {
    return 1 / this.divisionNumber * Math.round(p * this.divisionNumber);
  }

  protected generateAllPositions(v: number, res: number[] = []): number[] {
    if (res.length > this.divisionNumber) { return res; }
    return this.generateAllPositions(this.getNext(v), [...res, v]);
  }

  private validate(p: number, idx: number): number {
    return clamp(
      this.extremums[idx].min,
      this.sampling(p),
      this.extremums[idx].max
    );
  }

  private updateResponse(): void {
    this.response.from = this.calcAbsolutePosition(this.positions[0]);
    this.response.to = this.calcAbsolutePosition(this.positions[1]);
  }

  abstract swap(): void

  abstract getPrev(p: number): number

  abstract getNext(p: number): number

  abstract getAllPositions(): IAllPositions

  protected abstract calcPosition(ap: number): number

  protected abstract calcAbsolutePosition(p: number): number

  protected abstract updateExtremums(): void

  protected abstract getExtremums(): typeExtremums
}

class HorizontalConfig extends Config implements IConfig {
  swap(): IConfig {
    return new VerticalConfig(this.response);
  }

  getPrev(p: number): number {
    return Math.max(0, this.sampling(p) - this.relativeStep);
  }

  getNext(p: number): number {
    return Math.min(1, this.sampling(p) + this.relativeStep);
  }

  getAllPositions(): IAllPositions {
    const positions = this.generateAllPositions(0);
    return {
      absolutePositions: positions.map(this.calcAbsolutePosition, this),
      positions
    };
  }

  protected calcPosition(ap: number): number {
    return clamp(
      0, 
      Math.ceil((ap - this.response.min) / this.response.step) 
        * this.response.step / this.fakeDiff,
      1
    );
  }

  protected calcAbsolutePosition(p: number): number {
    return Math.min(
      +(this.sampling(p) * this.fakeDiff + this.response.min)
        .toFixed(this.n),
      this.response.max
    );
  }

  protected updateExtremums(): void {
    this.extremums[0].max = this.positions[1];
    this.extremums[1].min = this.positions[0];
  }

  protected getExtremums(): typeExtremums {
    return [
      { min: 0, max: this.positions[1] }, { min: this.positions[0], max: 1 }
    ];
  }
}

class VerticalConfig extends Config implements IConfig {
  swap(): IConfig {
    return new HorizontalConfig(this.response);
  }

  getPrev(p: number): number {
    return Math.min(1, this.sampling(p) + this.relativeStep);
  }

  getNext(p: number): number {
    return Math.max(0, this.sampling(p) - this.relativeStep);
  }

  getAllPositions(): IAllPositions {
    const positions = this.generateAllPositions(1);
    return {
      absolutePositions: positions.map(this.calcAbsolutePosition, this),
      positions
    };
  }

  protected calcPosition(ap: number): number {
    return clamp(
      0, 
      1 - Math.ceil((ap - this.response.min) / this.response.step) 
        * this.response.step / this.fakeDiff,
      1
    );
  }

  protected calcAbsolutePosition(p: number): number {
    return Math.min(
      +((1 - this.sampling(p)) * this.fakeDiff + this.response.min)
        .toFixed(this.n),
      this.response.max
    );
  }

  protected updateExtremums(): void {
    this.extremums[0].min = this.positions[1];
    this.extremums[1].max = this.positions[0];
  }

  protected getExtremums(): typeExtremums {
    return [
      { min: this.positions[1], max: 1 }, { min: 0, max: this.positions[0] }
    ];
  }
}

export { HorizontalConfig, VerticalConfig };

