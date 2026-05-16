// ── Guard ──────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const user = getUser();
  if (!user || user.role !== 'USER') { window.location.href = 'login.html'; return; }
  document.querySelectorAll('.sidebar-user-name').forEach(el => el.textContent = user.name);
  document.querySelectorAll('.sidebar-user-role').forEach(el => el.textContent = 'User Account');
  document.querySelectorAll('.welcome-name').forEach(el => el.textContent = user.name.split(' ')[0]);
  initTabs();
  loadVehicles();
  loadStats();
});

// ── Tabs ──────────────────────────────────────────────────────────────────
function initTabs() {
  document.querySelectorAll('.nav-item[data-tab]').forEach(item => {
    item.addEventListener('click', () => {
      const tab = item.dataset.tab;
      document.querySelectorAll('.nav-item[data-tab]').forEach(i => i.classList.remove('active'));
      document.querySelectorAll('.tab-pane').forEach(p => p.style.display = 'none');
      item.classList.add('active');
      const pane = document.getElementById(`tab-${tab}`);
      if (pane) pane.style.display = 'block';
      const titles = { vehicles:'My Vehicles', maintenance:'Maintenance Records', schedule:'Service Schedule' };
      document.getElementById('page-title').textContent = titles[tab] || 'Dashboard';
      if (tab === 'vehicles') loadVehicles();
      if (tab === 'maintenance') loadMaintenance();
      if (tab === 'schedule') loadSchedules();
    });
  });
  document.querySelector('.nav-item[data-tab="vehicles"]')?.classList.add('active');
}

// ── Stats ─────────────────────────────────────────────────────────────────
async function loadStats() {
  try {
    const [vehicles, maintenance, schedules] = await Promise.all([
      Vehicles.list(), Maintenance.list(), Schedules.list()
    ]);
    document.getElementById('stat-vehicles').textContent = vehicles.length;
    document.getElementById('stat-maintenance').textContent = maintenance.length;
    document.getElementById('stat-schedules').textContent = schedules.length;
    document.getElementById('stat-upcoming').textContent =
      schedules.filter(s => s.status === 'PENDING').length;
  } catch (e) { console.error(e); }
}

// ── VEHICLES ──────────────────────────────────────────────────────────────
let vehiclesList = [];
let editingVehicleId = null;

async function loadVehicles() {
  const grid = document.getElementById('vehicles-grid');
  if (!grid) return;
  grid.innerHTML = '<div class="empty-state"><i class="fas fa-spinner fa-spin"></i></div>';
  try {
    vehiclesList = await Vehicles.list();
    renderVehicles();
  } catch (e) { grid.innerHTML = `<div class="empty-state"><i class="fas fa-exclamation-triangle"></i><h3>Error loading vehicles</h3><p>${e.message}</p></div>`; }
}

function renderVehicles() {
  const grid = document.getElementById('vehicles-grid');
  if (!vehiclesList.length) {
    grid.innerHTML = `<div class="empty-state"><i class="fas fa-car"></i><h3>No Vehicles Added</h3><p>Add your first vehicle to get started</p></div>`;
    return;
  }
  const engineColors = { PETROL: 'petrol', DIESEL: 'diesel', HYBRID: 'hybrid' };
  const engineIcons  = { PETROL: '⛽', DIESEL: '🛢️', HYBRID: '⚡' };
  grid.innerHTML = vehiclesList.map(v => `
    <div class="data-card">
      <div class="data-card-header">
        <div>
          <div class="data-card-title">🚗 ${v.brand} ${v.model}</div>
          <div class="data-card-sub">${v.registrationNumber}</div>
        </div>
        <div class="data-card-actions">
          <button class="card-btn card-btn-edit" onclick="editVehicle('${v.id}')" title="Edit"><i class="fas fa-edit"></i></button>
          <button class="card-btn card-btn-delete" onclick="deleteVehicle('${v.id}')" title="Delete"><i class="fas fa-trash"></i></button>
        </div>
      </div>
      <div class="data-card-info">
        <div class="info-row"><i class="fas fa-calendar"></i><span>YOM: ${v.yearOfManufacture} &nbsp;|&nbsp; YOR: ${v.yearOfRegistration}</span></div>
        <div class="info-row"><i class="fas fa-tachometer-alt"></i><span>Mileage: ${v.mileage.toLocaleString()} km</span></div>
        <div class="info-row"><i class="fas fa-gas-pump"></i><span><span class="badge badge-${engineColors[v.engineType]}">${engineIcons[v.engineType]} ${v.engineType}</span></span></div>
      </div>
    </div>`).join('');
}

function openVehicleModal(vehicleId = null) {
  editingVehicleId = vehicleId;
  const v = vehicleId ? vehiclesList.find(x => x.id === vehicleId) : null;
  document.getElementById('vehicle-modal-title').textContent = vehicleId ? 'Edit Vehicle' : 'Add Vehicle';
  document.getElementById('v-reg').value         = v?.registrationNumber || '';
  document.getElementById('v-brand').value       = v?.brand || '';
  document.getElementById('v-model').value       = v?.model || '';
  document.getElementById('v-yom').value         = v?.yearOfManufacture || '';
  document.getElementById('v-yor').value         = v?.yearOfRegistration || '';
  document.getElementById('v-mileage').value     = v?.mileage || '';
  document.querySelectorAll('.engine-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.value === (v?.engineType || ''));
  });
  document.getElementById('vehicle-modal').classList.add('show');
}

function editVehicle(id) { openVehicleModal(id); }

document.querySelectorAll('.engine-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.engine-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

async function saveVehicle() {
  const reg = document.getElementById('v-reg').value.trim().toUpperCase();
  const engineType = document.querySelector('.engine-btn.active')?.dataset.value;
  if (!reg || !document.getElementById('v-brand').value || !engineType) {
    toast('Please fill all required fields', 'error'); return;
  }
  const regPattern = /^[A-Z]{2,3}\d{4}$/;
  if (!regPattern.test(reg)) {
    toast('Invalid registration (e.g. CAA0000 or KA0000)', 'error'); return;
  }
  const data = {
    registrationNumber: reg,
    brand: document.getElementById('v-brand').value.trim(),
    model: document.getElementById('v-model').value.trim(),
    yearOfManufacture: parseInt(document.getElementById('v-yom').value),
    yearOfRegistration: parseInt(document.getElementById('v-yor').value),
    engineType,
    mileage: parseFloat(document.getElementById('v-mileage').value) || 0
  };
  try {
    if (editingVehicleId) {
      await Vehicles.update(editingVehicleId, data);
      toast('Vehicle updated!');
    } else {
      await Vehicles.create(data);
      toast('Vehicle added!');
    }
    document.getElementById('vehicle-modal').classList.remove('show');
    loadVehicles(); loadStats();
  } catch (e) { toast(e.message, 'error'); }
}

async function deleteVehicle(id) {
  if (!confirm('Delete this vehicle?')) return;
  try { await Vehicles.delete(id); toast('Vehicle deleted', 'warning'); loadVehicles(); loadStats(); }
  catch (e) { toast(e.message, 'error'); }
}

// ── MAINTENANCE ───────────────────────────────────────────────────────────
let maintenanceList = [];
let editingMaintenanceId = null;

async function loadMaintenance() {
  const grid = document.getElementById('maintenance-grid');
  if (!grid) return;
  grid.innerHTML = '<div class="empty-state"><i class="fas fa-spinner fa-spin"></i></div>';
  try {
    maintenanceList = await Maintenance.list();
    const sel = document.getElementById('m-vehicle-filter');
    if (sel) {
      sel.innerHTML = '<option value="">All Vehicles</option>' +
        vehiclesList.map(v => `<option value="${v.id}">${v.brand} ${v.model} (${v.registrationNumber})</option>`).join('');
    }
    renderMaintenance();
  } catch (e) { grid.innerHTML = `<div class="empty-state"><i class="fas fa-exclamation-triangle"></i><h3>${e.message}</h3></div>`; }
}

function renderMaintenance(filter = '') {
  const grid = document.getElementById('maintenance-grid');
  let list = maintenanceList;
  if (filter) list = list.filter(m => m.vehicleId === filter);
  if (!list.length) {
    grid.innerHTML = `<div class="empty-state"><i class="fas fa-wrench"></i><h3>No Maintenance Records</h3><p>Log your first service record</p></div>`;
    return;
  }
  grid.innerHTML = list.map(m => {
    const v = vehiclesList.find(x => x.id === m.vehicleId);
    return `
    <div class="data-card">
      <div class="data-card-header">
        <div>
          <div class="data-card-title">🔧 ${m.serviceType}</div>
          <div class="data-card-sub">${v ? `${v.brand} ${v.model} (${v.registrationNumber})` : 'Unknown Vehicle'}</div>
        </div>
        <div class="data-card-actions">
          <button class="card-btn card-btn-edit" onclick="editMaintenance('${m.id}')"><i class="fas fa-edit"></i></button>
          <button class="card-btn card-btn-delete" onclick="deleteMaintenance('${m.id}')"><i class="fas fa-trash"></i></button>
        </div>
      </div>
      <div class="data-card-info">
        <div class="info-row"><i class="fas fa-calendar-check"></i><span>Service Date: ${m.serviceDate}</span></div>
        <div class="info-row"><i class="fas fa-tachometer-alt"></i><span>Current Mileage: ${m.currentMileage?.toLocaleString()} km</span></div>
        <div class="info-row"><i class="fas fa-calendar-plus"></i><span>Next Service: ${m.nextServiceDate || 'N/A'}</span></div>
        <div class="info-row"><i class="fas fa-road"></i><span>Next Mileage: ${m.nextServiceMileage?.toLocaleString() || 'N/A'} km</span></div>
        ${m.description ? `<div class="info-row"><i class="fas fa-sticky-note"></i><span>${m.description}</span></div>` : ''}
        <div class="info-row"><i class="fas fa-check-square"></i><span>${m.completed ? '✅ Completed' : '🕐 Pending'}</span></div>
      </div>
    </div>`;
  }).join('');
}

function openMaintenanceModal(id = null) {
  editingMaintenanceId = id;
  const m = id ? maintenanceList.find(x => x.id === id) : null;
  const vSel = document.getElementById('m-vehicle-id');
  vSel.innerHTML = '<option value="">-- Select Vehicle --</option>' +
    vehiclesList.map(v => `<option value="${v.id}" ${m?.vehicleId===v.id?'selected':''}>${v.brand} ${v.model} (${v.registrationNumber})</option>`).join('');
  document.getElementById('maintenance-modal-title').textContent = id ? 'Edit Maintenance' : 'Log Maintenance';
  document.getElementById('m-service-type').value   = m?.serviceType || '';
  document.getElementById('m-description').value   = m?.description || '';
  document.getElementById('m-service-date').value  = m?.serviceDate || '';
  document.getElementById('m-current-mileage').value = m?.currentMileage || '';
  document.getElementById('m-next-date').value     = m?.nextServiceDate || '';
  document.getElementById('m-next-mileage').value  = m?.nextServiceMileage || '';
  document.getElementById('m-completed').checked   = m?.completed || false;
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('m-service-date').min = today;
  document.getElementById('m-next-date').min = today;
  document.getElementById('maintenance-modal').classList.add('show');
}

function editMaintenance(id) { openMaintenanceModal(id); }

async function saveMaintenance() {
  const vehicleId = document.getElementById('m-vehicle-id').value;
  const serviceType = document.getElementById('m-service-type').value;
  const serviceDate = document.getElementById('m-service-date').value;
  if (!vehicleId || !serviceType || !serviceDate) {
    toast('Please fill all required fields', 'error'); return;
  }
  const data = {
    vehicleId,
    serviceType,
    description: document.getElementById('m-description').value,
    serviceDate,
    currentMileage: parseFloat(document.getElementById('m-current-mileage').value) || 0,
    nextServiceDate: document.getElementById('m-next-date').value || null,
    nextServiceMileage: parseFloat(document.getElementById('m-next-mileage').value) || 0,
    completed: document.getElementById('m-completed').checked
  };
  try {
    if (editingMaintenanceId) { await Maintenance.update(editingMaintenanceId, data); toast('Record updated!'); }
    else { await Maintenance.create(data); toast('Maintenance logged!'); }
    document.getElementById('maintenance-modal').classList.remove('show');
    loadMaintenance(); loadStats();
  } catch (e) { toast(e.message, 'error'); }
}

async function deleteMaintenance(id) {
  if (!confirm('Delete this record?')) return;
  try { await Maintenance.delete(id); toast('Deleted', 'warning'); loadMaintenance(); loadStats(); }
  catch (e) { toast(e.message, 'error'); }
}

// ── SCHEDULE ──────────────────────────────────────────────────────────────
let schedulesList = [];
let editingScheduleId = null;

async function loadSchedules() {
  const grid = document.getElementById('schedules-grid');
  if (!grid) return;
  grid.innerHTML = '<div class="empty-state"><i class="fas fa-spinner fa-spin"></i></div>';
  try {
    schedulesList = await Schedules.list();
    renderSchedules();
  } catch (e) { grid.innerHTML = `<div class="empty-state"><i class="fas fa-exclamation-triangle"></i><h3>${e.message}</h3></div>`; }
}

function renderSchedules() {
  const grid = document.getElementById('schedules-grid');
  if (!schedulesList.length) {
    grid.innerHTML = `<div class="empty-state"><i class="fas fa-calendar-alt"></i><h3>No Schedules</h3><p>Schedule a service appointment</p></div>`;
    return;
  }
  grid.innerHTML = schedulesList.map(s => {
    const v = vehiclesList.find(x => x.id === s.vehicleId);
    const statusColors = { PENDING: 'pending', CONFIRMED: 'confirmed', COMPLETED: 'completed', CANCELLED: 'cancelled' };
    return `
    <div class="data-card">
      <div class="data-card-header">
        <div>
          <div class="data-card-title">📅 ${s.serviceType}</div>
          <div class="data-card-sub">${v ? `${v.brand} ${v.model}` : 'Unknown Vehicle'}</div>
        </div>
        <div class="data-card-actions">
          <button class="card-btn card-btn-edit" onclick="editSchedule('${s.id}')"><i class="fas fa-edit"></i></button>
          <button class="card-btn card-btn-delete" onclick="deleteSchedule('${s.id}')"><i class="fas fa-trash"></i></button>
        </div>
      </div>
      <div class="data-card-info">
        <div class="info-row"><i class="fas fa-calendar"></i><span>${s.serviceDate} at ${s.serviceTime}</span></div>
        <div class="info-row"><i class="fas fa-car"></i><span>${v?.registrationNumber || 'N/A'}</span></div>
        <div class="info-row"><i class="fas fa-circle"></i><span><span class="badge badge-${statusColors[s.status]}">${s.status}</span></span></div>
      </div>
    </div>`;
  }).join('');
}

function openScheduleModal(id = null) {
  editingScheduleId = id;
  const s = id ? schedulesList.find(x => x.id === id) : null;
  const vSel = document.getElementById('s-vehicle-id');
  vSel.innerHTML = '<option value="">-- Select Vehicle --</option>' +
    vehiclesList.map(v => `<option value="${v.id}" ${s?.vehicleId===v.id?'selected':''}>${v.brand} ${v.model} (${v.registrationNumber})</option>`).join('');
  document.getElementById('schedule-modal-title').textContent = id ? 'Edit Schedule' : 'Book Service';
  document.getElementById('s-service-type').value = s?.serviceType || '';
  document.getElementById('s-service-date').value = s?.serviceDate || '';
  document.getElementById('s-service-time').value = s?.serviceTime || '';
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('s-service-date').min = today;
  document.getElementById('schedule-modal').classList.add('show');
}

function editSchedule(id) { openScheduleModal(id); }

async function saveSchedule() {
  const vehicleId    = document.getElementById('s-vehicle-id').value;
  const serviceType  = document.getElementById('s-service-type').value;
  const serviceDate  = document.getElementById('s-service-date').value;
  const serviceTime  = document.getElementById('s-service-time').value;
  if (!vehicleId || !serviceType || !serviceDate || !serviceTime) {
    toast('Please fill all required fields', 'error'); return;
  }
  const data = { vehicleId, serviceType, serviceDate, serviceTime };
  try {
    if (editingScheduleId) { await Schedules.update(editingScheduleId, data); toast('Schedule updated!'); }
    else { await Schedules.create(data); toast('Service booked!'); }
    document.getElementById('schedule-modal').classList.remove('show');
    loadSchedules(); loadStats();
  } catch (e) { toast(e.message, 'error'); }
}

async function deleteSchedule(id) {
  if (!confirm('Cancel this schedule?')) return;
  try { await Schedules.delete(id); toast('Schedule cancelled', 'warning'); loadSchedules(); loadStats(); }
  catch (e) { toast(e.message, 'error'); }
}

// Close modals
document.querySelectorAll('.modal-close, .btn-cancel').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('show'));
  });
});