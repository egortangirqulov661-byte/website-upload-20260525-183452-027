(function () {
  var players = Array.prototype.slice.call(document.querySelectorAll('[data-player]'));

  function loadHls(callback) {
    if (window.Hls) {
      callback();
      return;
    }

    var script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/hls.js@latest';
    script.onload = callback;
    document.head.appendChild(script);
  }

  function attachSource(video, source, done) {
    if (!source) {
      done();
      return;
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
      done();
      return;
    }

    loadHls(function () {
      if (window.Hls && window.Hls.isSupported()) {
        var hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(source);
        hls.attachMedia(video);
        video._hls = hls;
      } else {
        video.src = source;
      }
      done();
    });
  }

  players.forEach(function (player) {
    var video = player.querySelector('video');
    var overlay = player.querySelector('.player-overlay');
    var source = player.getAttribute('data-src');
    var initialized = false;

    if (!video || !overlay) {
      return;
    }

    function startPlayback() {
      if (initialized) {
        overlay.classList.add('is-hidden');
        video.play().catch(function () {});
        return;
      }

      initialized = true;
      attachSource(video, source, function () {
        overlay.classList.add('is-hidden');
        video.play().catch(function () {});
      });
    }

    overlay.addEventListener('click', startPlayback);
    video.addEventListener('play', function () {
      overlay.classList.add('is-hidden');
    });
    video.addEventListener('pause', function () {
      if (!video.ended) {
        overlay.classList.remove('is-hidden');
      }
    });
    video.addEventListener('ended', function () {
      overlay.classList.remove('is-hidden');
    });
  });
})();
