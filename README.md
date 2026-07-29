# Tormach 770M — Equipment & Peripherals

A single-page, scan-to-view catalog of the workholding, tooling, and measuring
equipment available for the **Tormach 770M** at the NYU Makerspace. Someone
scans the QR code on the machine → lands here → browses everything they can use,
with specs and handling notes.

Pure static site (HTML/CSS/JS) — no build step, no framework.

## Files
- `index.html` — page markup
- `styles.css` — industrial blueprint theme
- `app.js` — **all equipment data lives here** (the `EQUIPMENT` array)
- `images/` — drop real photos here

## Add / edit equipment
Open `app.js` and edit the `EQUIPMENT` array. Each item:

```js
{
  id: "vise-smw",
  name: "SMW Vise",
  code: "WH-02",
  category: "Workholding",   // becomes a filter chip automatically
  icon: "vise",              // vise | toolholder | measuring | endmill | misc
  photo: "",                 // "smw-vise.jpg" once you add the file to /images
  tagline: "Saunders Machine Works modular vise",
  specs: [["Type", "Modular"], ["Use", "Repeatable fixturing"]],
  notes: "Handling / usage notes shown in the detail view.",
}
```

## Add real photos
1. Put the image in `images/` (e.g. `images/smw-vise.jpg`).
2. Set that item's `photo` to the filename.
3. Until then, a blueprint placeholder is drawn automatically.

Landscape ~4:3 photos on a clean background look best.

## Preview locally
```bash
cd tormach-770m-gallery
python3 -m http.server 8000    # then open http://localhost:8000
```

## Deploy to Vercel
**Easiest (dashboard):** push this folder to a GitHub repo → import it at
[vercel.com/new](https://vercel.com/new) → deploy. No settings needed (it's static).

**CLI:**
```bash
npm i -g vercel
cd tormach-770m-gallery
vercel            # first run links/creates the project
vercel --prod     # promote to your public URL
```

## Make the QR code
After deploying, take your `https://….vercel.app` URL and generate a QR code
(e.g. qr-code-generator.com or `qrencode`). Print it on the machine poster.
