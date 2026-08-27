/**
 * js/admin.js — Master Orders Fulfillment & Tracking Dashboard Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  // Default Demo Orders if database is empty
  const defaultSampleOrders = [
    {
      orderId: "RB-pooja-aujasya-1001",
      createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
      customer: {
        name: "Aujasya Rajput",
        phone: "+91 98765 43210",
        email: "aujasya@example.com",
        deliveryDate: "28th August 2026",
        note: "Include London distance bridge & royal letter."
      },
      names: {
        sister: "Pooja",
        brother: "Aujasya"
      },
      profiles: {
        sister: { photo: "assets/images/model/portrait.jpg", city: "Mumbai" },
        brother: { photo: "assets/images/model/img6.jpg", city: "London" }
      },
      hero: {
        tagline: "Some bonds are tied by a thread. Ours was tied long before the Rakhi.",
        sisterPhoto: "assets/images/model/portrait.jpg",
        brotherPhoto: "assets/images/model/img6.jpg"
      },
      letter: {
        salutation: "Dearest Pooja Didi,",
        bodyParagraphs: [
          "We've grown up. We've changed. But through everything life has thrown at us, you've remained my biggest support.",
          "Whenever the world feels overwhelming, knowing that I have you in my corner gives me quiet strength.",
          "No matter how far life takes us, our bond will remain unbroken. Happy Raksha Bandhan!"
        ],
        signoff: "Forever your loving brother ❤️, Aujasya"
      },
      distanceSection: {
        enabled: true,
        sisterCity: "Mumbai",
        brotherCity: "London",
        quote: "Different cities. Different lives. Same bond."
      },
      childhoodPhotos: [
        { url: "assets/images/model/img1.jpg", caption: "The Tiny Humans Era" },
        { url: "assets/images/model/img2.jpg", caption: "The Fighting Era" },
        { url: "assets/images/model/img3.jpg", caption: "The Growing Up Era" },
        { url: "assets/images/model/img4.jpg", caption: "Always Together" }
      ],
      memories: [
        { year: "Era 01", title: "The Tiny Humans Era", description: "Stealing toys and crying to Mom.", image: "assets/images/model/img1.jpg" },
        { year: "Era 02", title: "The Fighting Era", description: "Who gets the TV remote?", image: "assets/images/model/img2.jpg" },
        { year: "Era 03", title: "The Growing Up Era", description: "Late night exam preps and secret crushes.", image: "assets/images/model/img3.jpg" },
        { year: "Era 04", title: "Always Together", description: "Same chaotic kids whenever we meet.", image: "assets/images/model/img4.jpg" }
      ],
      status: "delivered"
    },
    {
      orderId: "RB-ananya-aarav-2045",
      createdAt: new Date(Date.now() - 3600000 * 1).toISOString(),
      customer: {
        name: "Aarav Sharma",
        phone: "+91 99887 76655",
        email: "aarav@example.com",
        deliveryDate: "28th August 2026",
        note: "Sister loves sweets and yellow color."
      },
      names: {
        sister: "Ananya",
        brother: "Aarav"
      },
      profiles: {
        sister: { photo: "assets/images/model/portrait.jpg", city: "Mumbai" },
        brother: { photo: "assets/images/model/img6.jpg", city: "Delhi" }
      },
      hero: {
        tagline: "A tiny thread. A lifetime of promises.",
        sisterPhoto: "assets/images/model/portrait.jpg",
        brotherPhoto: "assets/images/model/img6.jpg"
      },
      letter: {
        salutation: "Dearest Ananya,",
        bodyParagraphs: [
          "Thank you for your unending patience, your wisdom, and for always being my secret keeper."
        ],
        signoff: "Forever your loving brother ❤️, Aarav"
      },
      distanceSection: {
        enabled: true,
        sisterCity: "Mumbai",
        brotherCity: "Delhi",
        quote: "Different cities. Same bond."
      },
      childhoodPhotos: [
        { url: "assets/images/model/img1.jpg", caption: "The Unstoppable Duo" },
        { url: "assets/images/model/img2.jpg", caption: "Childhood Battles" },
        { url: "assets/images/model/img3.jpg", caption: "Late Night Talks" },
        { url: "assets/images/model/img4.jpg", caption: "Always Together" }
      ],
      memories: [
        { year: "Era 01", title: "The Tiny Humans Era", description: "Stealing toys.", image: "assets/images/model/img1.jpg" },
        { year: "Era 02", title: "The Fighting Era", description: "Remote fights.", image: "assets/images/model/img2.jpg" },
        { year: "Era 03", title: "The Growing Up Era", description: "Exam preps.", image: "assets/images/model/img3.jpg" },
        { year: "Era 04", title: "Always Together", description: "Forever bond.", image: "assets/images/model/img4.jpg" }
      ],
      status: "new"
    }
  ];

  // Helper to load orders
  function getOrders() {
    try {
      const stored = localStorage.getItem('rakhi_orders_db');
      if (stored) return JSON.parse(stored);
    } catch (_) {}
    localStorage.setItem('rakhi_orders_db', JSON.stringify(defaultSampleOrders));
    return defaultSampleOrders;
  }

  function saveOrders(orders) {
    localStorage.setItem('rakhi_orders_db', JSON.stringify(orders));
    renderDashboard();
  }

  // Generate live story link
  function generateStoryUrl(order) {
    const slug = `${(order.names?.sister || 'sister').toLowerCase()}-${(order.names?.brother || 'brother').toLowerCase()}`;
    let url = `${window.location.origin}${window.location.pathname.replace('admin.html', '')}index.html?g=${slug}`;
    if (window.LZString) {
      try {
        const compressed = window.LZString.compressToEncodedURIComponent(JSON.stringify(order));
        url = `${window.location.origin}${window.location.pathname.replace('admin.html', '')}index.html#data=${compressed}`;
      } catch (_) {}
    }
    return url;
  }

  // Active filter state
  let currentFilter = 'all';
  let searchQuery = '';

  // Render Dashboard
  function renderDashboard() {
    const orders = getOrders();

    // 1. Calculate Stats
    const totalCount = orders.length;
    const newCount = orders.filter(o => o.status === 'new').length;
    const progressCount = orders.filter(o => o.status === 'progress').length;
    const readyCount = orders.filter(o => o.status === 'ready').length;
    const deliveredCount = orders.filter(o => o.status === 'delivered').length;

    document.getElementById('stat-total').textContent = totalCount;
    document.getElementById('stat-new').textContent = newCount;
    document.getElementById('stat-progress').textContent = progressCount + readyCount;
    document.getElementById('stat-delivered').textContent = deliveredCount;

    // 2. Filter & Search
    let filtered = orders.filter(o => {
      if (currentFilter !== 'all' && o.status !== currentFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const str = `${o.orderId} ${o.customer?.name} ${o.customer?.phone} ${o.names?.sister} ${o.names?.brother}`.toLowerCase();
        return str.includes(q);
      }
      return true;
    });

    // 3. Render Table
    const tbody = document.getElementById('orders-table-body');
    if (!tbody) return;

    if (filtered.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7">
            <div class="empty-state-box">
              <div class="empty-icon">🪔</div>
              <h3>No Orders Found</h3>
              <p style="margin-top:4px;">No customer orders match your current filter criteria.</p>
            </div>
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = filtered.map((order, idx) => {
      const liveUrl = generateStoryUrl(order);
      const waMsg = encodeURIComponent(
        `Namaste ${order.customer?.name || 'there'}! 🪔\n\n` +
        `Your personalized Raksha Bandhan story for *${order.names?.sister || 'Sister'} & ${order.names?.brother || 'Brother'}* is ready! ✨\n\n` +
        `Tap below to open your interactive experience:\n${liveUrl}\n\n` +
        `Wishing you both a wonderful and blessed Raksha Bandhan! ❤️`
      );
      const waLink = `https://api.whatsapp.com/send?phone=${(order.customer?.phone || '').replace(/[^0-9]/g, '')}&text=${waMsg}`;

      const statusMap = {
        new: '<span class="status-badge status-new">🆕 New Order</span>',
        progress: '<span class="status-badge status-progress">🎨 In Production</span>',
        ready: '<span class="status-badge status-ready">✅ Ready to Deliver</span>',
        delivered: '<span class="status-badge status-delivered">🚀 Delivered</span>'
      };

      const dateStr = new Date(order.createdAt || Date.now()).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      });

      return `
        <tr>
          <td>
            <strong style="color:var(--gold-light);font-family:var(--font-mono);font-size:0.85rem;">${order.orderId}</strong>
            <div style="font-size:0.75rem;color:var(--text-muted);margin-top:2px;">${dateStr}</div>
          </td>
          <td>
            <div style="font-weight:600;">${order.customer?.name || 'Anonymous'}</div>
            <div style="font-size:0.78rem;color:var(--text-muted);">${order.customer?.phone || ''}</div>
          </td>
          <td>
            <div style="display:flex;align-items:center;gap:6px;">
              <span>👸 ${order.names?.sister || 'Sister'}</span>
              <span style="color:var(--gold-primary);">×</span>
              <span>🤴 ${order.names?.brother || 'Brother'}</span>
            </div>
            <div style="font-size:0.75rem;color:var(--text-muted);margin-top:2px;">
              ${order.profiles?.sister?.city || ''} ➔ ${order.profiles?.brother?.city || ''}
            </div>
          </td>
          <td>
            <select class="form-control status-select" data-id="${order.orderId}" style="padding:6px 10px;font-size:0.82rem;width:auto;border-radius:8px;">
              <option value="new" ${order.status === 'new' ? 'selected' : ''}>🆕 New</option>
              <option value="progress" ${order.status === 'progress' ? 'selected' : ''}>🎨 In Production</option>
              <option value="ready" ${order.status === 'ready' ? 'selected' : ''}>✅ Ready</option>
              <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>🚀 Delivered</option>
            </select>
          </td>
          <td>
            <div class="table-actions">
              <!-- Live Preview -->
              <a href="${liveUrl}" target="_blank" class="btn-action-icon" title="Preview Live Story">👁️</a>
              
              <!-- WhatsApp Deliver -->
              <a href="${waLink}" target="_blank" class="btn-action-icon btn-action-wa" title="Send via WhatsApp">📲</a>
              
              <!-- Download JSON -->
              <button type="button" class="btn-action-icon btn-dl-json" data-id="${order.orderId}" title="Download JSON Profile">📥</button>
              
              <!-- Delete -->
              <button type="button" class="btn-action-icon btn-action-del btn-del-order" data-id="${order.orderId}" title="Delete Order">🗑️</button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    // Attach Status change listeners
    document.querySelectorAll('.status-select').forEach(sel => {
      sel.addEventListener('change', (e) => {
        const id = e.target.dataset.id;
        const newStatus = e.target.value;
        const all = getOrders();
        const target = all.find(o => o.orderId === id);
        if (target) {
          target.status = newStatus;
          saveOrders(all);
        }
      });
    });

    // Attach JSON Download listeners
    document.querySelectorAll('.btn-dl-json').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = btn.dataset.id;
        const all = getOrders();
        const target = all.find(o => o.orderId === id);
        if (!target) return;
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(target, null, 2));
        const a = document.createElement('a');
        a.setAttribute("href", dataStr);
        a.setAttribute("download", `${id}.json`);
        document.body.appendChild(a);
        a.click();
        a.remove();
      });
    });

    // Attach Delete listeners
    document.querySelectorAll('.btn-del-order').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = btn.dataset.id;
        if (confirm(`Are you sure you want to delete order ${id}?`)) {
          const all = getOrders().filter(o => o.orderId !== id);
          saveOrders(all);
        }
      });
    });
  }

  // Filter Pill buttons
  document.querySelectorAll('.filter-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-pill').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter || 'all';
      renderDashboard();
    });
  });

  // Search input
  const searchInput = document.getElementById('admin-search-input');
  searchInput?.addEventListener('input', (e) => {
    searchQuery = e.target.value.trim();
    renderDashboard();
  });

  // Export All Orders JSON
  const btnExportDb = document.getElementById('btn-export-db');
  btnExportDb?.addEventListener('click', () => {
    const orders = getOrders();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(orders, null, 2));
    const a = document.createElement('a');
    a.setAttribute("href", dataStr);
    a.setAttribute("download", `rakhi_orders_backup_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(a);
    a.click();
    a.remove();
  });

  // Import Database File
  const inputImportDb = document.getElementById('input-import-db');
  inputImportDb?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const parsed = JSON.parse(evt.target.result);
        if (Array.isArray(parsed)) {
          saveOrders(parsed);
          alert(`Successfully imported ${parsed.length} orders!`);
        } else {
          alert('Invalid database JSON file format.');
        }
      } catch (err) {
        alert('Error parsing database JSON.');
      }
    };
    reader.readAsText(file);
  });

  // Initial render
  renderDashboard();
});
