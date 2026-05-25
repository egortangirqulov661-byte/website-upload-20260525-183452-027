(function () {
    const menuToggle = document.querySelector('[data-menu-toggle]');
    const mobileMenu = document.querySelector('[data-mobile-menu]');

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', function () {
            mobileMenu.classList.toggle('is-open');
        });
    }

    const hero = document.querySelector('[data-hero]');

    if (hero) {
        const slides = Array.from(hero.querySelectorAll('[data-hero-slide]'));
        const dots = Array.from(hero.querySelectorAll('[data-hero-dot]'));
        const prev = hero.querySelector('[data-hero-prev]');
        const next = hero.querySelector('[data-hero-next]');
        let index = 0;
        let timer = null;

        const show = function (target) {
            index = (target + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === index);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === index);
            });
        };

        const start = function () {
            timer = window.setInterval(function () {
                show(index + 1);
            }, 5000);
        };

        const restart = function () {
            if (timer) {
                window.clearInterval(timer);
            }
            start();
        };

        if (prev) {
            prev.addEventListener('click', function () {
                show(index - 1);
                restart();
            });
        }

        if (next) {
            next.addEventListener('click', function () {
                show(index + 1);
                restart();
            });
        }

        dots.forEach(function (dot, dotIndex) {
            dot.addEventListener('click', function () {
                show(dotIndex);
                restart();
            });
        });

        show(0);
        start();
    }

    const filterRoots = document.querySelectorAll('[data-filter-root]');

    filterRoots.forEach(function (root) {
        const scope = root.closest('main') || document;
        const input = root.querySelector('[data-filter-keyword]');
        const year = root.querySelector('[data-filter-year]');
        const category = root.querySelector('[data-filter-category]');
        const reset = root.querySelector('[data-filter-reset]');
        const cards = Array.from(scope.querySelectorAll('[data-card], [data-rank-row]'));
        const empty = scope.querySelector('[data-empty-tip]');

        const apply = function () {
            const keyword = input ? input.value.trim().toLowerCase() : '';
            const yearValue = year ? year.value : '';
            const categoryValue = category ? category.value : '';
            let visible = 0;

            cards.forEach(function (card) {
                const haystack = [
                    card.getAttribute('data-title') || '',
                    card.getAttribute('data-region') || '',
                    card.getAttribute('data-genre') || '',
                    card.textContent || ''
                ].join(' ').toLowerCase();
                const cardYear = card.getAttribute('data-year') || '';
                const cardCategory = card.getAttribute('data-category') || '';
                const matchKeyword = !keyword || haystack.indexOf(keyword) !== -1;
                const matchYear = !yearValue || (yearValue === '2021' ? Number(cardYear) <= 2021 : cardYear === yearValue);
                const matchCategory = !categoryValue || cardCategory === categoryValue;
                const pass = matchKeyword && matchYear && matchCategory;

                card.style.display = pass ? '' : 'none';

                if (pass) {
                    visible += 1;
                }
            });

            if (empty) {
                empty.classList.toggle('is-visible', visible === 0);
            }
        };

        if (input) {
            input.addEventListener('input', apply);
        }

        if (year) {
            year.addEventListener('change', apply);
        }

        if (category) {
            category.addEventListener('change', apply);
        }

        if (reset) {
            reset.addEventListener('click', function () {
                if (input) {
                    input.value = '';
                }
                if (year) {
                    year.value = '';
                }
                if (category) {
                    category.value = '';
                }
                apply();
            });
        }
    });

    const players = document.querySelectorAll('[data-player]');

    players.forEach(function (box) {
        const video = box.querySelector('video');
        const button = box.querySelector('[data-play-button]');
        const m3u8 = box.getAttribute('data-m3u8');
        let ready = false;
        let hls = null;

        const attach = function () {
            if (!video || !m3u8 || ready) {
                return;
            }

            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = m3u8;
            } else if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls();
                hls.loadSource(m3u8);
                hls.attachMedia(video);
            } else {
                video.src = m3u8;
            }

            ready = true;
        };

        const play = function () {
            attach();

            if (button) {
                button.classList.add('is-hidden');
            }

            if (video) {
                const result = video.play();

                if (result && typeof result.catch === 'function') {
                    result.catch(function () {
                        if (button) {
                            button.classList.remove('is-hidden');
                        }
                    });
                }
            }
        };

        if (button) {
            button.addEventListener('click', play);
        }

        if (video) {
            video.addEventListener('click', function () {
                if (video.paused) {
                    play();
                } else {
                    video.pause();
                }
            });

            video.addEventListener('play', function () {
                if (button) {
                    button.classList.add('is-hidden');
                }
            });
        }
    });
})();
