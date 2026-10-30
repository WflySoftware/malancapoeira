(() => {
  const region = document.getElementById('galeria');
  const track = document.getElementById('galeria-faixa');
  const toggle = document.getElementById('galeria-pausa');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let paused = motion.matches;
  let hovered = false;
  let visible = false;
  let lastInteraction = 0;
  function render() {
    toggle.textContent = paused ? '▶' : 'Ⅱ';
    toggle.setAttribute('aria-pressed', String(paused));
    toggle.setAttribute('aria-label', paused ? 'Retomar passagem automática' : 'Pausar passagem automática');
  }
  function advance(direction) {
    const max = track.scrollWidth - track.clientWidth;
    const origin = track.firstElementChild.offsetLeft;
    const positions = [...track.children].map(item => item.offsetLeft - origin);
    let target;
    if (direction > 0) {
      target = track.scrollLeft >= max - 2 ? 0 : positions.find(x => x > track.scrollLeft + 2) ?? max;
    } else {
      target = track.scrollLeft <= 2 ? max : positions.reverse().find(x => x < track.scrollLeft - 2) ?? 0;
    }
    track.scrollTo({left: Math.max(0, Math.min(max, target)), behavior: motion.matches ? 'auto' : 'smooth'});
  }
  document.getElementById('galeria-anterior').addEventListener('click', () => { lastInteraction = Date.now(); advance(-1); });
  document.getElementById('galeria-proxima').addEventListener('click', () => { lastInteraction = Date.now(); advance(1); });
  toggle.addEventListener('click', () => { paused = !paused; render(); });
  region.addEventListener('mouseenter', () => { hovered = true; });
  region.addEventListener('mouseleave', () => { hovered = false; });
  track.addEventListener('pointerdown', () => { lastInteraction = Date.now(); }, {passive: true});
  track.addEventListener('keydown', () => { lastInteraction = Date.now(); });
  new IntersectionObserver(entries => { visible = entries[0].isIntersecting; }, {threshold: 0.25}).observe(track);
  motion.addEventListener('change', () => { paused = motion.matches; render(); });
  window.setInterval(() => {
    if (!paused && !hovered && visible && !document.hidden && !region.contains(document.activeElement) && Date.now() - lastInteraction > 7000) advance(1);
  }, 4000);
  render();
})();
