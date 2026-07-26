/* ============================================================
   DRIVEMATE — API client
   Talks to the Express backend in /backend (default: localhost:4000)
   Falls back to no-op / console logging if the backend isn't running,
   so the frontend still works as a static preview.
   ============================================================ */
const DRIVEMATE_API_BASE = window.DRIVEMATE_API_BASE || 'http://localhost:4000/api';

async function apiRequest(path, options = {}) {
  const token = localStorage.getItem('drivemate_token');
  const headers = Object.assign(
    { 'Content-Type': 'application/json' },
    token ? { Authorization: `Bearer ${token}` } : {},
    options.headers || {}
  );
  try {
    const res = await fetch(`${DRIVEMATE_API_BASE}${path}`, { ...options, headers });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || `Request failed (${res.status})`);
    return data;
  } catch (err) {
    console.warn(`[DriveMate API] ${path} unreachable — is the backend running on ${DRIVEMATE_API_BASE}?`, err.message);
    throw err;
  }
}

const DriveMateAPI = {
  // ---- Catalog ----
  getServices: (category) => apiRequest(`/services${category ? `?category=${category}` : ''}`),
  getVehicleBrands: (type) => apiRequest(`/vehicles/brands${type ? `?type=${type}` : ''}`),
  getOffers: () => apiRequest('/offers'),

  // ---- Auth ----
  signup: (payload) => apiRequest('/auth/signup', { method: 'POST', body: JSON.stringify(payload) }),
  login: (payload) => apiRequest('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),

  // ---- Cart & bookings ----
  getCart: () => apiRequest('/cart'),
  addToCart: (item) => apiRequest('/cart', { method: 'POST', body: JSON.stringify(item) }),
  removeFromCart: (itemId) => apiRequest(`/cart/${itemId}`, { method: 'DELETE' }),
  checkout: (payload) => apiRequest('/bookings', { method: 'POST', body: JSON.stringify(payload) }),
};

// ---- Wire up login / signup forms if present on the page ----
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.querySelector('#panel-login form');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const phone = document.getElementById('login-phone').value;
      const password = document.getElementById('login-pass').value;
      try {
        const data = await DriveMateAPI.login({ phone, password });
        localStorage.setItem('drivemate_token', data.token);
        window.location.href = 'cart.html';
      } catch {
        alert('Could not log in. Make sure the DriveMate backend is running, then try again.');
      }
    });
  }

  const signupForm = document.querySelector('#panel-signup form');
  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const payload = {
        name: document.getElementById('su-name').value,
        phone: document.getElementById('su-phone').value,
        email: document.getElementById('su-email').value,
        password: document.getElementById('su-pass').value,
      };
      try {
        const data = await DriveMateAPI.signup(payload);
        localStorage.setItem('drivemate_token', data.token);
        window.location.href = 'cart.html';
      } catch {
        alert('Could not create your account. Make sure the DriveMate backend is running, then try again.');
      }
    });
  }
});
