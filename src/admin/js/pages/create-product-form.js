import Model from '../model';

let $createProductForm = document.getElementById('create-product-form');
let $errorArea = $createProductForm.querySelector('.create-form-error');
let $createProductWindow = document.getElementById('create-product-window');
let $closeCreateFormButton = document.getElementById('close-create-form');
let $createProductButton = document.getElementById('create-product');

$createProductForm.onsubmit = async (e) => {
  e.preventDefault();

  let $createProductForm = document.getElementById('create-product-form');

  let response = await Model.createProduct(new FormData($createProductForm));

  if (response.error) {
    $errorArea.textContent = response.message;
    return;
  }

  location.reload();
};

$closeCreateFormButton.addEventListener('click', (e) => {
  $createProductWindow.classList.add('modal--close');
});

$createProductButton.addEventListener('click', (e) => {
  $createProductWindow.classList.remove('modal--close');
});
