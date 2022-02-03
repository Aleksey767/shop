import View from '../view';
import Templates from '../templates';
import ShoppingCart from './shopping-cart';
import Wishlist from './wishlist';
import Controller from '../controller';
import EditProduct from './edit-product';

let items;
let filteredItems;
let startRenderWith = 0;
let container = document.getElementById('main-container');
let filterWrapper = document.querySelector('.filter-wrapper');
let upArrow = document.querySelector('.up-arrow');

container.addEventListener('click', handleClickOnMainContainer);
filterWrapper.addEventListener('click', handleClickOnFilter);
window.addEventListener('hashchange', handleHash);
upArrow.addEventListener('click', handleClickOnUpArrow);
document.addEventListener('scroll', handleScrollForUpArrow);

let mainPage = {
  setData(listItem) {
    items = listItem;
    filteredItems = items;

    if (window.location.hash === '#vehicles') {
      filterItems();
    }

    if (Array.isArray(filteredItems)) {
      this.renderList();
      document.addEventListener('scroll', handleScroll);
    } else {
      this.renderOne();
    }
  },

  renderList() {
    let html;
    if (startRenderWith > filteredItems.length - 1) {
      startRenderWith = filteredItems.length;
      Controller.addProducts(window.location.hash.slice(1));
      document.removeEventListener('scroll', handleScroll);
      return;
    }

    if (startRenderWith === 0) {
      html = View.renderList(Templates.listItem, filteredItems.slice(0, 16));
      startRenderWith = 16;
    } else {
      html = View.renderList(
        Templates.listItem,
        filteredItems.slice(startRenderWith, startRenderWith + 4)
      );
      startRenderWith += 4;
    }

    if (filteredItems.length < 16) {
      startRenderWith = filteredItems.length;
      Controller.addProducts(window.location.hash.slice(1));
    }

    let ul = document.querySelector('.list-item');
    if (!ul) {
      ul = document.createElement('ul');
      ul.className = 'list-item';
      container.innerHTML = '';
      container.append(ul);
    }
    ul.insertAdjacentHTML('beforeend', html);
  },

  renderOne() {
    let html = View.renderOne(Templates.oneItem, items);

    container.innerHTML = '';
    container.innerHTML = html;

    document.removeEventListener('scroll', handleScroll);
  },

  setEmptyHeart(id) {
    let button = container.querySelector(`[data-product-id='${id}'] .heart`);
    if (!button) return;
    button.className = 'heart heart--empty';
  },

  disablePurchaseButton(id) {
    let button = container.querySelector(`[data-product-id='${id}'] .purchase-button`);
    if (!button) return;
    button.setAttribute('disabled', 'true');
  },

  enablePurchaseButton(id) {
    let button = container.querySelector(`[data-product-id='${id}'] .purchase-button`);
    if (!button) return;
    button.removeAttribute('disabled', 'true');
  },
};

export default mainPage;

function handleClickOnMainContainer(event) {
  let product = event.target.closest('[data-product-id]');
  if (!product) return;
  if (!product.hasAttribute('data-product-id')) return;
  let productId = product.dataset.productId;

  if (event.target.className === 'edit-block__button') {
    EditProduct.showEditProductWindow(productId);
  }

  if (event.target.classList.contains('purchase-button')) {
    event.target.setAttribute('disabled', 'true');
    ShoppingCart.addProduct(productId);
  }

  if (event.target.classList.contains('heart')) {
    if (event.target.classList.contains('heart--empty')) {
      Wishlist.addProduct(productId);
    } else {
      Wishlist.deleteProduct(productId);
    }

    event.target.classList.toggle('heart--empty');
    event.target.classList.toggle('heart--full');
  }
}

function handleScroll() {
  let documentHeight = Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.offsetHeight,
    document.body.clientHeight,
    document.documentElement.clientHeight
  );
  let windowHeight = document.documentElement.clientHeight;
  let scroll = window.pageYOffset;

  if (documentHeight <= scroll + windowHeight + 10) {
    mainPage.renderList();
  }
}

function handleHash(event) {
  let ul = document.querySelector('.list-item');
  if (ul) ul.innerHTML = '';
  window.scrollTo(0, 0);
  startRenderWith = 0;

  let hash = event.target.location.hash;
  if (hash === '#vehicles') {
    filterWrapper.style.display = 'block';
  } else {
    filterWrapper.style.display = 'none';
  }
}

function handleClickOnUpArrow() {
  window.scrollTo(0, 0);
}

function handleScrollForUpArrow() {
  let windowHeight = document.documentElement.clientHeight;
  let scroll = window.pageYOffset;

  if (scroll > windowHeight) {
    upArrow.style.display = 'block';
  } else {
    upArrow.style.display = 'none';
  }
}

function handleClickOnFilter(event) {
  let subFilterLink = event.target.closest('.sub-filter__link');
  if (subFilterLink) {
    let subFilterList = subFilterLink.closest('.sub-filter__list');
    if (!subFilterList) return;

    let filterLink = subFilterList.previousElementSibling;
    if (!filterLink) return;

    if (filterLink.textContent.trim() !== subFilterLink.textContent.trim()) {
      filterLink.innerHTML = subFilterLink.innerHTML;
      filterItems();
      mainPage.renderList();
    }

    subFilterList.style.display = 'none';
    return;
  }

  let filterLink = event.target.closest('.filter__link');
  if (filterLink) {
    if (filterLink.textContent.trim() === 'Show all vehicles') {
      hideSubfilterLists();
      resetFilter();
      mainPage.renderList();
      return;
    }
    let subFilterList = filterLink.nextElementSibling;
    if (!subFilterList) return;
    hideSubfilterLists(subFilterList);
    subFilterList.style.display =
      getComputedStyle(subFilterList).display === 'none' ? 'block' : 'none';
  }
}

function resetFilter() {
  let filterLinkElements = filterWrapper.querySelectorAll('.filter__link');
  let filterWasChanged = false;
  for (let filterLink of filterLinkElements) {
    let subFilterList = filterLink.nextElementSibling;
    if (!subFilterList) continue;
    let subFilterLink = subFilterList.querySelector('.sub-filter__link');
    if (filterLink.textContent.trim() !== subFilterLink.textContent.trim()) {
      filterLink.innerHTML = subFilterLink.innerHTML;
      filterWasChanged = true;
    }
  }
  if (filterWasChanged) {
    let ul = container.querySelector('.list-item');
    if (ul) ul.innerHTML = '';
    startRenderWith = 0;

    filteredItems = items;
  }
}

function filterItems() {
  let filter = [];
  let filterLinkElements = filterWrapper.querySelectorAll('.filter__link');
  for (let filterLink of filterLinkElements) {
    let textContent = filterLink.textContent.trim();
    if (
      textContent !== 'All nations' ||
      textContent !== 'All types' ||
      textContent !== 'All tiers' ||
      textContent !== 'Show all vehicles'
    ) {
      filter.push(filterItemsHelper(textContent));
    }
  }

  filteredItems = items;
  if (filter[0]) {
    filteredItems = filteredItems.filter((item) => item.vehicle.nation === filter[0]);
  }
  if (filter[1]) {
    filteredItems = filteredItems.filter((item) => item.vehicle.type === filter[1]);
  }
  if (filter[2]) {
    filteredItems = filteredItems.filter((item) => item.vehicle.level === filter[2]);
  }

  let ul = container.querySelector('.list-item');
  if (ul) ul.innerHTML = '';
  startRenderWith = 0;
}

function hideSubfilterLists(list) {
  let subfilterLists = document.querySelectorAll('.sub-filter__list');

  for (let subfilterList of subfilterLists) {
    if (list && subfilterList === list) continue;
    subfilterList.style.display = 'none';
  }
}

function filterItemsHelper(str) {
  if (str === 'China') return 'china';
  if (str === 'Czech') return 'czech';
  if (str === 'France') return 'france';
  if (str === 'Germany') return 'germany';
  if (str === 'Japan') return 'japan';
  if (str === 'Poland') return 'poland';
  if (str === 'USSR') return 'sssr';
  if (str === 'Sweden') return 'sweden';
  if (str === 'U.K.') return 'uk';
  if (str === 'U.S.A.') return 'usa';

  if (str === 'Light tanks') return 'light';
  if (str === 'Medium tanks') return 'medium';
  if (str === 'Heavy tanks') return 'heavy';
  if (str === 'Tank DEstroyers') return 'at-spg';
  if (str === 'SPGs') return 'spg';

  if (str === 'I tier') return 1;
  if (str === 'II tier') return 2;
  if (str === 'III tier') return 3;
  if (str === 'IV tier') return 4;
  if (str === 'V tier') return 5;
  if (str === 'VI tier') return 6;
  if (str === 'VII tier') return 7;
  if (str === 'VIII tier') return 8;
  if (str === 'IX tier') return 9;
  if (str === 'X tier') return 10;
}
