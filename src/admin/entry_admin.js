import './styles/entry_admin.scss';
import Model from './js/model';

let $loginForm = document.getElementById('login-form');
let $errorArea = $loginForm.querySelector('.login-form__error');

$loginForm.onsubmit = async (e) => {
  e.preventDefault();

  let response = await Model.login(new FormData($loginForm));

  if (response.error) {
    $errorArea.textContent = response.message;
    return;
  }

  localStorage.setItem('access_token', response.token);
  location.pathname = '/admin';
};
