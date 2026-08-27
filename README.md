# Rakhi — client story template

A lightweight, scroll-led Raksha Bandhan experience built as a reusable static-site template. It is intentionally story-first: kinetic opening typography, personal portraits, editorial memory prints, a thread timeline, a letter, a distance/reconnection scene, and a quiet finale.

## Personalize one story

Open `customize.html`. It accepts:

- Sister and brother names
- One portrait for each sibling
- Four shared memory photos
- Cities, letter date, salutation, body, and signoff

The generated link can be sent directly to a client. Its information is embedded into the link, which is convenient for small, quick handoffs.

## Deliver 100 client stories efficiently

For a large batch, use external image files and one small JSON file per client. This is much more reliable than embedding many photos in long URLs.

1. Create a folder per client, for example `assets/clients/pooja-aujasya/`, and place `sister.jpg`, `brother.jpg`, and `memory-01.jpg` through `memory-05.jpg` inside.
2. Duplicate [gifts/client-template.json](gifts/client-template.json) as `gifts/pooja-aujasya.json`.
3. Replace the names, cities, letter, memory captions, dates, and image paths in that copy.
4. Send the client this URL: `https://your-domain.com/index.html?g=pooja-aujasya`.

The page reads the JSON and hydrates the same cinematic design automatically. See the working [gifts/demo.json](gifts/demo.json) with `index.html?g=demo`.

## Content schema

The important fields are:

```json
{
  "names": { "sister": "Pooja", "brother": "Aujasya" },
  "profiles": {
    "sister": { "photo": "assets/clients/pooja-aujasya/sister.jpg", "city": "Mumbai" },
    "brother": { "photo": "assets/clients/pooja-aujasya/brother.jpg", "city": "Delhi" }
  },
  "childhoodPhotos": [{ "url": "...", "caption": "..." }],
  "memories": [{ "year": "2026", "title": "...", "description": "...", "image": "..." }],
  "letter": { "date": "August, 2026", "salutation": "...", "bodyParagraphs": ["..."], "signoff": "..." }
}
```

## Deployment

It is a static site—upload the repository unchanged to Netlify, Vercel, Cloudflare Pages, GitHub Pages, or any ordinary web host. There is no build command and no database.

For client images, use optimised JPEG/WebP files at around 1200px on the long side; that keeps the story premium without making it slow on mobile.
