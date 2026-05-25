(function () {
  var root = document.body.getAttribute('data-root') || '';
  var nav = document.querySelector('.site-nav');
  var toggle = document.querySelector('.menu-toggle');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      nav.classList.toggle('open');
    });
  }

  var hero = document.querySelector('[data-hero]');

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('.hero-dot'));
    var prev = hero.querySelector('.hero-prev');
    var next = hero.querySelector('.hero-next');
    var current = 0;
    var timer = null;

    function show(index) {
      if (!slides.length) {
        return;
      }

      current = (index + slides.length) % slides.length;

      slides.forEach(function (slide, i) {
        slide.classList.toggle('active', i === current);
      });

      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === current);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(current + 1);
      }, 5000);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
      }
    }

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

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        show(Number(dot.getAttribute('data-slide')) || 0);
        start();
      });
    });

    hero.addEventListener('mouseenter', stop);
    hero.addEventListener('mouseleave', start);
    start();
  }

  var globalSearch = document.getElementById('globalSearch');
  var searchResults = document.getElementById('searchResults');

  function renderGlobalResults(query) {
    if (!globalSearch || !searchResults) {
      return;
    }

    var q = String(query || '').trim().toLowerCase();

    if (!q) {
      searchResults.hidden = true;
      searchResults.innerHTML = '';
      return;
    }

    var data = Array.isArray(window.SITE_MOVIES) ? window.SITE_MOVIES : [];
    var results = data.filter(function (item) {
      var haystack = [item.title, item.year, item.region, item.type, item.genre, item.tags, item.category].join(' ').toLowerCase();
      return haystack.indexOf(q) !== -1;
    }).slice(0, 12);

    if (!results.length) {
      searchResults.hidden = false;
      searchResults.innerHTML = '<div class="search-result-item"><div></div><div><strong>没有匹配结果</strong><span>请尝试其他关键词</span></div></div>';
      return;
    }

    searchResults.hidden = false;
    searchResults.innerHTML = results.map(function (item) {
      return '<a class="search-result-item" href="' + root + item.url + '">' +
        '<img src="' + root + item.cover + '" alt="' + escapeHtml(item.title) + '">' +
        '<div><strong>' + escapeHtml(item.title) + '</strong><span>' + escapeHtml(item.year + ' · ' + item.region + ' · ' + item.genre) + '</span></div>' +
        '</a>';
    }).join('');
  }

  if (globalSearch && searchResults) {
    globalSearch.addEventListener('input', function () {
      renderGlobalResults(globalSearch.value);
    });

    document.addEventListener('click', function (event) {
      if (!event.target.closest('.global-search')) {
        searchResults.hidden = true;
      }
    });
  }

  var filterInput = document.querySelector('.filter-input');
  var yearFilter = document.querySelector('.year-filter');
  var typeFilter = document.querySelector('.type-filter');
  var filterScope = document.querySelector('.filter-scope');
  var noResults = document.querySelector('.no-results');

  function applyFilters() {
    if (!filterScope) {
      return;
    }

    var q = filterInput ? filterInput.value.trim().toLowerCase() : '';
    var year = yearFilter ? yearFilter.value : '';
    var type = typeFilter ? typeFilter.value : '';
    var cards = Array.prototype.slice.call(filterScope.querySelectorAll('.movie-card'));
    var visible = 0;

    cards.forEach(function (card) {
      var haystack = [
        card.getAttribute('data-title'),
        card.getAttribute('data-region'),
        card.getAttribute('data-type'),
        card.getAttribute('data-genre'),
        card.getAttribute('data-tags')
      ].join(' ').toLowerCase();
      var matchQuery = !q || haystack.indexOf(q) !== -1;
      var matchYear = !year || card.getAttribute('data-year') === year;
      var matchType = !type || String(card.getAttribute('data-type') || '').indexOf(type) !== -1;
      var show = matchQuery && matchYear && matchType;

      card.hidden = !show;

      if (show) {
        visible += 1;
      }
    });

    if (noResults) {
      noResults.hidden = visible !== 0;
    }
  }

  [filterInput, yearFilter, typeFilter].forEach(function (control) {
    if (control) {
      control.addEventListener('input', applyFilters);
      control.addEventListener('change', applyFilters);
    }
  });

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>"]/g, function (char) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;'
      }[char];
    });
  }
})();
