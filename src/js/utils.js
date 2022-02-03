export default {
  getRomanLevel(level) {
    switch (level) {
      case 1:
        return 'I';
      case 2:
        return 'II';
      case 3:
        return 'III';
      case 4:
        return 'IV';
      case 5:
        return 'V';
      case 6:
        return 'VI';
      case 7:
        return 'VII';
      case 8:
        return 'VIII';
      case 9:
        return 'IX';
      case 10:
        return 'X';
    }
  },
  convertPrice(usdPrice, rate) {
    return Math.floor(usdPrice * rate * 100) / 100;
  },
  calcDiscount(price, salePrice, showDiscountAs) {
    if (showDiscountAs === 'money') {
      return Math.round((price - salePrice) * 100) / 100;
    } else {
      return Math.trunc(((price - salePrice) * 100) / price);
    }
  },
  getPrices({ price, salePrice, showDiscountAs }, settings) {
    let convertedPrice = this.convertPrice(price, settings.exchangeRate);
    let convertedSalePrice = this.convertPrice(salePrice, settings.exchangeRate);

    if (!salePrice) {
      return {
        price: +convertedPrice.toFixed(2) + ` ${settings.currency}`,
        salePrice: 0,
        discount: 0,
      };
    }

    let discount = this.calcDiscount(convertedPrice, convertedSalePrice, showDiscountAs);

    return {
      price: +convertedPrice.toFixed(2) + ` ${settings.currency}`,
      salePrice: +convertedSalePrice.toFixed(2) + ` ${settings.currency}`,
      discount:
        +discount.toFixed(2) + (showDiscountAs === 'money' ? ` ${settings.currency}` : ' %'),
    };
  },
};
