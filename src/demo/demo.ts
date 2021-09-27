import './demo.sass';

import Conf from '../conf/Conf';

const options: IOptions[] = [
  {
    step: 1, max: 99, min: 1, isInterval: true
  },
  {
    step: 0.1, max: 1e3 - 1, min: 0, isInterval: true, isVertical: true
  },
  {
    max: 9.001
  },
  {
    isInterval: true, isVertical: true, min: -10, max: 100, step: 2,
  },
];

document
  .querySelectorAll<HTMLElement>('.js-container')
  .forEach((c, idx) => new Conf(c).init(options[idx]));

