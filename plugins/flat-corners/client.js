window.__ModuleLoader__.load({
  id: 'dsh-exv-flat-corners',
  factory(require) {
    const React = require('react');
    const h = React.createElement;

    const css = [
      '*, *::before, *::after { border-radius: 0 !important; }',
      'svg rect { rx: 0 !important; ry: 0 !important; }',
      '::-webkit-scrollbar-thumb, ::-webkit-scrollbar-track, ::-webkit-scrollbar-corner { border-radius: 0 !important; }',
      '::backdrop { border-radius: 0 !important; }',
    ].join('\n');

    function CornerStyle() {
      return h('style', { 'data-dsh-flat-corners': '' }, css);
    }

    return {
      inject: ['slots'],
      apply(ctx) {
        ctx.slots.inject('shell.overlay', () => ctx.slots.register({
          name: 'shell.overlay', id: 'flat-corners', order: 0,
        }, CornerStyle));
      },
    };
  },
});
