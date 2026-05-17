const API_BASE = 'http://localhost:8080/api';

function getToken() { return localStorage.getItem('at_token'); }
function getUser()  { 
  try { return JSON.parse(localStorage.getItem('at_user')); } 
  catch { return null; } 
}
function isAdmin()  { const u = getUser(); return u && u.role === 'ADMIN'; }
function isLoggedIn(){ return !!getToken(); }

function authHeader() {
  const token = getToken();
  return token ? { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
}

async function apiFetch(path, method = 'GET', body = null, auth = true) {
  const opts = { method, headers: auth ? authHeader() : { 'Content-Type': 'application/json' } };
  if (body) opts.body = JSON.stringify(body);
  try {
    const res = await fetch(API_BASE + path, opts);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
    return data;
  } catch (e) {
    throw e;
  }
}

// Auth
const Auth = {
  signup: (data) => apiFetch('/auth/signup', 'POST', data, false),
  login:  (data) => apiFetch('/auth/login',  'POST', data, false),
  saveSession(data) {
    localStorage.setItem('at_token', data.token);
    localStorage.setItem('at_user', JSON.stringify({ id: data.userId, name: data.name, email: data.email, role: data.role }));
  },
  logout() {
    localStorage.removeItem('at_token');
    localStorage.removeItem('at_user');
    window.location.href = 'index.html';
  }
};

// Vehicles
const Vehicles = {
  list:   ()           => apiFetch('/vehicles'),
  create: (data)       => apiFetch('/vehicles', 'POST', data),
  update: (id, data)   => apiFetch(`/vehicles/${id}`, 'PUT', data),
  delete: (id)         => apiFetch(`/vehicles/${id}`, 'DELETE'),
};

// Maintenance
const Maintenance = {
  list:   ()           => apiFetch('/maintenance'),
  create: (data)       => apiFetch('/maintenance', 'POST', data),
  update: (id, data)   => apiFetch(`/maintenance/${id}`, 'PUT', data),
  delete: (id)         => apiFetch(`/maintenance/${id}`, 'DELETE'),
};

// Schedules
const Schedules = {
  list:   ()           => apiFetch('/schedules'),
  create: (data)       => apiFetch('/schedules', 'POST', data),
  update: (id, data)   => apiFetch(`/schedules/${id}`, 'PUT', data),
  delete: (id)         => apiFetch(`/schedules/${id}`, 'DELETE'),
};

// Services
const Services = {
  list:   ()           => apiFetch('/services', 'GET', null, false),
  create: (data)       => apiFetch('/services', 'POST', data),
  update: (id, data)   => apiFetch(`/services/${id}`, 'PUT', data),
  delete: (id)         => apiFetch(`/services/${id}`, 'DELETE'),
};

// Shop
const Shop = {
  list:   ()           => apiFetch('/shop', 'GET', null, false),
  create: (data)       => apiFetch('/shop', 'POST', data),
  update: (id, data)   => apiFetch(`/shop/${id}`, 'PUT', data),
  delete: (id)         => apiFetch(`/shop/${id}`, 'DELETE'),
};

// Admin
const Admin = {
  vehicles:      () => apiFetch('/admin/vehicles'),
  maintenance:   () => apiFetch('/admin/maintenance'),
  schedules:     () => apiFetch('/admin/schedules'),
  todaySchedules:() => apiFetch('/admin/schedules/today'),
  users:         () => apiFetch('/admin/users'),
  sendReminder:  (data) => apiFetch('/admin/send-reminder', 'POST', data),
};

// Toast
function toast(msg, type = 'success') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const t = document.createElement('div');
  const icons = { success: 'fa-check-circle', error: 'fa-times-circle', info: 'fa-info-circle', warning: 'fa-exclamation-circle' };
  t.className = `toast ${type}`;
  t.innerHTML = `<i class="fas ${icons[type] || icons.info}"></i> ${msg}`;
  container.appendChild(t);
  requestAnimationFrame(() => { requestAnimationFrame(() => t.classList.add('show')); });
  setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 400); }, 3500);
}

// Nav auth update
function updateNavAuth() {
  const user = getUser();
  const authArea = document.getElementById('nav-auth');
  if (!authArea) return;
  if (user) {
    authArea.innerHTML = `
      <div class="user-menu">
        <div class="user-avatar" onclick="toggleDropdown()">${user.name.charAt(0).toUpperCase()}</div>
        <div class="user-dropdown" id="user-dropdown">
          <a href="${user.role === 'ADMIN' ? 'admin-dashboard.html' : 'dashboard.html'}"><i class="fas fa-tachometer-alt"></i> Dashboard</a>
          <hr>
          <button onclick="Auth.logout()"><i class="fas fa-sign-out-alt"></i> Logout</button>
        </div>
      </div>`;
  } else {
    authArea.innerHTML = `
      <button class="btn-login" onclick="window.location.href='login.html'">Login</button>
      <button class="btn-signup" onclick="window.location.href='signup.html'">Sign Up</button>`;
  }
}

function toggleDropdown() {
  document.getElementById('user-dropdown')?.classList.toggle('show');
}

document.addEventListener('click', (e) => {
  if (!e.target.closest('.user-menu')) {
    document.getElementById('user-dropdown')?.classList.remove('show');
  }
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
  const nav = document.querySelector('.navbar');
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 50);
});

// Hamburger
function initHamburger() {
  const ham = document.querySelector('.hamburger');
  const links = document.querySelector('.nav-links');
  const authEl = document.querySelector('.nav-auth');
  if (ham) {
    ham.addEventListener('click', () => {
      links?.classList.toggle('open');
      authEl?.classList.toggle('open');
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  updateNavAuth();
  initHamburger();
});
