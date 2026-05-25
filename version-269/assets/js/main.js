(function () {
  var menuButton = document.querySelector('.menu-toggle');
  var mobilePanel = document.querySelector('.mobile-panel');

  if (menuButton && mobilePanel) {
    menuButton.addEventListener('click', function () {
      mobilePanel.classList.toggle('open');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
  var current = 0;

  function setSlide(index) {
    if (!slides.length) {
      return;
    }
    current = (index + slides.length) % slides.length;
    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle('active', slideIndex === current);
    });
    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle('active', dotIndex === current);
    });
  }

  if (slides.length) {
    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        setSlide(index);
      });
    });
    setInterval(function () {
      setSlide(current + 1);
    }, 5200);
  }

  var panels = Array.prototype.slice.call(document.querySelectorAll('.filter-panel'));

  panels.forEach(function (panel) {
    var scope = panel.closest('main') || document;
    var searchInput = panel.querySelector('.search-input');
    var inputs = Array.prototype.slice.call(panel.querySelectorAll('[data-filter]'));
    var cards = Array.prototype.slice.call(scope.querySelectorAll('.movie-card'));
    var empty = scope.querySelector('.empty-message');

    function getYearMatch(value, year) {
      if (!value) {
        return true;
      }
      var y = parseInt(year || '0', 10);
      if (value === '2020') {
        return y >= 2020 && y < 2030;
      }
      if (value === '2010') {
        return y >= 2010 && y < 2020;
      }
      if (value === '2000') {
        return y >= 2000 && y < 2010;
      }
      if (value === '1990') {
        return y < 2000;
      }
      return String(year) === value;
    }

    function applyFilter() {
      var query = searchInput ? searchInput.value.trim().toLowerCase() : '';
      var filters = {};
      inputs.forEach(function (input) {
        filters[input.getAttribute('data-filter')] = input.value;
      });
      var visible = 0;

      cards.forEach(function (card) {
        var hay = (card.getAttribute('data-keywords') || '').toLowerCase();
        var title = (card.getAttribute('data-title') || '').toLowerCase();
        var typeOk = !filters.type || (card.getAttribute('data-type') || '').indexOf(filters.type) !== -1;
        var categoryOk = !filters.category || card.getAttribute('data-category') === filters.category;
        var yearOk = getYearMatch(filters.year, card.getAttribute('data-year'));
        var searchOk = !query || hay.indexOf(query) !== -1 || title.indexOf(query) !== -1;
        var ok = typeOk && categoryOk && yearOk && searchOk;
        card.style.display = ok ? '' : 'none';
        if (ok) {
          visible += 1;
        }
      });

      if (empty) {
        empty.classList.toggle('show', visible === 0);
      }
    }

    if (searchInput) {
      searchInput.addEventListener('input', applyFilter);
    }
    inputs.forEach(function (input) {
      input.addEventListener('change', applyFilter);
    });
  });

  var players = Array.prototype.slice.call(document.querySelectorAll('.video-frame'));

  players.forEach(function (frame) {
    var video = frame.querySelector('video');
    var button = frame.querySelector('.play-button');
    var layer = frame.querySelector('.play-layer');
    var hlsInstance = null;

    function startPlayer() {
      if (!video || !button) {
        return;
      }
      var src = button.getAttribute('data-play');
      if (!src) {
        return;
      }
      if (layer) {
        layer.classList.add('hidden');
      }
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        if (video.src !== src) {
          video.src = src;
        }
        video.play().catch(function () {});
        return;
      }
      if (window.Hls && window.Hls.isSupported()) {
        if (!hlsInstance) {
          hlsInstance = new window.Hls();
          hlsInstance.loadSource(src);
          hlsInstance.attachMedia(video);
          hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, function () {
            video.play().catch(function () {});
          });
        } else {
          video.play().catch(function () {});
        }
      }
    }

    if (button) {
      button.addEventListener('click', startPlayer);
    }
    if (layer) {
      layer.addEventListener('click', function (event) {
        if (event.target !== button) {
          startPlayer();
        }
      });
    }
  });
})();
