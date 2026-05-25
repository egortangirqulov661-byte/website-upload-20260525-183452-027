(function () {
  var body = document.body;
  var menuButton = document.querySelector('.menu-toggle');
  if (menuButton) {
    menuButton.addEventListener('click', function () {
      body.classList.toggle('menu-open');
    });
  }

  var hero = document.querySelector('[data-hero]');
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('.hero-dot'));
    var prev = hero.querySelector('.hero-prev');
    var next = hero.querySelector('.hero-next');
    var index = 0;
    var timer = null;

    function showSlide(nextIndex) {
      if (!slides.length) return;
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === index);
      });
    }

    function startTimer() {
      window.clearInterval(timer);
      timer = window.setInterval(function () {
        showSlide(index + 1);
      }, 5200);
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        showSlide(Number(dot.getAttribute('data-slide')) || 0);
        startTimer();
      });
    });

    if (prev) {
      prev.addEventListener('click', function () {
        showSlide(index - 1);
        startTimer();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        showSlide(index + 1);
        startTimer();
      });
    }

    showSlide(0);
    startTimer();
  }

  var panels = Array.prototype.slice.call(document.querySelectorAll('.filter-panel'));
  panels.forEach(function (panel) {
    var search = panel.querySelector('.local-search');
    var year = panel.querySelector('.year-filter');
    var sort = panel.querySelector('.sort-filter');
    var grid = panel.nextElementSibling;
    if (!grid || !grid.classList.contains('movie-grid')) return;
    var cards = Array.prototype.slice.call(grid.querySelectorAll('.movie-card'));

    function matchYear(value, cardYear) {
      if (!value) return true;
      if (value === 'older') return Number(cardYear) < 2020;
      return String(cardYear) === value;
    }

    function applyFilters() {
      var keyword = search ? search.value.trim().toLowerCase() : '';
      var selectedYear = year ? year.value : '';
      cards.forEach(function (card) {
        var haystack = [
          card.getAttribute('data-title'),
          card.getAttribute('data-region'),
          card.getAttribute('data-genre'),
          card.getAttribute('data-type'),
          card.textContent
        ].join(' ').toLowerCase();
        var ok = (!keyword || haystack.indexOf(keyword) !== -1) && matchYear(selectedYear, card.getAttribute('data-year'));
        card.style.display = ok ? '' : 'none';
      });
    }

    function applySort() {
      var mode = sort ? sort.value : 'default';
      var ordered = cards.slice();
      if (mode === 'year-desc') {
        ordered.sort(function (a, b) {
          return Number(b.getAttribute('data-year')) - Number(a.getAttribute('data-year'));
        });
      } else if (mode === 'year-asc') {
        ordered.sort(function (a, b) {
          return Number(a.getAttribute('data-year')) - Number(b.getAttribute('data-year'));
        });
      } else if (mode === 'title') {
        ordered.sort(function (a, b) {
          return String(a.getAttribute('data-title')).localeCompare(String(b.getAttribute('data-title')), 'zh-Hans-CN');
        });
      }
      if (mode !== 'default') {
        ordered.forEach(function (card) {
          grid.appendChild(card);
        });
      }
      applyFilters();
    }

    if (search) search.addEventListener('input', applyFilters);
    if (year) year.addEventListener('change', applyFilters);
    if (sort) sort.addEventListener('change', applySort);

    var params = new URLSearchParams(window.location.search);
    var query = params.get('q');
    if (query && search) {
      search.value = query;
      applyFilters();
    }
  });
})();
