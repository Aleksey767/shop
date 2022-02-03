import Model from '../model';

let productId;
let editWindow = document.getElementById('edit-product-window');
let closeButton = document.getElementById('close-edit-form');
let form = document.getElementById('edit-product-form');
let errorArea = form.querySelector('.create-form-error');

closeButton.addEventListener('click', () => {
  editWindow.className = 'modal modal--fixed modal--close';
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  let editProductForm = document.getElementById('edit-product-form');

  let response = await Model.updateProduct(productId, new FormData(editProductForm));

  if (response.error) {
    errorArea.textContent = response.message;
    return;
  }

  location.reload();
});

form.deleteProduct.addEventListener('click', async () => {
  let result = confirm('do you want to delete a product?');
  if (result) {
    let response = await Model.deleteProduct(productId);

    if (response.error) {
      errorArea.textContent = response.message;
      return;
    }

    location.reload();
  }

  return;
});

export default {
  showEditProductWindow(id) {
    editWindow.className = 'modal modal--fixed';
    productId = id;
    editProduct();
  },
};

async function editProduct() {
  let { product, details } = await Model.getProduct(productId);

  form.name.value = product.name;

  for (let option of form.types.options) {
    if (product.types.includes(option.value)) {
      option.selected = true;
    }
  }

  form['vehicle.type'].value = product.vehicle.type;
  form['vehicle.nation'].value = product.vehicle.nation;
  form['vehicle.level'].value = product.vehicle.level;
  form.price.value = product.price;
  form.salePrice.value = product.salePrice;

  if (product.showDiscountAs === '%') {
    form.showDiscountAs[0].checked = true;
  } else {
    form.showDiscountAs[1].checked = true;
  }

  if (product.isCountable) {
    form.isCountable.checked = true;
  }

  form.priority.value = product.priority;
  form.details.value = details;
}
