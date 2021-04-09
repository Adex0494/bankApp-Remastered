'use strict';

///////////////////////////////////////
// Modal window

//DOM variables
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');
const sections = document.querySelectorAll('.section');
const images = document.querySelectorAll('.features__img');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//Btn

btnScrollTo.addEventListener('click', function (e) {
  const s1coords = section1.getBoundingClientRect();

  section1.scrollIntoView({ behavior: 'smooth' });
});

//Nav to scroll smoothly
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

//Tab component

tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

  if (!clicked) return;
  //Remove active classes
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  //Activate tab
  clicked.classList.add('operations__tab--active');

  //Activate content
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

//Nav links effect
const changeNavChildrenOpacity = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(e => {
      if (e !== link) e.style.opacity = this;
      logo.style.opacity = this;
    });
  }
};

nav.addEventListener('mouseover', changeNavChildrenOpacity.bind(0.5));
nav.addEventListener('mouseout', changeNavChildrenOpacity.bind(1));

//Sticky navigation

//Bad performance
// const initialS1Coords = section1.getBoundingClientRect();

// window.addEventListener('scroll', function () {
//   if (window.scrollY > initialS1Coords.top) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// });

//Good performance
const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;

  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});

headerObserver.observe(header);

//Animation when entering a section
const sectionAnimation = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) entry.target.classList.add('section--hidden');
  else entry.target.classList.remove('section--hidden');
  //observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(sectionAnimation, {
  root: null,
  threshold: 0.2,
});

sections.forEach(s => {
  s.classList.remove('section--hidden');
  sectionObserver.observe(s);
});

//Image loading effect
const imageLoad = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;
  entry.target.src = entry.target.src.replace('-lazy', '');

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imageObserver = new IntersectionObserver(imageLoad, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

images.forEach(img => imageObserver.observe(img));

//Slider functionality----------------------------------------------------------

const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const dotsContainer = document.querySelector('.dots');

const slider = function () {
  let curSlide = 0;
  const maxSlide = slides.length;

  //Dots of slides-------------------------------------
  const createDots = function () {
    slides.forEach((_, i) =>
      dotsContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      )
    );
  };

  createDots();

  const dots = document.querySelectorAll('.dots__dot');

  const setDotColor = function (i) {
    dots.forEach(d => {
      if (Number(d.dataset.slide) !== i)
        d.classList.remove('dots__dot--active');
      else d.classList.add('dots__dot--active');
    });
  };

  dotsContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const slideIndex = Number(e.target.dataset.slide);
      setDotColor(slideIndex);
      goToSlide(slideIndex);
      curSlide = slideIndex;
    }
  });
  //-------------------------------------------------

  //Change slide functions---------------------------
  const goToSlide = function (slide) {
    setDotColor(slide);
    slides.forEach((s, i) => {
      s.style.transform = `translateX(${100 * (i - slide)}%)`;
    });
  };
  //Initializing the first slide
  goToSlide(0);

  const nextSlide = function () {
    if (curSlide === maxSlide - 1) curSlide = 0;
    else curSlide++;
    goToSlide(curSlide);
  };

  const previousSlide = function () {
    if (curSlide === 0) curSlide = maxSlide - 1;
    else curSlide--;
    goToSlide(curSlide);
  };

  //Events------------------
  btnLeft.addEventListener('click', previousSlide);
  btnRight.addEventListener('click', nextSlide);

  document.addEventListener('keydown', function (e) {
    (e.key === 'ArrowLeft' && previousSlide()) ||
      (e.key === 'ArrowRight' && nextSlide());
  });
};
slider();
