import IEventBinder from '../../../EventBinder/IEventBinder';

interface ICalcPositionArgs {
  pointerCoord: number
  max: number
  min: number
  containerCoord: number
  containerSize: number
  shift: number
}

interface IHandleView extends IEventBinder {
  calcPosition<A extends ICalcPositionArgs>(arg: A): number
  move(position: number): void
  swap(): IHandleView
}

export {IHandleView, ICalcPositionArgs};

