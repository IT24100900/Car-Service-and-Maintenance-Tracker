const SERVICE_ICONS = {
  'Preventive Maintenance': '🔧',
  'Auto Detailing & Care':  '✨',
  'Mechanical Services':    '⚙️',
  'Electrical Diagnostics': '⚡',
  'Body & Paint Services':  '🎨'
};

let allServices = [];
let editingServiceId = null;
let activeCategory = 'All';

document.addEventListener('DOMContentLoaded', async () => {
  await loadServices();
  const user = getUser();
  if (user && user.role === 'ADMIN') {
    document.getElementById('admin-add-btn')?.style.setProperty('display','flex');
  }
});

async function loadServices() {
  const container = document.getElementById('services-list');
  if (!container) return;
  container.innerHTML = '<div style="text-align:center;padding:40px;color:var(--text-light)"><i class="fas fa-spinner fa-spin fa-2x"></i></div>';
  try {
    allServices = await Services.list();
    renderServices();
  } catch (e) {
    container.innerHTML = `<div style="text-align:center;padding:40px;color:var(--danger)"><i class="fas fa-exclamation-circle fa-2x"></i><p style="margin-top:12px">${e.message}</p></div>`;
  }
}

function renderServices() {
  const container = document.getElementById('services-list');
  let list = activeCategory === 'All' ? allServices : allServices.filter(s => s.category === activeCategory);
  const user = getUser();
  if (!list.length) {
    container.innerHTML = `<div style="text-align:center;padding:40px;color:var(--text-light)"><i class="fas fa-tools fa-2x"></i><p style="margin-top:12px">No services found</p></div>`;
    return;
  }
  container.innerHTML = list.map(s => `
    <div class="service-list-card" data-id="${s.id}">
      <div class="service-list-header">
        <div class="service-list-icon">${SERVICE_ICONS[s.category] || '🔩'}</div>
        <div>
          <h3>${s.name}</h3>
          <small>${s.category}</small>
        </div>
      </div>
      <div class="service-list-body">
        <p>${s.description}</p>
        <div class="service-meta">
          <span class="service-price">Rs. ${s.price?.toLocaleString()}</span>
          <span class="service-duration"><i class="fas fa-clock"></i> ${s.duration}</span>
        </div>
        ${user?.role === 'ADMIN' ? `
        <div class="admin-actions">
          <button class="btn-edit" onclick="openServiceModal('${s.id}')"><i class="fas fa-edit"></i> Edit</button>
          <button class="btn-delete" onclick="deleteService('${s.id}')"><i class="fas fa-trash"></i> Delete</button>
        </div>` : ''}
      </div>
    </div>`).join('');
}

function filterByCategory(cat) {
  activeCategory = cat;
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.cat === cat));
  renderServices();
}

function openServiceModal(id = null) {
  editingServiceId = id;
  const s = id ? allServices.find(x => x.id === id) : null;
  document.getElementById('svc-modal-title').textContent = id ? 'Edit Service' : 'Add Service';
  document.getElementById('svc-name').value        = s?.name || '';
  document.getElementById('svc-category').value    = s?.category || '';
  document.getElementById('svc-price').value       = s?.price || '';
  document.getElementById('svc-duration').value    = s?.duration || '';
  document.getElementById('svc-description').value = s?.description || '';
  document.getElementById('service-modal').classList.add('show');
}

async function saveService() {
  const name = document.getElementById('svc-name').value.trim();
  const category = document.getElementById('svc-category').value;
  if (!name || !category) { toast('Name and category are required', 'error'); return; }
  const data = {
    name, category,
    price: parseFloat(document.getElementById('svc-price').value) || 0,
    duration: document.getElementById('svc-duration').value.trim(),
    description: document.getElementById('svc-description').value.trim(),
    active: true
  };
  try {
    if (editingServiceId) { await Services.update(editingServiceId, data); toast('Service updated!'); }
    else { await Services.create(data); toast('Service added!'); }
    document.getElementById('service-modal').classList.remove('show');
    loadServices();
  } catch (e) { toast(e.message, 'error'); }
}

async function deleteService(id) {
  if (!confirm('Delete this service?')) return;
  try { await Services.delete(id); toast('Service deleted', 'warning'); loadServices(); }
  catch (e) { toast(e.message, 'error'); }
}

document.querySelectorAll('.modal-close, .btn-cancel').forEach(b => {
  b.addEventListener('click', () => document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('show')));
});

