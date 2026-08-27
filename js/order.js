/**
 * js/order.js — Customer Intake & Order Processing Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  // Photos in-memory state (defaults to real model photos)
  const orderPhotos = {
    sister: "assets/images/model/portrait.jpg",
    brother: "assets/images/model/img6.jpg",
    memories: [
      "assets/images/model/img1.jpg",
      "assets/images/model/img2.jpg",
      "assets/images/model/img3.jpg",
      "assets/images/model/img4.jpg"
    ]
  };

  // Image compression utility
  function compressFile(file, maxWidth = 640, quality = 0.78) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/webp', quality));
        };
      };
    });
  }

  // Setup file inputs for Sister & Brother
  ['sister', 'brother'].forEach(role => {
    const input = document.getElementById(`photo-${role}`);
    const preview = document.getElementById(`prev-${role}`);
    const box = document.getElementById(`box-${role}`);

    input?.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const base64 = await compressFile(file, 640, 0.8);
      orderPhotos[role] = base64;
      if (preview) {
        preview.src = base64;
        preview.style.display = 'block';
      }
      box?.classList.add('has-photo');
    });
  });

  // Setup file inputs for 4 Memories
  [0, 1, 2, 3].forEach(idx => {
    const input = document.getElementById(`photo-mem-${idx}`);
    const preview = document.getElementById(`prev-mem-${idx}`);
    const box = document.getElementById(`box-mem-${idx}`);

    input?.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const base64 = await compressFile(file, 480, 0.75);
      orderPhotos.memories[idx] = base64;
      if (preview) {
        preview.src = base64;
        preview.style.display = 'block';
      }
      box?.classList.add('has-photo');
    });
  });

  // Order Submission Handler
  const orderForm = document.getElementById('rakhi-order-form');
  const receiptCard = document.getElementById('order-receipt-card');

  orderForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    // 1. Gather all inputs
    const customerName = document.getElementById('cust-name')?.value.trim() || 'Anonymous Client';
    const customerPhone = document.getElementById('cust-phone')?.value.trim() || '';
    const customerEmail = document.getElementById('cust-email')?.value.trim() || '';
    const deliveryDate = document.getElementById('delivery-date')?.value.trim() || 'August 2026';
    const specialNote = document.getElementById('special-note')?.value.trim() || '';

    const sisterName = document.getElementById('sister-name')?.value.trim() || 'Sister';
    const sisterCity = document.getElementById('sister-city')?.value.trim() || 'Mumbai';
    const brotherName = document.getElementById('brother-name')?.value.trim() || 'Brother';
    const brotherCity = document.getElementById('brother-city')?.value.trim() || 'Delhi';
    const tagline = document.getElementById('hero-tagline')?.value.trim() || 'Some bonds are tied by a thread. Ours was tied long before the Rakhi.';

    const salutation = document.getElementById('letter-salutation')?.value.trim() || `Dearest ${sisterName},`;
    const bodyRaw = document.getElementById('letter-body')?.value.trim() || 'Whenever the world feels overwhelming, knowing that I have you in my corner gives me quiet strength.';
    const signoff = document.getElementById('letter-signoff')?.value.trim() || `Forever your loving brother ❤️, ${brotherName}`;
    const paragraphs = bodyRaw.split('\n\n').filter(p => p.trim() !== '');

    // Memory captions
    const mem1Title = document.getElementById('mem-0-title')?.value.trim() || 'The Tiny Humans Era';
    const mem1Desc = document.getElementById('mem-0-desc')?.value.trim() || 'Stealing toys and crying to Mom.';
    const mem2Title = document.getElementById('mem-1-title')?.value.trim() || 'The Fighting Era';
    const mem2Desc = document.getElementById('mem-1-desc')?.value.trim() || 'Who gets the TV remote?';
    const mem3Title = document.getElementById('mem-2-title')?.value.trim() || 'The Growing Up Era';
    const mem3Desc = document.getElementById('mem-2-desc')?.value.trim() || 'Late night exam preps and secret crushes.';
    const mem4Title = document.getElementById('mem-3-title')?.value.trim() || 'Always Together';
    const mem4Desc = document.getElementById('mem-3-desc')?.value.trim() || 'Same chaotic kids whenever we meet.';

    // Generate Order ID & Slug
    const cleanSlug = `${sisterName.toLowerCase().replace(/[^a-z0-9]/g, '')}-${brotherName.toLowerCase().replace(/[^a-z0-9]/g, '')}` || 'story';
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const orderId = `RB-${cleanSlug}-${randomCode}`;
    const createdAt = new Date().toISOString();

    // Construct Rakhi Story Configuration Payload
    const storyConfig = {
      orderId: orderId,
      createdAt: createdAt,
      customer: {
        name: customerName,
        phone: customerPhone,
        email: customerEmail,
        deliveryDate: deliveryDate,
        note: specialNote
      },
      names: {
        sister: sisterName,
        brother: brotherName
      },
      profiles: {
        sister: {
          photo: orderPhotos.sister,
          city: sisterCity
        },
        brother: {
          photo: orderPhotos.brother,
          city: brotherCity
        }
      },
      hero: {
        tagline: tagline,
        sisterPhoto: orderPhotos.sister,
        brotherPhoto: orderPhotos.brother
      },
      letter: {
        salutation: salutation,
        bodyParagraphs: paragraphs,
        signoff: signoff
      },
      distanceSection: {
        enabled: true,
        sisterCity: sisterCity,
        brotherCity: brotherCity,
        quote: "Different cities. Different lives. Same bond."
      },
      childhoodPhotos: [
        { url: orderPhotos.memories[0], caption: mem1Title },
        { url: orderPhotos.memories[1], caption: mem2Title },
        { url: orderPhotos.memories[2], caption: mem3Title },
        { url: orderPhotos.memories[3], caption: mem4Title }
      ],
      memories: [
        { year: "Era 01", title: mem1Title, description: mem1Desc, image: orderPhotos.memories[0] },
        { year: "Era 02", title: mem2Title, description: mem2Desc, image: orderPhotos.memories[1] },
        { year: "Era 03", title: mem3Title, description: mem3Desc, image: orderPhotos.memories[2] },
        { year: "Era 04", title: mem4Title, description: mem4Desc, image: orderPhotos.memories[3] }
      ],
      status: "new" // new | progress | ready | delivered
    };

    // Save to LocalStorage Database
    try {
      const existingOrders = JSON.parse(localStorage.getItem('rakhi_orders_db') || '[]');
      existingOrders.unshift(storyConfig);
      localStorage.setItem('rakhi_orders_db', JSON.stringify(existingOrders));
    } catch (err) {
      console.warn('Storage quota note:', err);
    }

    // Build Live Story URL using LZString compression if available
    let storyUrl = `${window.location.origin}${window.location.pathname.replace('order.html', '')}index.html?g=${cleanSlug}`;
    if (window.LZString) {
      try {
        const compressed = window.LZString.compressToEncodedURIComponent(JSON.stringify(storyConfig));
        storyUrl = `${window.location.origin}${window.location.pathname.replace('order.html', '')}index.html#data=${compressed}`;
      } catch (_) {}
    }

    // WhatsApp Message Generator
    const waText = encodeURIComponent(
      `🪔 *NEW RAKSHA BANDHAN ORDER SUBMITTED* 🪔\n\n` +
      `*Order ID:* ${orderId}\n` +
      `*Customer:* ${customerName} (${customerPhone})\n` +
      `*Siblings:* ${sisterName} (${sisterCity}) & ${brotherName} (${brotherCity})\n` +
      `*Delivery Date:* ${deliveryDate}\n\n` +
      `💌 *Letter Preview:* "${paragraphs[0] ? paragraphs[0].substring(0, 80) : ''}..."\n\n` +
      `✨ *Live Preview:* ${storyUrl}`
    );
    const waUrl = `https://api.whatsapp.com/send?text=${waText}`;

    // Display Receipt View
    orderForm.style.display = 'none';
    if (receiptCard) {
      receiptCard.style.display = 'block';
      const idEl = document.getElementById('receipt-order-id');
      const liveBtn = document.getElementById('receipt-btn-preview');
      const waBtn = document.getElementById('receipt-btn-wa');
      const dlBtn = document.getElementById('receipt-btn-download');

      if (idEl) idEl.textContent = orderId;
      if (liveBtn) liveBtn.href = storyUrl;
      if (waBtn) waBtn.href = waUrl;

      if (dlBtn) {
        dlBtn.onclick = () => {
          const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(storyConfig, null, 2));
          const dlAnchor = document.createElement('a');
          dlAnchor.setAttribute("href", dataStr);
          dlAnchor.setAttribute("download", `${orderId}.json`);
          document.body.appendChild(dlAnchor);
          dlAnchor.click();
          dlAnchor.remove();
        };
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
});
