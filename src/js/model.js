export default {
  async callApi(method, url, body = {}, headers = {}) {
    if (!(body instanceof FormData)) {
      body = JSON.stringify(body);
      headers = { ...headers, ['Content-Type']: 'application/json' };
    }

    headers = { ...headers, Authorization: localStorage.getItem('access_token') };

    try {
      let response;

      if (method !== 'GET' && method !== 'DELETE') {
        response = await fetch(url, {
          method,
          headers,
          body,
        });
      } else {
        response = await fetch(url, {
          method,
          headers,
        });
      }

      if (response.ok) {
        return await response.json();
      } else if (response.status >= 400 && response.status < 500) {
        let message = await response.text();
        return { error: true, message };
      } else {
        let message = await response.text();
        console.log(message);
        return { error: true, message: 'Server error.' };
      }
    } catch (error) {
      console.log(error);
    }
  },
  createSettings(body) {
    return this.callApi('GET', '/settings', body);
  },
  getSettings() {
    return this.callApi('GET', '/settings');
  },
  updateSettings(body) {
    return this.callApi('GET', '/settings', body);
  },
  createProduct(body) {
    return this.callApi('POST', '/products', body);
  },
  getProducts(skip = 0) {
    return this.callApi('GET', `/products?limit=50&skip=${skip}`);
  },
  getProduct(id) {
    return this.callApi('GET', `/products/${id}`);
  },
  updateProduct(id, body) {
    return this.callApi('PATCH', `/products/${id}`, body);
  },
  deleteProduct(id) {
    return this.callApi('DELETE', `/products/${id}`);
  },
  createuser(body) {
    return this.callApi('POST', '/users', body);
  },
  login(body) {
    return this.callApi('POST', '/users/login', body);
  },
  logout() {
    return this.callApi('POST', '/users/logout');
  },
  logoutAll() {
    return this.callApi('POST', '/users/logoutAll');
  },
  me() {
    return this.callApi('GET', '/users/me');
  },
  updateUser(body) {
    return this.callApi('PATCH', `/users/me`, body);
  },
  deleteUser() {
    return this.callApi('DELETE', `/users/me`);
  },
};
