// Match the static content in each row; details keep their natural height.
export function initProjectCardLayout() {
  const grids = [...document.querySelectorAll('.project-grid')];
  const slots = ['.project-card-top', '.project-content > h3', '.project-content > p'];

  function refresh() {
    for (const grid of grids) {
      const cards = [...grid.querySelectorAll('.project-card-featured')];
      for (const card of cards) {
        for (const selector of slots) card.querySelector(selector).style.minHeight = '';
      }
      const rows = new Map();
      for (const card of cards) {
        const top = Math.round(card.getBoundingClientRect().top);
        if (!rows.has(top)) rows.set(top, []);
        rows.get(top).push(card);
      }
      for (const row of rows.values()) {
        if (row.length < 2) continue;
        for (const selector of slots) {
          const elements = row.map(card => card.querySelector(selector));
          const height = Math.max(...elements.map(element => element.getBoundingClientRect().height));
          for (const element of elements) element.style.minHeight = `${height}px`;
        }
      }
    }
  }

  // Ignore height changes from details toggles to avoid resizing neighboring cards.
  if ('ResizeObserver' in window) {
    const widths = new WeakMap();
    const observer = new ResizeObserver(entries => {
      let changed = false;
      for (const entry of entries) {
        if (widths.get(entry.target) !== entry.contentRect.width) {
          widths.set(entry.target, entry.contentRect.width);
          changed = true;
        }
      }
      if (changed) refresh();
    });
    for (const grid of grids) observer.observe(grid);
  } else {
    window.addEventListener('resize', refresh);
  }
  document.fonts.ready.then(refresh);
  return { refresh };
}
