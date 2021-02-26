import {Options} from '../index';
import ButtonModel from '../Model/ButtonModel';

export default class Model {
  isInterval: boolean
  min: number
  scaleX: number
  scaleW: number
  buttonS: ButtonModel
  buttonE: ButtonModel
  buttonW: number
  relativeButtonW: number
  displayW: number
  relativeDisplayW: number
  displayDeflexion: number
  correctedScaleSizes: number
  valueOfDivision: number
  constructor(
    scale: HTMLElement,
    buttonS: HTMLElement,
    buttonE: HTMLElement | false,
    display: HTMLElement,
    {
      interval: isInterval = false,
      min = 0,
      max = 10,
    }: Options
  ) {
    this.isInterval = isInterval;
    this.min = min;
    this.scaleX = scale.getBoundingClientRect().x;
    this.scaleW = scale.getBoundingClientRect().width;
    this.buttonW = buttonS.getBoundingClientRect().width;
    this.relativeButtonW = this.buttonW / this.scaleW;
    this.displayW = display.getBoundingClientRect().width;
    this.relativeDisplayW = this.displayW / this.scaleW;
    this.displayDeflexion = (
      this.relativeDisplayW / 2 - this.relativeButtonW / 2
    );
    this.correctedScaleSizes = 1 - this.relativeButtonW * (buttonE ? 2 : 1);
    this.valueOfDivision = (max - min) / this.correctedScaleSizes;
    this.buttonS = new ButtonModel(
      (buttonS.getBoundingClientRect().x - this.scaleX) / this.scaleW,
      1 - (this.relativeButtonW * (buttonE ? 2 : 1)),
      0
    );
    this.buttonE = buttonE 
      ? new ButtonModel(
        (
          buttonE.getBoundingClientRect().x - this.buttonW - this.scaleX
        ) / this.scaleW,
        1 - (this.relativeButtonW * 2),
        0
      ) 
      : this.buttonS;
  }
}

