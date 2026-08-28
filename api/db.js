const fs = require('fs');
const path = require('path');

// In-memory runtime cache for serverless warm instances
let inMemoryOrders = null;

// Initial sample seed orders
const SEED_ORDERS = [
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
    names: { sister: "Pooja", brother: "Aujasya" },
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
        "Whenever the world feels overwhelming, knowing that I have you in my corner gives me quiet strength."
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
      { url: "assets/images/model/img2.jpg", caption: "The Fighting Era" }
    ],
    memories: [
      { year: "Era 01", title: "The Tiny Humans Era", description: "Stealing toys.", image: "assets/images/model/img1.jpg" },
      { year: "Era 02", title: "The Fighting Era", description: "Remote fights.", image: "assets/images/model/img2.jpg" }
    ],
    status: "delivered"
  }
];

// Cloud Storage Endpoint (Upstash / Vercel KV / Cloud REST DB)
const CLOUD_KV_URL = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const CLOUD_KV_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

async function fetchFromCloudKV() {
  if (!CLOUD_KV_URL || !CLOUD_KV_TOKEN) return null;
  try {
    const res = await fetch(`${CLOUD_KV_URL}/get/rakhi_orders_master_db`, {
      headers: { Authorization: `Bearer ${CLOUD_KV_TOKEN}` }
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.result) {
        return JSON.parse(data.result);
      }
    }
  } catch (err) {
    console.error('Cloud KV Fetch Error:', err);
  }
  return null;
}

async function saveToCloudKV(orders) {
  if (!CLOUD_KV_URL || !CLOUD_KV_TOKEN) return false;
  try {
    const res = await fetch(`${CLOUD_KV_URL}/set/rakhi_orders_master_db`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${CLOUD_KV_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(JSON.stringify(orders))
    });
    return res.ok;
  } catch (err) {
    console.error('Cloud KV Save Error:', err);
    return false;
  }
}

// Local filesystem fallback for dev / persistent node container
const LOCAL_DB_PATH = path.join(process.cwd(), 'gifts', 'orders_database.json');

function readLocalDb() {
  try {
    if (fs.existsSync(LOCAL_DB_PATH)) {
      const data = fs.readFileSync(LOCAL_DB_PATH, 'utf8');
      return JSON.parse(data);
    }
  } catch (_) {}
  return null;
}

function writeLocalDb(orders) {
  try {
    const dir = path.dirname(LOCAL_DB_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(orders, null, 2), 'utf8');
  } catch (_) {}
}

async function getAllOrders() {
  // 1. Try Cloud KV if configured
  const cloudData = await fetchFromCloudKV();
  if (cloudData && Array.isArray(cloudData)) {
    inMemoryOrders = cloudData;
    return inMemoryOrders;
  }

  // 2. Try In-Memory Cache
  if (inMemoryOrders && Array.isArray(inMemoryOrders)) {
    return inMemoryOrders;
  }

  // 3. Try Local File
  const localData = readLocalDb();
  if (localData && Array.isArray(localData)) {
    inMemoryOrders = localData;
    return inMemoryOrders;
  }

  // 4. Fallback to SEED
  inMemoryOrders = [...SEED_ORDERS];
  return inMemoryOrders;
}

async function saveAllOrders(orders) {
  inMemoryOrders = orders;
  writeLocalDb(orders);
  await saveToCloudKV(orders);
  return true;
}

async function addOrder(newOrder) {
  const orders = await getAllOrders();
  // Check if duplicate orderId
  const exists = orders.findIndex(o => o.orderId === newOrder.orderId);
  if (exists >= 0) {
    orders[exists] = newOrder;
  } else {
    orders.unshift(newOrder);
  }
  await saveAllOrders(orders);
  return newOrder;
}

async function updateOrderStatus(orderId, status) {
  const orders = await getAllOrders();
  const target = orders.find(o => o.orderId === orderId);
  if (target) {
    target.status = status;
    target.updatedAt = new Date().toISOString();
    await saveAllOrders(orders);
    return target;
  }
  return null;
}

async function deleteOrder(orderId) {
  const orders = await getAllOrders();
  const filtered = orders.filter(o => o.orderId !== orderId);
  await saveAllOrders(filtered);
  return true;
}

// Input Sanitization to prevent XSS / malicious injection
function sanitizeString(str, maxLen = 2000) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/[<>]/g, '') // Strip angle brackets
    .trim()
    .slice(0, maxLen);
}

function sanitizeOrderPayload(payload) {
  if (!payload || typeof payload !== 'object') return null;

  const sisterName = sanitizeString(payload.names?.sister || 'Sister', 60);
  const brotherName = sanitizeString(payload.names?.brother || 'Brother', 60);
  const cleanSlug = `${sisterName.toLowerCase().replace(/[^a-z0-9]/g, '')}-${brotherName.toLowerCase().replace(/[^a-z0-9]/g, '')}` || 'story';
  const randomCode = Math.floor(1000 + Math.random() * 9000);
  const orderId = sanitizeString(payload.orderId || `RB-${cleanSlug}-${randomCode}`, 80);

  const customerName = sanitizeString(payload.customer?.name || 'Anonymous Client', 100);
  const customerPhone = sanitizeString(payload.customer?.phone || '', 30);
  const customerEmail = sanitizeString(payload.customer?.email || '', 100);
  const deliveryDate = sanitizeString(payload.customer?.deliveryDate || 'August 2026', 60);
  const note = sanitizeString(payload.customer?.note || '', 500);

  const sisterCity = sanitizeString(payload.profiles?.sister?.city || 'Mumbai', 80);
  const brotherCity = sanitizeString(payload.profiles?.brother?.city || 'Delhi', 80);
  const tagline = sanitizeString(payload.hero?.tagline || 'Some bonds are tied by a thread. Ours was tied long before the Rakhi.', 250);

  const salutation = sanitizeString(payload.letter?.salutation || `Dearest ${sisterName},`, 100);
  const signoff = sanitizeString(payload.letter?.signoff || `Forever your loving brother ❤️, ${brotherName}`, 120);
  
  let bodyParagraphs = [];
  if (Array.isArray(payload.letter?.bodyParagraphs)) {
    bodyParagraphs = payload.letter.bodyParagraphs.map(p => sanitizeString(p, 1000)).filter(Boolean);
  }

  // Sanitize photos (allow base64 data urls or internal asset paths)
  const sanitizeImg = (src, fallback) => {
    if (typeof src === 'string' && (src.startsWith('data:image/') || src.startsWith('assets/images/'))) {
      return src.slice(0, 1500000); // 1.5MB max per image string
    }
    return fallback;
  };

  const sisterPhoto = sanitizeImg(payload.profiles?.sister?.photo, 'assets/images/model/portrait.jpg');
  const brotherPhoto = sanitizeImg(payload.profiles?.brother?.photo, 'assets/images/model/img6.jpg');

  const childhoodPhotos = (payload.childhoodPhotos || []).slice(0, 5).map((item, idx) => ({
    url: sanitizeImg(item.url, `assets/images/model/img${idx + 1}.jpg`),
    caption: sanitizeString(item.caption || `Memory ${idx + 1}`, 80)
  }));

  const memories = (payload.memories || []).slice(0, 5).map((item, idx) => ({
    year: sanitizeString(item.year || `Era 0${idx + 1}`, 30),
    title: sanitizeString(item.title || `Memory ${idx + 1}`, 80),
    description: sanitizeString(item.description || '', 200),
    image: sanitizeImg(item.image, `assets/images/model/img${idx + 1}.jpg`)
  }));

  return {
    orderId,
    createdAt: payload.createdAt || new Date().toISOString(),
    customer: {
      name: customerName,
      phone: customerPhone,
      email: customerEmail,
      deliveryDate: deliveryDate,
      note: note
    },
    names: { sister: sisterName, brother: brotherName },
    profiles: {
      sister: { photo: sisterPhoto, city: sisterCity },
      brother: { photo: brotherPhoto, city: brotherCity }
    },
    hero: {
      tagline: tagline,
      sisterPhoto: sisterPhoto,
      brotherPhoto: brotherPhoto
    },
    letter: {
      salutation: salutation,
      bodyParagraphs: bodyParagraphs.length ? bodyParagraphs : ["Happy Raksha Bandhan! Forever lucky to have you."],
      signoff: signoff
    },
    distanceSection: {
      enabled: true,
      sisterCity: sisterCity,
      brotherCity: brotherCity,
      quote: "Different cities. Different lives. Same bond."
    },
    childhoodPhotos: childhoodPhotos.length ? childhoodPhotos : [
      { url: "assets/images/model/img1.jpg", caption: "The Unstoppable Duo" },
      { url: "assets/images/model/img2.jpg", caption: "Childhood Memories" }
    ],
    memories: memories.length ? memories : [
      { year: "Era 01", title: "The Tiny Humans Era", description: "Stealing toys.", image: "assets/images/model/img1.jpg" },
      { year: "Era 02", title: "The Fighting Era", description: "Remote fights.", image: "assets/images/model/img2.jpg" }
    ],
    status: payload.status || "new"
  };
}

module.exports = {
  getAllOrders,
  addOrder,
  updateOrderStatus,
  deleteOrder,
  sanitizeOrderPayload
};
