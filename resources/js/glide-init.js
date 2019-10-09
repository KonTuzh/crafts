import Glide from '@glidejs/glide'

const createGlidePopular = () => {
  const glidePopularElement = document.querySelector('#glide-popular');
  if (glidePopularElement) {
    let glidePopularPosts = new Glide(glidePopularElement, {
      hoverpause: true,
      autoplay: 6000,
      animationDuration: 500,
      rewindDuration: 2000,
      perView: 1
    });
    return glidePopularPosts.mount();
  }
};

export const popularPostsSlider = () => {
  document.addEventListener("DOMContentLoaded", createGlidePopular);
};