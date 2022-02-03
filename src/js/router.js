import Controller from './controller';

function handleHash(event) {
  let hash = event.target.location.hash;

  if (hash === '#all') Controller.allRoute();
  if (hash === '#vehicles') Controller.vehiclesRoute();
  if (hash === '#gold') Controller.goldRoute();
  if (hash === '#premium_account') Controller.premiumRoute();
  if (hash === '#stuff') Controller.stuffRoute();
  if (hash.startsWith('#product/')) {
    Controller.productRoute(hash.slice(9));
  }
}

export default {
  init() {
    window.addEventListener('hashchange', handleHash);
    if (window.location.hash === '#all') {
      let event = new Event('hashchange');
      window.dispatchEvent(event);
    } else {
      window.location.hash = '#all';
    }
  },
};
