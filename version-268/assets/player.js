(function () {
  function begin(button) {
    const target = button.getAttribute('data-target');
    const src = button.getAttribute('data-play');
    const video = document.getElementById(target);
    const shell = button.closest('.player-shell');
    const cover = shell ? shell.querySelector('.player-cover') : null;

    if (!video || !src) {
      return;
    }

    if (!video.getAttribute('src')) {
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = src;
      } else if (window.Hls && window.Hls.isSupported()) {
        const hls = new window.Hls();
        hls.loadSource(src);
        hls.attachMedia(video);
      } else {
        video.src = src;
      }
    }

    if (cover) {
      cover.classList.add('is-hidden');
    }

    video.controls = true;
    video.play().catch(function () {});
  }

  document.addEventListener('click', function (event) {
    const button = event.target.closest('.play-trigger');
    if (button) {
      event.preventDefault();
      begin(button);
      return;
    }

    const cover = event.target.closest('.player-cover');
    if (cover) {
      const trigger = cover.querySelector('.play-trigger');
      if (trigger) {
        begin(trigger);
      }
    }
  });

  document.addEventListener('click', function (event) {
    const video = event.target.closest('.movie-player');
    if (!video || video.getAttribute('src')) {
      return;
    }
    const shell = video.closest('.player-shell');
    const trigger = shell ? shell.querySelector('.play-trigger') : null;
    if (trigger) {
      begin(trigger);
    }
  });
})();
