import defaultOptions from 'slider/defaultOptions';

function create() {
  document.querySelectorAll('[data-super-slider]').forEach((s) => {
    const data = (<HTMLElement>s).dataset;
    $(s).slider(
      Object.entries(defaultOptions).reduce((options, [o, value]) => {
        if (o in data) {
          if (typeof value === 'number') {
            return { ...options, [o]: Number(data[o]) };
          }
          if (typeof value === 'boolean') {
            return { ...options, [o]: data[o] === 'false' };
          }
        }
        return options;
      }, {} as Options)
    );
  });
}

function init(): void {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', create);
    return;
  }
  create();
}

export default init;
