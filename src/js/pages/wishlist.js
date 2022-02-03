import State from '../state';
import templates from '../templates';
import View from '../view';
import Header from './header';
import ShoppingCart from './shopping-cart';
import MainPage from './main-page';

let productsInWishlist = JSON.parse(sessionStorage.getItem('wishlist')) || [];

let $modalHeader = document.querySelector('#header-heading');
let $modalList = document.querySelector('#modal-list');
let $modalFooter = document.querySelector('#modal-footer');
let $closeModalButton = document.getElementById('close-modal');

export default {
  setCountInHeader() {
    Header.setWishlistCount(productsInWishlist.length);
  },
  hasProduct(id) {
    let product = productsInWishlist.find((product) => product.id === id);
    return product ? true : false;
  },
  saveToStorage() {
    sessionStorage.setItem('wishlist', JSON.stringify(productsInWishlist));
  },
  addProduct(id) {
    let productData = State.getProducts().find((product) => product.id === id);
    productsInWishlist.push(productData);
    this.saveToStorage();

    this.setCountInHeader();
  },
  deleteProduct(id) {
    productsInWishlist = productsInWishlist.filter((product) => id !== product.id);
    this.saveToStorage();

    this.setCountInHeader();
  },
  disablePurchaseButton(id) {
    let purchaseButton = $modalList.querySelector(`[data-product-id='${id}'] .purchase-button`);
    if (!purchaseButton) return;
    purchaseButton.setAttribute('disabled', 'true');
  },
  render() {
    // Clear list
    let $mock = $modalList.children[0];
    $modalList.innerHTML = '';
    $modalList.append($mock);

    // Hide modal footer if it is displayed
    !$modalFooter.classList.contains('modal__footer--closed')
      ? $modalFooter.classList.add('modal__footer--closed')
      : false;

    $modalHeader.textContent = 'Wishlist';

    $modalList.onclick = wishlistClickHandler.bind(this);

    let wishlistItemsHtml = '';
    for (let product of productsInWishlist) {
      wishlistItemsHtml += View.renderOne(templates.wishlistItem, product);
    }
    $modalList.innerHTML += wishlistItemsHtml;

    // if there is product in the cart disable purchase button
    for (let li of $modalList.children) {
      let productId = li.dataset.productId;

      if (!productId) continue;

      if (ShoppingCart.hasProduct(productId)) {
        li.querySelector('.purchase-button').setAttribute('disabled', 'true');
      }
    }
  },
};

function wishlistClickHandler(event) {
  // if the list is empty
  if (event.target === event.currentTarget) return;

  let role = event.target.dataset.role;
  let $wishlistItem = event.target.closest('li[data-product-id]');
  let productId = $wishlistItem.dataset.productId;

  switch (role) {
    case 'delete-wishlist-item':
      {
        this.deleteProduct(productId);
        MainPage.setEmptyHeart(productId);
        $wishlistItem.remove();
      }
      break;
    case 'purchase-wishlist-item':
      {
        ShoppingCart.addProduct(productId);
        MainPage.disablePurchaseButton(productId);
        this.disablePurchaseButton(productId);
      }
      break;
    case 'show-product':
      {
        let event = new Event('click');
        $closeModalButton.dispatchEvent(event);
      }
      break;
    default:
      break;
  }
}
