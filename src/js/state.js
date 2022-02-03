let products = [];
let settings = {
  currency: 'USD',
  exchangeRate: 1,
};

export default {
  setProducts(items) {
    products = products.concat(items);
  },
  getProducts() {
    return products;
  },
  setSettings(obj) {
    settings = obj;
  },
  getSettings() {
    return settings;
  },
};
