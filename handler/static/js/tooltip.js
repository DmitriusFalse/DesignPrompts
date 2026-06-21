document.addEventListener('alpine:init', () => {
  Alpine.data('tooltip', () => ({
    show: false,

    enter() {
      this.show = true;
      this.$nextTick(() => this._position());
    },

    leave() {
      this.show = false;
    },

    _position() {
      const tip = this.$el.querySelector('.tooltip');
      if (!tip) return;

      tip.style.transform = 'none';
      tip.style.margin = '0';
      tip.style.bottom = '';
      tip.style.top = '';
      tip.style.left = '';
      tip.style.right = '';

      requestAnimationFrame(() => {
        const { computePosition, flip, shift, offset } = window.FloatingUIDOM;

        computePosition(this.$el, tip, {
          placement: 'top',
          middleware: [offset(8), flip(), shift({ padding: 4 })],
        }).then(({ x, y }) => {
          tip.style.left = x + 'px';
          tip.style.top = y + 'px';
          tip.style.bottom = 'auto';
        });
      });
    },
  }));
});
