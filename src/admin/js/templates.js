import utils from './utils';
import State from './state';
import WishList from './pages/wishlist';
import ShopingCart from './pages/shopping-cart';

export default {
  cartItem(product) {
    let { price, salePrice, discount } = utils.getPrices(product, State.getSettings());

    return `<li class="modal__item" data-product-id="${product.id}">
              <article class="modal-item">
                <a href="/#product/${product.id}" class="modal-item__product-link">
                  <img
                    src="/products/${product.id}/image"
                    alt="${product.name}"
                    data-role="show-product"
                  />
                </a>
                <div class="modal-item__product-info">
                  ${
                    product.types.includes('vehicle')
                      ? `<p class="modal-item__vehicle-info">
                          <span class="flag flag--${product.vehicle.nation}"></span>
                          <span class="vehicle-type vehicle-type--${product.vehicle.type}"></span>
                          <span class="modal-item__vehicle-level">${utils.getRomanLevel(
                            product.vehicle.level
                          )}</span>
                        </p>`
                      : ''
                  }
                  <h3 class="modal-item__product-name">${product.name}</h3>
                  <div class="modal-item__prices">
                  ${
                    discount
                      ? `<span class="modal-item__price modal-item__price--old">${price}</span>
                      <span class="modal-item__discount">${discount}</span>
                      <span class="modal-item__price modal-item__price--final">${salePrice}</span>`
                      : `<span class="modal-item__price modal-item__price--final">${price}</span>`
                  }
                  </div>
                </div>
                <div class="modal-item__options">
                  <button class="options-button options-button--remove modal-item__button-remove" data-role="delete-cart-item"></button>
                  ${
                    product.isCountable
                      ? `<div class="modal-item__count-options">
                          <button class="options-button options-button--plus" data-role="plus-button"></button>
                          <span class="modal-item__count">${product.count}</span>
                          <button class="options-button options-button--minus" data-role="minus-button"></button>
                        </div>`
                      : ''
                  }
                </div>
              </article>
            </li>`;
  },
  wishlistItem(product) {
    let { price, salePrice, discount } = utils.getPrices(product, State.getSettings());

    return `<li class="modal__item" data-product-id="${product.id}">
    <article class="modal-item">
      <a href="/#product/${product.id}" class="modal-item__product-link">
        <img
          src="/products/${product.id}/image"
          alt="${product.name}"
          data-role="show-product"
        />
      </a>
      <div class="modal-item__product-info">
      ${
        product.types.includes('vehicle')
          ? `<p class="modal-item__vehicle-info">
          <span class="flag flag--${product.vehicle.nation}"></span>
          <span class="vehicle-type vehicle-type--${product.vehicle.type}"></span>
          <span class="modal-item__vehicle-level">${utils.getRomanLevel(
            product.vehicle.level
          )}</span>
        </p>`
          : ''
      }
        <h3 class="modal-item__product-name">${product.name}</h3>
        <div class="modal-item__prices">
        ${
          discount
            ? `<span class="modal-item__price modal-item__price--old">${price}</span>
            <span class="modal-item__discount">${discount}</span>
            <span class="modal-item__price modal-item__price--final">${salePrice}</span>`
            : `<span class="modal-item__price modal-item__price--final">${price}</span>`
        }
        </div>
      </div>
      <div class="modal-item__options">
        <button
          class="options-button options-button--remove"
          data-role="delete-wishlist-item"
        ></button>
        <button
          class="purchase-button modal-item__purchase-button"
          data-role="purchase-wishlist-item"
        >
          Purchase
        </button>
      </div>
    </article>
  </li>`;
  },
  listItem(product) {
    let { price, salePrice, discount } = utils.getPrices(product, State.getSettings());
    return `
      <li class='item' data-product-id=${product.id}>
        <a href='#product/${product.id}' class='item__link'>
          <div class='item__wrap'>
            <img class='item__img' src='/products/${product.id}/image' alt='${product.name}'>
            <div class='item__data'>
              <div class='item__name'>              
                ${
                  product.types.includes('vehicle')
                    ? `<span class='flag flag--${product.vehicle.nation}'></span>
                       <span class='vehicle-type vehicle-type--${product.vehicle.type}'></span>
                       <span class='item__level'>${utils.getRomanLevel(
                         product.vehicle.level
                       )}</span>`
                    : ''
                }
                <h3>${product.name}</h3>
              </div>
              <div class='item__price'>
                ${
                  discount
                    ? `<span class="modal-item__price modal-item__price--old">${price}</span>
                       <span class="modal-item__discount">${discount}</span>
                       <span class="modal-item__price modal-item__price--final">${salePrice}</span>`
                    : `<span class="modal-item__price modal-item__price--final">${price}</span>`
                }
              </div>
            </div>
          </div>
        </a>
        <div class='item__purchase'>
          <button ${
            ShopingCart.hasProduct(product.id) ? 'disabled' : ''
          } class='purchase-button'>Purchase</button>
        </div>
        <div class='item__wish'>
          <button class='heart ${
            WishList.hasProduct(product.id) ? 'heart--full' : 'heart--empty'
          }'></button>
        </div>
        <div class='edit-block'>
          <span class='edit-block__priority'>${product.priority}</span>
          <span class='edit-block__button'></span>
        </div>
      </li>
    `;
  },
  oneItem({ product, details }) {
    let { price, salePrice, discount } = utils.getPrices(product, State.getSettings());
    return `
      <div class='one-item' data-product-id=${product.id}>
        <div class='one-item__main'>
          <div class='one-item__data'>
            <h3 class='one-item__title'>${product.name}</h3>
            <hr>
            <div class='one-item__name'>
              ${
                product.types.includes('vehicle')
                  ? `<span class='flag flag--${product.vehicle.nation}'></span>
                     <span class='vehicle-type vehicle-type--${product.vehicle.type}'></span>
                     <span class='item__level'>${utils.getRomanLevel(product.vehicle.level)}</span>
                     <span>${product.name}</span>`
                  : ''
              }            
            </div>
            <div class='one-item__purchase-container'>
              <div class='one-item__price'>
                ${
                  discount
                    ? `<span class="modal-item__price modal-item__price--old">${price}</span>
                       <span class="modal-item__discount">${discount}</span>
                       <span class="modal-item__price modal-item__price--final">${salePrice}</span>`
                    : `<span class="modal-item__price modal-item__price--final">${price}</span>`
                }
              </div>
              <button ${
                ShopingCart.hasProduct(product.id) ? 'disabled' : ''
              } class='purchase-button'>Purchase</button>
            </div>
          </div>
          <div class='one-item__img-container'>
            <img class='one-item__img' src='/products/${product.id}/image'>            
          </div>
          <div class='item__wish'>
            <button class='heart ${
              WishList.hasProduct(product.id) ? 'heart--full' : 'heart--empty'
            }'></button>
          </div>
          <div class='edit-block'>
            <span class='edit-block__priority'>${product.priority}</span>
            <span class='edit-block__button'></span>
          </div>
        </div>
        <div class='one-item__details'>
          <h4>Details</h4>
          <hr>
          <p>${details}</p>
        </div>
      </div>
    `;
  },
};
