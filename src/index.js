import './styles/style.scss';
import './js/model';
import Cart from './js/pages/shopping-cart';
import Wishlist from './js/pages/wishlist';
import Router from './js/router';
import Controller from './js/controller';

Controller.fetchSettings();

Router.init();

let $modal = document.getElementById('modal');
let $headerMenu = document.getElementById('header-menu');
let $closeModalButton = document.getElementById('close-modal');
let $openWishlistButton = document.getElementById('header-wishlist');
let $openCartButton = document.getElementById('header-cart');
let $navList = document.getElementById('nav-list');

$closeModalButton.addEventListener('click', (e) => {
  $modal.classList.toggle('modal--close');
  let activeMenuButton = $headerMenu.querySelector('.menu__button--active');
  activeMenuButton ? activeMenuButton.classList.remove('menu__button--active') : false;

  // enable scrolling
  if (document.body.classList.contains('overflow-hidden')) {
    document.body.classList.remove('overflow-hidden');
  }
});

$openWishlistButton.addEventListener('click', (e) => {
  let activeMenuButton = $headerMenu.querySelector('.menu__button--active');
  activeMenuButton ? activeMenuButton.classList.remove('menu__button--active') : false;
  e.currentTarget.classList.add('menu__button--active');

  // disable scrolling
  if (!document.body.classList.contains('overflow-hidden')) {
    document.body.classList.add('overflow-hidden');
  }

  if ($modal.classList.contains('modal--close')) {
    $modal.classList.toggle('modal--close');
    Wishlist.render();
  } else {
    Wishlist.render();
  }
});

$openCartButton.addEventListener('click', (e) => {
  let activeMenuButton = $headerMenu.querySelector('.menu__button--active');
  activeMenuButton ? activeMenuButton.classList.remove('menu__button--active') : false;
  e.currentTarget.classList.add('menu__button--active');

  // disable scrolling
  if (!document.body.classList.contains('overflow-hidden')) {
    document.body.classList.add('overflow-hidden');
  }

  if ($modal.classList.contains('modal--close')) {
    $modal.classList.toggle('modal--close');
    Cart.render();
  } else {
    Cart.render();
  }
});

$navList.addEventListener('click', (e) => {
  if (e.target.dataset.role === 'nav-link') {
    let currentItem = document.querySelector('.nav__link--current');
    if (currentItem) currentItem.classList.toggle('nav__link--current');
    e.target.classList.toggle('nav__link--current');
  }
});

Wishlist.setCountInHeader();
Cart.setCountInHeader();
