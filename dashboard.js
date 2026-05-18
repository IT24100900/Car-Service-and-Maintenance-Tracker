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
