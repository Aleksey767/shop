import templates from '../templates';
import utils from '../utils';
import View from '../view';
import Header from './header';
import State from '../state';
import MainPage from './main-page';
import Wishlist from './wishlist';

let productsInCart = JSON.parse(sessionStorage.getItem('cart')) || [];

let $closeModalButton = document.getElementById('close-modal');

export default {
  setCountInHeader() {
    Header.setCartCount(productsInCart.length);
  },
  hasProduct(id) {
    let product = productsInCart.find((product) => product.id === id);
    return product ? true : false;
  },
  saveToStorage() {
    sessionStorage.setItem('cart', JSON.stringify(productsInCart));
  },
  addProduct(id) {
    let productData = State.getProducts().find((product) => product.id === id);
    productsInCart.push({ ...productData, count: 1 });
    this.saveToStorage();

    this.setCountInHeader();
  },
  deleteProduct(id) {
    productsInCart = productsInCart.filter((product) => product.id !== id);
    this.saveToStorage();

    this.setCountInHeader();
  },
  increaseCount(id) {
    let product = productsInCart.find((product) => product.id === id);
    product.count++;
    this.saveToStorage();
  },
  decreaseCount(id) {
    let product = productsInCart.find((product) => product.id === id);

    if (product.count === 1) {
      return;
    }

    product.count--;
    this.saveToStorage();
  },
  render() {
    let $modalHeader = document.querySelector('#header-heading');
    let $modalList = document.querySelector('#modal-list');
    let $modalFooter = document.querySelector('#modal-footer');

    // Clear list
    let $mock = $modalList.children[0];
    $modalList.innerHTML = '';
    $modalList.append($mock);

    // Open modal footer to show summary details
    $modalFooter.classList.contains('modal__footer--closed')
      ? $modalFooter.classList.remove('modal__footer--closed')
      : false;

    $modalHeader.textContent = 'Shopping cart';

    $modalList.onclick = cartClickHandler.bind(this);

    let cartItemsHtml = '';
    for (let product of productsInCart) {
      cartItemsHtml += View.renderOne(templates.cartItem, product);
    }
    $modalList.innerHTML += cartItemsHtml;

    this.showSummary();
  },
  showSummary() {
    let $totalOldPrice = document.querySelector('#total-old-price');
    let $totalDiscount = document.querySelector('#total-discount');
    let $totalFinalPrice = document.querySelector('#total-final-price');

    // Clear current values
    $totalOldPrice.innerHTML = '';
    $totalDiscount.innerHTML = '';
    $totalFinalPrice.innerHTML = '';

    // Calculate summary of the cart.
    let totalOldPrice = 0;
    let totalDiscount = 0;
    let totalFinalPrice = 0;

    productsInCart.forEach((product) => {
      let price = utils.convertPrice(
        product.price * product.count,
        State.getSettings().exchangeRate
      );
      let salePrice = utils.convertPrice(
        product.salePrice * product.count,
        State.getSettings().exchangeRate
      );

      if (salePrice) {
        totalOldPrice += price;
        totalFinalPrice += salePrice;
        totalDiscount += utils.calcDiscount(price, salePrice, 'money');
      } else {
        totalOldPrice += price;
        // add old price to final if salePrice === 0
        totalFinalPrice += price;
      }
    });

    if (totalOldPrice === totalFinalPrice) {
      $totalFinalPrice.innerHTML = `<span class="cart__total-price cart__total-price--final">
      ${+totalFinalPrice.toFixed(2)} ${State.getSettings().currency}
      </span>`;
    } else {
      $totalOldPrice.innerHTML = `Price: <span class="cart__price cart__total-price--old">
      ${+totalOldPrice.toFixed(2)} ${State.getSettings().currency}
      </span>`;
      $totalDiscount.innerHTML = `Total discount: <span class="cart__total-discount">
      ${+totalDiscount.toFixed(2)} ${State.getSettings().currency}
      </span>`;
      $totalFinalPrice.innerHTML = `<span class="cart__total-price cart__total-price--final">
      ${+totalFinalPrice.toFixed(2)} ${State.getSettings().currency}
      </span>`;
    }
  },
};

function cartClickHandler(event) {
  // if the list is empty
  if (event.target === event.currentTarget) return;

  let role = event.target.dataset.role;
  let $cartItem = event.target.closest('li[data-product-id]');
  let productId = $cartItem.dataset.productId;

  switch (role) {
    case 'plus-button':
      {
        this.increaseCount(productId);
        let $countNode = event.target.nextElementSibling;
        let currentCount = parseInt($countNode.innerHTML);
        $countNode.innerHTML = currentCount + 1;
        this.showSummary();
      }
      break;
    case 'minus-button':
      {
        this.decreaseCount(productId);
        let $countNode = event.target.previousElementSibling;
        let currentCount = parseInt($countNode.innerHTML);

        if (currentCount === 1) return;

        $countNode.innerHTML = currentCount - 1;
        this.showSummary();
      }
      break;
    case 'delete-cart-item':
      {
        this.deleteProduct(productId);
        MainPage.enablePurchaseButton(productId);
        $cartItem.remove();
        this.showSummary();
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
