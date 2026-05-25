(function () {
  const menuButton = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function () {
      mobileNav.classList.toggle('is-open');
    });
  }

  const hero = document.querySelector('[data-hero]');

  if (hero) {
    const slides = Array.from(hero.querySelectorAll('.hero-slide'));
    const dots = Array.from(hero.querySelectorAll('[data-hero-dot]'));
    const prev = hero.querySelector('[data-hero-prev]');
    const next = hero.querySelector('[data-hero-next]');
    let current = 0;
    let timer = null;

    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === current);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(current + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
      }
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        show(Number(dot.getAttribute('data-hero-dot')));
        start();
      });
    });

    if (prev) {
      prev.addEventListener('click', function () {
        show(current - 1);
        start();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(current + 1);
        start();
      });
    }

    hero.addEventListener('mouseenter', stop);
    hero.addEventListener('mouseleave', start);
    show(0);
    start();
  }

  const panel = document.querySelector('[data-filter-panel]');
  const list = document.querySelector('[data-card-list]');

  if (panel && list) {
    const input = panel.querySelector('#page-search');
    const chips = Array.from(panel.querySelectorAll('[data-filter]'));
    const items = Array.from(list.querySelectorAll('.searchable-item'));
    const params = new URLSearchParams(window.location.search);
    const initial = params.get('q') || '';
    let activeFilter = 'all';

    if (input && initial) {
      input.value = initial;
    }

    const heroQuery = document.getElementById('hero-query');
    if (heroQuery && initial) {
      heroQuery.value = initial;
    }

    function textOf(item) {
      return [
        item.getAttribute('data-title'),
        item.getAttribute('data-year'),
        item.getAttribute('data-type'),
        item.getAttribute('data-region'),
        item.getAttribute('data-genre'),
        item.getAttribute('data-tags')
      ].join(' ').toLowerCase();
    }

    function apply() {
      const query = input ? input.value.trim().toLowerCase() : '';
      let visible = 0;

      items.forEach(function (item) {
        const text = textOf(item);
        const matchesText = !query || text.indexOf(query) !== -1;
        const matchesFilter = activeFilter === 'all' || text.indexOf(activeFilter.toLowerCase()) !== -1;
        const ok = matchesText && matchesFilter;
        item.style.display = ok ? '' : 'none';
        if (ok) {
          visible += 1;
        }
      });

      let empty = list.querySelector('.no-result');
      if (!visible) {
        if (!empty) {
          empty = document.createElement('div');
          empty.className = 'no-result';
          empty.textContent = '没有找到匹配的影片，请更换关键词。';
          list.appendChild(empty);
        }
      } else if (empty) {
        empty.remove();
      }
    }

    if (input) {
      input.addEventListener('input', apply);
    }

    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        activeFilter = chip.getAttribute('data-filter') || 'all';
        chips.forEach(function (other) {
          other.classList.toggle('active', other === chip);
        });
        apply();
      });
    });

    apply();
  }
})();
