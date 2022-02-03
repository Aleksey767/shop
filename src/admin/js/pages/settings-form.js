import Model from '../model';

let $settingsForm = document.getElementById('settings-form');
let $errorArea = $settingsForm.querySelector('.settings-form-error');
let $settingsWindow = document.getElementById('settings-window');
let $closeSettingButton = document.getElementById('close-settings-form');
let $editSettingsButton = document.getElementById('edit-settings');

$settingsForm.onsubmit = async (e) => {
  e.preventDefault();

  let $formRate = document.getElementById('form-rate');
  let $formCurrency = document.getElementById('form-currency');

  let body = {
    exchangeRate: parseFloat($formRate.value),
    currency: $formCurrency.value,
  };

  let response = await Model.updateSettings(body);

  if (response.error) {
    $errorArea.textContent = response.message;
    return;
  }

  location.reload();
};

$closeSettingButton.addEventListener('click', (e) => {
  $settingsWindow.classList.add('modal--close');
});

$editSettingsButton.addEventListener('click', (e) => {
  $settingsWindow.classList.remove('modal--close');
});
