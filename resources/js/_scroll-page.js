/* eslint-disable */
document.addEventListener('DOMContentLoaded', function() {
  const backToTopButton = document.querySelector('#back-to-top-btn');

  if (backToTopButton) {
    backToTopButton.addEventListener('click', smoothScrollBackToTop);
  }

  const onScrollPage = (function() {
    let oldPos = window.scrollY;
    function fu() {
      const { clientHeight } = document.documentElement;
      const newPos = window.scrollY;

      const scroll = {
        up: newPos < oldPos, // прокрутка вверх
        down: newPos > oldPos, // прокрутка вниз
        limit: newPos > 200, // ниже 200px
        hero: newPos < clientHeight // в границе первого экрана
      };

      const pageHeader = document.querySelector('#header');

      if (pageHeader) {
        pageHeaderStiky(pageHeader, scroll);
      }

      if (scroll.limit) {
        // Show backToTopButton
        if (!backToTopButton.classList.contains('btnEntrance')) {
          backToTopButton.classList.remove('btnExit');
          backToTopButton.classList.add('btnEntrance');
          backToTopButton.style.display = 'block';
        }
      } else {
        // Hide backToTopButton
        if (backToTopButton.classList.contains('btnEntrance')) {
          backToTopButton.classList.remove('btnEntrance');
          backToTopButton.classList.add('btnExit');
          setTimeout(function() {
            backToTopButton.style.display = 'none';
          }, 250);
        }
      }

      oldPos = newPos;
    }
    return fu;
  })();
  window.addEventListener('scroll', onScrollPage);

  const pageHeaderStiky = (pageHeader, scroll) => {
    if (scroll.limit && !pageHeader.classList.contains('header--fixed')) {
      pageHeader.classList.add('header--fixed');
    }

    if (!scroll.limit) {
      pageHeader.classList.remove('header--fixed');
    }

    if (scroll.up && scroll.limit) {
      pageHeader.classList.add('header--show');
    }

    if (scroll.down || !scroll.limit) {
      pageHeader.classList.remove('header--show');
    }
  };

  function smoothScrollBackToTop() {
    const targetPosition = 0;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const duration = 750;
    let start = null;
  
    window.requestAnimationFrame(step);
  
    function step(timestamp) {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      window.scrollTo(
        0,
        easeInOutCubic(progress, startPosition, distance, duration)
      );
      if (progress < duration) window.requestAnimationFrame(step);
    }
  }
  
  function easeInOutCubic(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return (c / 2) * t * t * t + b;
    t -= 2;
    return (c / 2) * (t * t * t + 2) + b;
  }
});
