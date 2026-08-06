# NYU Makerspace — CNC Equipment Catalog

A scan-to-view catalog covering three machines — **Tormach 440**, **Tormach
770M**, and the **Tormach 8L Lathe**. Someone scans the QR code on a machine
→ lands on that machine's page → drills into Workholding, Tool Holding,
End Mills / Turning Tools, Measuring, or Other, with specs and handling
notes for each piece of equipment.

Pure static site (HTML/CSS/JS) — no build step, no framework, no bundler.

## Navigation model

```
Home (pick a machine)
 └─ Machine hub (category tiles, e.g. Tormach 770M)
     ├─ Workholding / Tool Holding / Measuring / Other  → flat searchable grid → item detail
     └─ End Mills / Turning Tools                        → step wizard:
                                                             Type → Material → Size (→ Flutes)
                                                             → resolved item detail
```

It's a hash-routed single-page app, so every screen has a real, shareable,
bookmarkable URL and the browser back/forward buttons work normally. E.g.:

- `#/m/770` — 770M machine hub
- `#/m/770/workholding` — flat grid
- `#/m/770/workholding/vise-smw` — item detail
- `#/m/770/endmills/flat/hss/1-4in/4` — End Mills wizard, fully resolved
- `#/m/8l/turningtools/parting/hss/1-16in-blade` — Turning Tools wizard, resolved

You can point a QR code at any of these — e.g. straight at `#/m/770` if you
want the code on the 770 to skip the machine-select screen.

## Files
- `index.html` — thin shell; just mounts `<div id="app">` and loads the two scripts below
- `data.js` — **all machines, categories, and equipment live here.** This is the only file you need to edit for content changes.
- `app.js` — router + rendering logic. You shouldn't need to touch this to add equipment.
- `styles.css` — industrial blueprint theme
- `images/<machineId>/...` — real photos, organized per machine

## Shared mill equipment (440 + 770M)

The 440 and 770M stock mostly identical vises, TTS tool holders, and end
mills, so that common set lives **once** in `COMMON_MILL_EQUIPMENT` /
`COMMON_MILL_ENDMILL_FAMILIES` at the top of `data.js` and is shown on
**both** machine pages automatically. Edit it once, both mills update —
no more keeping two copies in sync.

`EQUIPMENT["440"]` / `EQUIPMENT["770"]` (and `ENDMILL_FAMILIES["440"]` /
`["770"]`) are only for **extras** — something one specific mill has that
the other doesn't. Leave those as `[]` if there's nothing extra.

The 8L Lathe doesn't need this — it's the only lathe, so its full
equipment set just lives in `EQUIPMENT["8l"]` directly.

## Add / edit equipment (flat categories)

Flat categories are: **Workholding** (and **Chucks & Workholding** for the
lathe), **Tool Holding**, **Measuring**, **Other**. Open `data.js` and add an
object to `COMMON_MILL_EQUIPMENT.workholding` (shared by both mills) or
`EQUIPMENT["440"].workholding` / `EQUIPMENT["8l"].chucks` (machine-specific):

```js
{
  id: "vise-smw",
  name: "SMW Vise",
  code: "WH-02",
  icon: "vise",              // vise | toolholder | measuring | endmill | misc
  photo: "",                 // "workholding/smw-vise.jpg" once added — see below
  tagline: "Saunders Machine Works modular vise",
  specs: [["Type", "Modular"], ["Use", "Repeatable fixturing"]],
  notes: "Handling / usage notes shown in the detail view.",
}
```

## Add / edit End Mills or Turning Tools (the wizard categories)

These are generated, not hand-listed one-by-one. In `data.js`, find
`COMMON_MILL_ENDMILL_FAMILIES` (shared by both mills), `ENDMILL_FAMILIES`
(mill-specific extras), or `TURNING_FAMILIES` (lathe). Each **family** is
one Type + Material combo; list every size (and flute count, for end mills)
you actually stock as a `variants` entry — each variant becomes one leaf item
in the wizard:

```js
{
  type: "Flat",
  material: "Carbide",
  tagline: "Square-nose · faster feeds, harder materials",
  photo: "",                 // one representative photo for the whole family
  notes: "Handling notes shown on every size/flute variant of this family.",
  variants: [
    { diameter: "1/8\"", flutes: 2 },
    { diameter: "1/4\"", flutes: 4 },
  ],
}
```

To add a brand-new **Type** (e.g. a chamfer mill), just add a new family
object — it shows up as a new chip in Step 1 automatically. To add a new
**size** to an existing type/material, just add another entry to `variants`.

## Add a new machine

1. Add an entry to `MACHINES` in `data.js` (id, name, type: `"mill"` or `"lathe"`, code, tagline, specs).
2. Add its equipment under `EQUIPMENT["<your-id>"]` for each flat category (see `CATEGORY_DEFS` for which categories exist per machine type).
3. If it's a mill, add `ENDMILL_FAMILIES["<your-id>"]`. If it's a lathe, add `TURNING_FAMILIES["<your-id>"]`.

No changes to `app.js` needed — the router and UI are fully data-driven.

## Add your own photos

See `images/README.md` for the full guide. Short version:

1. **Shared 440/770M equipment** (almost everything — vises, TTS holders, end mills) goes in `images/common/`. One photo shows up on both machine pages automatically.
2. **Machine-only extras** (something one specific machine has that the other doesn't, or anything on the 8L) go in that machine's own folder: `images/440/`, `images/770/`, `images/8l/`.
3. In `data.js`, set that item's (or family's) `photo` field to the path relative to its folder — e.g. `photo: "smw-vise.jpg"` for a shared item.
4. Leave `photo: ""` and a blueprint placeholder icon is drawn automatically — handy while you're still collecting photos.

Shoot roughly square-to-portrait (4:5 to 1:1), subject centered with margin
— the same photo gets cropped into both a 4:3 grid thumbnail and a square
detail view. Keep each file under ~500KB (`sips -Z 900 -s formatOptions 70
photo.jpg --out out.jpg` on Mac) so the page stays fast on phones over
makerspace wifi.

For **End Mills / Turning Tools**, one photo per *family* (Type + Material) is
usually enough — you don't need a separate photo for every diameter.

## Preview locally
```bash
cd tormach-770m-gallery
python3 -m http.server 8000    # then open http://localhost:8000
```

## Deploy

This repo is already connected to GitHub
(`github.com/brycemiranda/tormach-770m-gallery`) and deployed on Vercel.
Vercel auto-redeploys on every push to `main`:

```bash
git add -A
git commit -m "Add equipment photos"
git push
```

No Vercel settings are needed — it's a static site with no build step.

## Make the QR code
Take your live `.vercel.app` URL (optionally with a `#/m/770`-style deep
link) and generate a QR code (e.g. qr-code-generator.com or `qrencode`).
Print it on the machine poster.
