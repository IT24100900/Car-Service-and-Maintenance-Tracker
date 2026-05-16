const PRODUCT_EMOJIS = {
  'Engine Oils': '🛢️', 'Filters': '🔩', 'Batteries': '🔋',
  'Tyres': '🏎️', 'Spark Plugs': '⚡', 'Care Products': '✨', 'Accessories': '🔧'
};

let allProducts = [];
let editingProductId = null;
let activeFilter = 'All';

document.addEventListener('DOMContentLoaded', async () => {
  await loadProducts();
  const user = getUser();
  if (user && user.role === 'ADMIN') document.getElementById('admin-add-product-btn')?.style.setProperty('display','flex');
});

async function loadProducts() {
  const grid = document.getElementById('products-grid');
  if (!grid) return;
  grid.innerHTML = '<div style="text-align:center;padding:40px;color:var(--text-light)"><i class="fas fa-spinner fa-spin fa-2x"></i></div>';
  try {
    allProducts = await Shop.list();
    renderProducts();
  } catch (e) {
    grid.innerHTML = `<div style="text-align:center;padding:40px;color:var(--danger)"><i class="fas fa-exclamation-circle fa-2x"></i><p style="margin-top:12px">${e.message}</p></div>`;
  }
}

function renderProducts() {
  const grid = document.getElementById('products-grid');
  let list = activeFilter === 'All' ? allProducts : allProducts.filter(p => p.category === activeFilter);
  const user = getUser();
  if (!list.length) {
    grid.innerHTML = `<div style="text-align:center;padding:40px;color:var(--text-light)"><i class="fas fa-box-open fa-2x"></i><p style="margin-top:12px">No products found</p></div>`;
    return;
  }
  const stars = (r) => '★'.repeat(Math.round(r)) + '☆'.repeat(5 - Math.round(r));
  grid.innerHTML = list.map(p => `
    <div class="product-card" data-id="${p.id}">
      <div class="product-img">
        ${PRODUCT_EMOJIS[p.category] || '📦'}
        ${p.stock < 10 ? '<span class="product-badge">Low Stock</span>' : ''}
      </div>
      <div class="product-body">
        <div class="product-category">${p.category}</div>
        <div class="product-name">${p.name}</div>
        <div class="product-desc">${p.description}</div>
        <div class="product-rating">
          <span class="stars">${stars(p.rating)}</span>
          <span class="rating-num">${p.rating?.toFixed(1)}</span>
        </div>
        <div class="product-footer">
          <div>
            <div class="product-price">Rs. ${p.price?.toLocaleString()}</div>
            <div class="product-stock">In Stock: ${p.stock}</div>
          </div>
          ${user?.role === 'ADMIN' ?
            `<div style="display:flex;gap:6px">
              <button class="btn-cart" style="background:var(--info)" onclick="openProductModal('${p.id}')"><i class="fas fa-edit"></i></button>
              <button class="btn-cart" style="background:var(--danger)" onclick="deleteProduct('${p.id}')"><i class="fas fa-trash"></i></button>
            </div>` :
            `<button class="btn-cart" onclick="addToCart('${p.id}')"><i class="fas fa-shopping-cart"></i></button>`
          }
        </div>
      </div>
    </div>`).join('');
}

function filterProducts(cat) {
  activeFilter = cat;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.toggle('active', b.dataset.cat === cat));
  renderProducts();
}

function openProductModal(id = null) {
  editingProductId = id;
  const p = id ? allProducts.find(x => x.id === id) : null;
  document.getElementById('prod-modal-title').textContent = id ? 'Edit Product' : 'Add Product';
  document.getElementById('prod-name').value        = p?.name || '';
  document.getElementById('prod-category').value    = p?.category || '';
  document.getElementById('prod-price').value       = p?.price || '';
  document.getElementById('prod-stock').value       = p?.stock || '';
  document.getElementById('prod-rating').value      = p?.rating || 4.5;
  document.getElementById('prod-description').value = p?.description || '';
  document.getElementById('product-modal').classList.add('show');
}

async function saveProduct() {
  const name = document.getElementById('prod-name').value.trim();
  const category = document.getElementById('prod-category').value;
  if (!name || !category) { toast('Name and category required', 'error'); return; }
  const data = {
    name, category,
    price: parseFloat(document.getElementById('prod-price').value) || 0,
    stock: parseInt(document.getElementById('prod-stock').value) || 0,
    rating: parseFloat(document.getElementById('prod-rating').value) || 4.5,
    description: document.getElementById('prod-description').value.trim(),
    active: true
  };
  try {
    if (editingProductId) { await Shop.update(editingProductId, data); toast('Product updated!'); }
    else { await Shop.create(data); toast('Product added!'); }
    document.getElementById('product-modal').classList.remove('show');
    loadProducts();
  } catch (e) { toast(e.message, 'error'); }
}

async function deleteProduct(id) {
  if (!confirm('Delete this product?')) return;
  try { await Shop.delete(id); toast('Product deleted', 'warning'); loadProducts(); }
  catch (e) { toast(e.message, 'error'); }
}

function addToCart(id) {
  const p = allProducts.find(x => x.id === id);
  toast(`${p?.name} added to cart!`, 'success');
}

document.querySelectorAll('.modal-close, .btn-cancel').forEach(b => {
  b.addEventListener('click', () => document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('show')));
});
