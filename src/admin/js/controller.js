import Model from './model';
import State from './state';
import MainPage from './pages/main-page';

let skipProducts = 0;
let allProductsCount;
let loader = document.querySelector('.loader');

export default {
  async fetchProducts() {
    loader.style.display = 'block';

    let skip = skipProducts;
    skipProducts += 50;
    let products = await Model.getProducts(skip);

    State.setProducts(products);

    loader.style.display = 'none';
  },

  async fetchSettings() {
    let { settings, productsCount } = await Model.getSettings();
    State.setSettings(settings[0]);
    allProductsCount = productsCount;

    return settings[0];
  },

  async allRoute() {
    if (State.getProducts().length === 0) await this.fetchProducts();
    MainPage.setData(State.getProducts());
  },

  async vehiclesRoute() {
    if (State.getProducts().length === 0) await this.fetchProducts();
    let vehicles = State.getProducts().filter((item) => item.types.includes('vehicle'));
    MainPage.setData(vehicles);
  },

  async goldRoute() {
    if (State.getProducts().length === 0) await this.fetchProducts();
    let gold = State.getProducts().filter((item) => item.types.includes('gold'));
    MainPage.setData(gold);
  },

  async premiumRoute() {
    if (State.getProducts().length === 0) await this.fetchProducts();
    let premium = State.getProducts().filter((item) => item.types.includes('premium_account'));
    MainPage.setData(premium);
  },

  async stuffRoute() {
    if (State.getProducts().length === 0) await this.fetchProducts();
    let stuff = State.getProducts().filter((item) => item.types.includes('stuff'));
    MainPage.setData(stuff);
  },

  async productRoute(id) {
    let product = await Model.getProduct(id);
    MainPage.setData(product);
  },

  async addProducts(route) {
    if (skipProducts >= allProductsCount) return;
    await this.fetchProducts();

    let products = State.getProducts();

    if (route !== 'all') {
      if (route === 'vehicles') route = 'vehicle';
      products = products.filter((item) => item.types.includes(route));
    }

    MainPage.setData(products);
  },
};
