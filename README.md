# 🪔 Sacred Raksha Bandhan — High-End Cinematic Interactive Story

[![Live on Vercel](https://img.shields.io/badge/Vercel-Live%20Production-black?style=for-the-badge&logo=vercel)](https://rakshabandhan-steel.vercel.app)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live-brightgreen?style=for-the-badge&logo=github)](https://aujasyarajput18.github.io/RakshaBandhan/)

An ultra-luxurious, scroll-driven interactive Raksha Bandhan celebration web experience engineered with **GSAP ScrollTrigger**, **Lenis Smooth Scroll**, **Web Audio API haptic sound effects**, and **3D interactive elements**.

---

## 🌐 Live Demos & Links

- ⚡ **Live Production (Vercel)**: **[https://rakshabandhan-steel.vercel.app](https://rakshabandhan-steel.vercel.app)**
- 📝 **Customer Intake & Order Portal**: **[https://rakshabandhan-steel.vercel.app/order.html](https://rakshabandhan-steel.vercel.app/order.html)**
- 🎛️ **Admin Orders & Fulfillment Hub**: **[https://rakshabandhan-steel.vercel.app/admin.html](https://rakshabandhan-steel.vercel.app/admin.html)**
- 🎨 **Online Customizer Studio**: **[https://rakshabandhan-steel.vercel.app/customize.html](https://rakshabandhan-steel.vercel.app/customize.html)**
- 📱 **GitHub Pages Mirror**: **[https://aujasyarajput18.github.io/RakshaBandhan/](https://aujasyarajput18.github.io/RakshaBandhan/)**
- 🐙 **GitHub Repository**: **[https://github.com/Aujasyarajput18/RakshaBandhan](https://github.com/Aujasyarajput18/RakshaBandhan)**

---

## 💼 Client Order & Fulfillment Business Operating System

### 1. 📝 Customer Order Intake (`/order.html`)
- Allows clients or siblings to easily submit their details:
  - **Contact & Tracking**: Customer Name, WhatsApp Number, Email, Target Delivery Date.
  - **Sibling Profiles**: Sister & Brother names, cities, and custom opening tagline.
  - **Photo Uploads**: Sibling portraits + 4 memory milestones with client-side auto-compression and instant preview.
  - **Royal Letter**: Heartfelt salutation, personal paragraphs, and signature.
- **Instant Output**: Generates an **Order Reference ID**, pre-formats a **1-click WhatsApp submission message**, and provides immediate downloadable JSON config.

### 2. 🎛️ Admin Fulfillment Dashboard (`/admin.html`)
- Centralized operations hub for managing all customer orders:
  - **📊 Live KPI Cards**: Total Orders, New Submissions, In Production, and Delivered.
  - **🔍 Real-Time Search & Filters**: Instant search by Client Name, Phone, Sibling Duo, or Order ID.
  - **👁️ 1-Click Live Preview**: Test and open any order's interactive story with full animation in a single click.
  - **📲 1-Click WhatsApp Delivery**: Pre-fills a gorgeous delivery message to the customer with their live link.
  - **📥 Download JSON Profile**: Exports `<order-id>.json` ready to place in the `gifts/` folder.
  - **💾 Backup & Restore**: 1-click Export/Import of the entire customer orders database.

---

## ✨ Features & Chapters

1. **👑 Intro Festival Cover (`.intro-scene`)** — Centered luxury festival typography (*HAPPY RAKSHA BANDHAN*) with smooth Lenis inertia scroll unveiling the emotional prelude.
2. **🌸 Chapter 00: Sacred Sibling Universe (`ANANYA & AARAV`)** — Interconnected 3-element polaroid gateway linked with animated golden threads to the center Kundan Rakhi portal button.
3. **🌟 Chapter 01: Sister Spotlight (`#her`)** — Gold filigree royal frame with radiant halo, floating Diya lamp, and symmetrical trait tags (*Keeper of Secrets*, *50% Snack Tax*, *Lifelong Anchor*).
4. **🎞️ Chapter 02: Kinetic Memory Flight (`#photo-journey`)** — Kinetic memory tray that flies across the screen, docking polaroids into the story narrative as you scroll.
5. **📸 Chapter 03: The Chronology of Us (`#memories`)** — Horizontal timeline with high-res portrait memory slates with intelligent focal point framing (`object-position: center 15%`).
6. **💌 Chapter 04: Royal Prem Patra (`#letter`)** — Interactive wax-sealed velvet envelope with crack sound effects, unfolding a royal handwritten letter with self-closing and scroll triggers.
7. **🌍 Chapter 05: Global Sibling Hub (`#distance`)** — Real-time distance bridge connecting Mumbai & London with a vertical laser conduit, glowing Kundan medallion, and live countdown to *0 MILES • 1 SACRED BOND*.
8. **🎉 Chapter 06: Grand Sacred Finale (`#finale`)** — Royal sanctum with 3D floating Rakhi, blessing dedication card, celebration confetti cannon, and ambient sitar symphony.

---

## 🛠️ Personalizing Stories

### Method 1: Customer Intake Portal
Share [order.html](https://rakshabandhan-steel.vercel.app/order.html) with your clients. They fill out their details and upload photos directly.

### Method 2: High-Volume Client JSON Profiles
To deploy multiple personalized client stories:
1. Duplicate `gifts/demo.json` to `gifts/<client-id>.json`.
2. Edit names, cities, memories, and photos.
3. Share the personalized link:
   `https://rakshabandhan-steel.vercel.app/?g=<client-id>`

---

## 🚀 Deployment

This is a pure, zero-dependency static application:
- **Vercel**: Deploy directly with `vercel --prod`
- **GitHub Pages**: Automatically served from the `main` branch
- **Netlify / Cloudflare Pages**: Drag and drop the root folder

