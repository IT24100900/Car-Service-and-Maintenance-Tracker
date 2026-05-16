document.addEventListener('DOMContentLoaded', () => {
  const user = getUser();
  if (!user || user.role !== 'ADMIN') { window.location.href = 'login.html'; return; }
  document.querySelectorAll('.sidebar-user-name').forEach(el => el.textContent = user.name);
  document.querySelectorAll('.sidebar-user-role').forEach(el => el.textContent = 'Administrator');
  initAdminTabs();
  loadAdminStats();
  loadTodaySchedules();
});

function initAdminTabs() {
  document.querySelectorAll('.nav-item[data-tab]').forEach(item => {
    item.addEventListener('click', () => {
      document.querySelectorAll('.nav-item[data-tab]').forEach(i => i.classList.remove('active'));
      document.querySelectorAll('.tab-pane').forEach(p => p.style.display = 'none');
      item.classList.add('active');
      const tab = item.dataset.tab;
      const pane = document.getElementById(`tab-${tab}`);
      if (pane) pane.style.display = 'block';
      const titles = { overview:'Dashboard Overview', vehicles:'All Vehicles', maintenance:'All Maintenance', schedules:'All Schedules', users:'All Users' };
      document.getElementById('page-title').textContent = titles[tab] || 'Admin';
      if (tab === 'vehicles') loadAdminVehicles();
      if (tab === 'maintenance') loadAdminMaintenance();
      if (tab === 'schedules') loadAdminSchedules();
      if (tab === 'users') loadAdminUsers();
    });
  });
}

async function loadAdminStats() {
  try {
    const [vehicles, maintenance, schedules, users] = await Promise.all([
      Admin.vehicles(), Admin.maintenance(), Admin.schedules(), Admin.users()
    ]);
    document.getElementById('stat-total-vehicles').textContent   = vehicles.length;
    document.getElementById('stat-total-maintenance').textContent = maintenance.length;
    document.getElementById('stat-total-schedules').textContent  = schedules.length;
    document.getElementById('stat-total-users').textContent      = users.filter(u => u.role === 'USER').length;
  } catch (e) { console.error(e); }
}

// ── TODAY'S SCHEDULES ─────────────────────────────────────────────────────
let allUsersList = [];
let allVehiclesList = [];

async function loadTodaySchedules() {
  try {
    const [today, users, vehicles] = await Promise.all([
      Admin.todaySchedules(), Admin.users(), Admin.vehicles()
    ]);
    allUsersList = users;
    allVehiclesList = vehicles;
    const container = document.getElementById('today-schedules');
    if (!container) return;
    if (!today.length) {
      container.innerHTML = `<div class="empty-state"><i class="fas fa-calendar-check"></i><h3>No Services Today</h3><p>All clear for today</p></div>`;
      return;
    }
    container.innerHTML = today.map(s => {
      const user = users.find(u => u.id === s.userId);
      const vehicle = vehicles.find(v => v.id === s.vehicleId);
      return `
      <div class="schedule-row">
        <div class="schedule-info">
          <strong>${user?.name || 'Unknown'} — ${s.serviceType}</strong>
          <small>${vehicle ? `${vehicle.brand} ${vehicle.model} (${vehicle.registrationNumber})` : 'N/A'} · ${s.serviceTime}</small>
        </div>
        <button class="btn-remind" onclick="sendReminder('${s.id}', '${user?.email || ''}', '${user?.name || ''}', '${s.serviceType}', '${s.serviceDate}', '${s.serviceTime}')">
          <i class="fas fa-envelope"></i> Send Reminder
        </button>
      </div>`;
    }).join('');
  } catch (e) { console.error(e); }
}

async function sendReminder(scheduleId, email, name, serviceType, date, time) {
  if (!email) { toast('No email found for this user', 'error'); return; }
  const subject = `Service Reminder - AutoTrack`;
  const body = `Dear ${name},\n\nThis is a reminder that you have a ${serviceType} service appointment scheduled for ${date} at ${time}.\n\nPlease arrive 10 minutes early.\n\nThank you,\nAutoTrack Team`;
  try {
    await Admin.sendReminder({ to: email, subject, body, scheduleId });
    toast(`Reminder sent to ${email}!`, 'success');
  } catch (e) { toast(e.message, 'error'); }
}

// ── VEHICLES ──────────────────────────────────────────────────────────────
async function loadAdminVehicles() {
  const tbody = document.getElementById('admin-vehicles-tbody');
  if (!tbody) return;
  tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:20px;color:rgba(255,255,255,0.4)"><i class="fas fa-spinner fa-spin"></i> Loading...</td></tr>';
  try {
    const [vehicles, users] = await Promise.all([Admin.vehicles(), Admin.users()]);
    if (!vehicles.length) { tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:20px;color:rgba(255,255,255,0.4)">No vehicles found</td></tr>'; return; }
    tbody.innerHTML = vehicles.map(v => {
      const owner = users.find(u => u.id === v.userId);
      const eColors = { PETROL:'petrol', DIESEL:'diesel', HYBRID:'hybrid' };
      return `<tr>
        <td>${v.registrationNumber}</td>
        <td>${v.brand} ${v.model}</td>
        <td>${v.yearOfManufacture}</td>
        <td>${v.yearOfRegistration}</td>
        <td><span class="badge badge-${eColors[v.engineType]}">${v.engineType}</span></td>
        <td>${v.mileage?.toLocaleString()} km</td>
        <td>${owner?.name || 'N/A'}</td>
      </tr>`;
    }).join('');
  } catch (e) { tbody.innerHTML = `<tr><td colspan="7" style="color:red;padding:20px">${e.message}</td></tr>`; }
}

// ── MAINTENANCE ───────────────────────────────────────────────────────────
async function loadAdminMaintenance() {
  const tbody = document.getElementById('admin-maintenance-tbody');
  if (!tbody) return;
  tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:20px;color:rgba(255,255,255,0.4)"><i class="fas fa-spinner fa-spin"></i> Loading...</td></tr>';
  try {
    const [records, users, vehicles] = await Promise.all([Admin.maintenance(), Admin.users(), Admin.vehicles()]);
    if (!records.length) { tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:20px;color:rgba(255,255,255,0.4)">No records</td></tr>'; return; }
    tbody.innerHTML = records.map(m => {
      const user = users.find(u => u.id === m.userId);
      const vehicle = vehicles.find(v => v.id === m.vehicleId);
      return `<tr>
        <td>${user?.name || 'N/A'}</td>
        <td>${vehicle ? `${vehicle.brand} ${vehicle.model}` : 'N/A'}</td>
        <td>${m.serviceType}</td>
        <td>${m.serviceDate}</td>
        <td>${m.currentMileage?.toLocaleString()} km</td>
        <td>${m.completed ? '<span class="badge badge-completed">Done</span>' : '<span class="badge badge-pending">Pending</span>'}</td>
      </tr>`;
    }).join('');
  } catch (e) { tbody.innerHTML = `<tr><td colspan="6" style="color:red;padding:20px">${e.message}</td></tr>`; }
}

// ── SCHEDULES ─────────────────────────────────────────────────────────────
async function loadAdminSchedules() {
  const tbody = document.getElementById('admin-schedules-tbody');
  if (!tbody) return;
  tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:20px;color:rgba(255,255,255,0.4)"><i class="fas fa-spinner fa-spin"></i> Loading...</td></tr>';
  try {
    const [schedules, users, vehicles] = await Promise.all([Admin.schedules(), Admin.users(), Admin.vehicles()]);
    if (!schedules.length) { tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:20px;color:rgba(255,255,255,0.4)">No schedules</td></tr>'; return; }
    tbody.innerHTML = schedules.map(s => {
      const user = users.find(u => u.id === s.userId);
      const vehicle = vehicles.find(v => v.id === s.vehicleId);
      const sColors = { PENDING:'pending', CONFIRMED:'confirmed', COMPLETED:'completed', CANCELLED:'cancelled' };
      return `<tr>
        <td>${user?.name || 'N/A'}</td>
        <td>${vehicle ? `${vehicle.brand} ${vehicle.model}` : 'N/A'}</td>
        <td>${s.serviceType}</td>
        <td>${s.serviceDate}</td>
        <td>${s.serviceTime}</td>
        <td><span class="badge badge-${sColors[s.status]}">${s.status}</span></td>
      </tr>`;
    }).join('');
  } catch (e) { tbody.innerHTML = `<tr><td colspan="6" style="color:red;padding:20px">${e.message}</td></tr>`; }
}

// ── USERS ─────────────────────────────────────────────────────────────────
async function loadAdminUsers() {
  const tbody = document.getElementById('admin-users-tbody');
  if (!tbody) return;
  tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;padding:20px;color:rgba(255,255,255,0.4)"><i class="fas fa-spinner fa-spin"></i> Loading...</td></tr>';
  try {
    const users = await Admin.users();
    const regularUsers = users.filter(u => u.role === 'USER');
    if (!regularUsers.length) { tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;padding:20px;color:rgba(255,255,255,0.4)">No users</td></tr>'; return; }
    tbody.innerHTML = regularUsers.map((u, i) => `<tr>
      <td>${i + 1}</td>
      <td>${u.name}</td>
      <td>${u.email}</td>
      <td>${u.phone || 'N/A'}</td>
      <td>${u.address || 'N/A'}</td>
    </tr>`).join('');
  } catch (e) { tbody.innerHTML = `<tr><td colspan="5" style="color:red;padding:20px">${e.message}</td></tr>`; }
}