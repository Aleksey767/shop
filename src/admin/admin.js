import '../styles/style.scss';
import './styles/admin.scss';
import Cart from './js/pages/shopping-cart';
import Wishlist from './js/pages/wishlist';
import Router from './js/router';
import Controller from './js/controller';
import Model from './js/model';
import './js/pages/settings-form';
import './js/pages/create-product-form';

async function me() {
  let response = await Model.me();

  if (response.error) {
    location.pathname = '/admin_entry';
  }
}

me();

Controller.fetchSettings().then((settings) => {
  showSettingsInHeader(settings);
});

Router.init();

function showSettingsInHeader(settings) {
  let $headerCurrency = document.getElementById('header-currency');
  let $headerRate = document.getElementById('header-rate');

  $headerCurrency.textContent = settings.currency;
  $headerRate.textContent = settings.exchangeRate;
}

let $headerMenu = document.getElementById('header-menu');
let $navList = document.getElementById('nav-list');
let $modal = document.getElementById('modal');
let $closeModalButton = document.getElementById('close-modal');
let $openWishlistButton = document.getElementById('header-wishlist');
let $openCartButton = document.getElementById('header-cart');
let $logoutButton = document.getElementById('logout-button');
let $logoutAllButton = document.getElementById('logoutAll-button');

$logoutButton.addEventListener('click', async (e) => {
  let response = await Model.logout();

  if (response.error) return;

  me();
});

$logoutAllButton.addEventListener('click', async (e) => {
  let response = await Model.logoutAll();

  if (response.error) return;

  me();
});

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
