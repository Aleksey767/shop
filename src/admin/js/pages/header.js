export default {
  setWishlistCount(count) {
    let $headerWishlistCount = document.getElementById('header-wishlist-count');
    $headerWishlistCount.innerHTML = count ? `(${count})` : '';
  },
  setCartCount(count) {
    let $headerCartCount = document.getElementById('header-cart-count');
    $headerCartCount.innerHTML = count ? `(${count})` : '';
  },
};
