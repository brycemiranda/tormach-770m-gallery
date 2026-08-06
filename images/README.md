# Photos go here — two kinds of folders

```
images/
  common/            <- shared by BOTH the 440 and 770M (vises, TTS holders, end mills, etc.)
    workholding/...
    toolholding/...
    endmills/...
    measuring/...
    other/...
  440/               <- ONLY for something the 440 has that the 770 doesn't
    ...
  770/               <- ONLY for something the 770 has that the 440 doesn't (e.g. its mounted SMW jaws)
    workholding/...
  8l/                <- the lathe has no shared machine, so everything lives here
    chucks/...
    toolholding/...
    turningtools/...
    measuring/...
```

**Most photos go in `common/`.** Almost everything on the 440/770M pages
(vises, TTS holders, end mills) is the literal same physical tool shared
by both machines, defined once in `data.js` under `COMMON_MILL_EQUIPMENT` /
`COMMON_MILL_ENDMILL_FAMILIES`. One photo there shows up on both machine
pages automatically — you never need to upload it twice.

Only use the `440/` or `770/` folders for something that machine has and
the other one doesn't (a genuine "extra" in `data.js`).

Then in `data.js`, set that item's (or End Mill/Turning Tool family's)
`photo` field to the path **relative to its folder**:

```js
photo: "smw-vise.jpg"        // shared item -> images/common/smw-vise.jpg
photo: "flat-hss.jpg"        // shared End Mill family -> images/common/flat-hss.jpg (one photo covers every size)
photo: "jaws.jpg"            // a 770-only extra -> images/770/jaws.jpg
```

Tips:
- Shoot roughly square to 4:5 (portrait-ish), subject centered with margin — the same photo gets cropped into a 4:3 grid thumbnail AND a square detail view, so tight/wide crops lose part of the tool in one of the two.
- Keep filenames lowercase with dashes: `cylindrical-vise.jpg`.
- JPG or PNG both work. Resize/compress before adding — e.g. on Mac: `sips -Z 900 -s formatOptions 70 photo.jpg --out out.jpg` — aim for well under 500 KB so the page loads fast on phones.
- Leave `photo: ""` on any item and a blueprint placeholder is drawn automatically — no broken images while you're still collecting photos.
