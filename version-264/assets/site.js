(function () {
  var mobileButton = document.querySelector('.mobile-toggle');
  var mobilePanel = document.querySelector('.mobile-panel');

  if (mobileButton && mobilePanel) {
    mobileButton.addEventListener('click', function () {
      mobilePanel.classList.toggle('is-open');
    });
  }

  var hero = document.querySelector('[data-hero]');

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var prev = hero.querySelector('[data-hero-prev]');
    var next = hero.querySelector('[data-hero-next]');
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      if (!slides.length) {
        return;
      }

      index = (nextIndex + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === index);
      });

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === index);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
      }
    }

    if (prev) {
      prev.addEventListener('click', function () {
        show(index - 1);
        start();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(index + 1);
        start();
      });
    }

    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener('click', function () {
        show(dotIndex);
        start();
      });
    });

    hero.addEventListener('mouseenter', stop);
    hero.addEventListener('mouseleave', start);
    show(0);
    start();
  }

  var params = new URLSearchParams(window.location.search);
  var query = params.get('q') || '';
  var filterInput = document.querySelector('.page-filter');

  if (filterInput && query) {
    filterInput.value = query;
  }

  function normalize(value) {
    return String(value || '').toLowerCase().trim();
  }

  function runFilter(input) {
    var list = document.querySelector('.searchable-list');

    if (!list) {
      return;
    }

    var keyword = normalize(input.value);
    var cards = Array.prototype.slice.call(list.querySelectorAll('.movie-card'));

    cards.forEach(function (card) {
      var haystack = normalize(card.getAttribute('data-title') + ' ' + card.getAttribute('data-meta'));
      var matched = !keyword || haystack.indexOf(keyword) !== -1;
      card.classList.toggle('is-hidden', !matched);
    });
  }

  if (filterInput) {
    filterInput.addEventListener('input', function () {
      runFilter(filterInput);
    });
    runFilter(filterInput);
  }
})();
