/* ==========================================================================
   Tormach 770M — Equipment & Peripherals
   NYU Makerspace · scan-to-view catalog
   --------------------------------------------------------------------------
   HOW TO ADD REAL PHOTOS:
   Drop a photo into /images and set the item's `photo` field to its filename,
   e.g. photo: "smw-vise.jpg". If `photo` is empty, a blueprint placeholder
   is drawn automatically. That's the only change you need to make.
   ========================================================================== */

const EQUIPMENT = [
  /* ---- VISES & WORKHOLDING ------------------------------------------------ */
  {
    id: "vise-standard",
    name: "Standard Vise",
    code: "WH-01",
    category: "Workholding",
    icon: "vise",
    photo: "",
    tagline: "General-purpose milling vise",
    specs: [
      ["Type", "Fixed-jaw precision vise"],
      ["Use", "Prismatic / flat stock"],
      ["Pair with", "Parallels + soft jaws"],
    ],
    notes:
      "The everyday workhorse. Clamp on the flats, seat the part on parallels, and tap it down before the final tighten. Keep the ways and jaws clean of chips.",
  },
  {
    id: "vise-smw",
    name: "SMW Vise",
    code: "WH-02",
    category: "Workholding",
    icon: "vise",
    photo: "",
    tagline: "Saunders Machine Works modular vise",
    specs: [
      ["Type", "Modular / dovetail workholding"],
      ["Use", "Repeatable fixturing"],
      ["Feature", "Quick-swap jaws"],
    ],
    notes:
      "Modular system — great for repeatable setups and multi-part jobs. Confirm which jaw set is installed before zeroing. Return jaws and hardware to the SMW kit when done.",
  },
  {
    id: "vise-small",
    name: "Smaller Vise",
    code: "WH-03",
    category: "Workholding",
    icon: "vise",
    photo: "",
    tagline: "Compact vise for small parts",
    specs: [
      ["Type", "Compact milling vise"],
      ["Use", "Small / delicate parts"],
      ["Benefit", "Clears short tools"],
    ],
    notes:
      "Lower profile and lighter than the standard vise. Ideal for tiny stock where the big vise gets in the way of short tooling and Z clearance.",
  },
  {
    id: "vise-cylindrical",
    name: "Cylindrical Vise",
    code: "WH-04",
    category: "Workholding",
    icon: "vise",
    photo: "",
    tagline: "Holds round & odd-shaped stock",
    specs: [
      ["Type", "Round-stock / rotational vise"],
      ["Use", "Cylindrical & irregular parts"],
      ["Feature", "V-jaws for round grip"],
    ],
    notes:
      "Grips round bar and awkward geometry that a flat vise can't hold securely. Seat the part fully in the V and verify it can't spin under cutting load.",
  },
  {
    id: "workholding-bits",
    name: "Workholding Bits",
    code: "WH-05",
    category: "Workholding",
    icon: "misc",
    photo: "",
    tagline: "Clamps, parallels, step blocks & hardware",
    specs: [
      ["Includes", "Parallels, step blocks"],
      ["Includes", "Toe clamps, T-nuts, studs"],
      ["Includes", "Soft jaws & spacers"],
    ],
    notes:
      "The bin of supporting hardware for fixturing straight to the table or dressing a vise. Count parts back into the kit so nothing walks off.",
  },

  /* ---- TOOL HOLDING & SETTING -------------------------------------------- */
  {
    id: "tts-holder",
    name: "TTS Tool Holder",
    code: "TH-01",
    category: "Tool Holding",
    icon: "toolholder",
    photo: "",
    tagline: "Tormach Tooling System holders",
    specs: [
      ["System", "TTS (3/4\" shank)"],
      ["Use", "Quick tool changes"],
      ["Types", "End mill, collet, drill chuck"],
    ],
    notes:
      "Repeatable-height quick-change holders. Set tool length once with the ETS and it stays consistent across swaps. Keep the R8 collet and holder shanks clean.",
  },
  {
    id: "ets",
    name: "ETS — Electronic Tool Setter",
    code: "TH-02",
    category: "Tool Holding",
    icon: "measuring",
    photo: "",
    tagline: "Tormach automatic tool-length setter",
    specs: [
      ["Type", "Touch-off tool setter"],
      ["Sets", "Tool length offsets (Z)"],
      ["Interface", "PathPilot"],
    ],
    notes:
      "Touches each tool off automatically to set its length offset. Place on the table, run the routine in PathPilot, then remove and store it before cutting. Never cut over it.",
  },

  /* ---- MEASURING & EDGE FINDING ------------------------------------------ */
  {
    id: "optical-edge-finder",
    name: "Optical Edge Finder",
    code: "ME-01",
    category: "Measuring",
    icon: "measuring",
    photo: "",
    tagline: "Non-contact edge & feature locating",
    specs: [
      ["Type", "Optical (non-contact)"],
      ["Use", "Locate edges / scribed lines"],
      ["Benefit", "No part deflection"],
    ],
    notes:
      "Sight down onto the edge to set X/Y zero without touching the part — good for finished or delicate surfaces. Keep the lens clean and the spindle stopped while sighting.",
  },
  {
    id: "dial-indicator",
    name: "Dial Indicator",
    code: "ME-02",
    category: "Measuring",
    icon: "measuring",
    photo: "",
    tagline: "Tramming, indicating & runout",
    specs: [
      ["Reads", "0.001\" increments"],
      ["Use", "Tram vise / indicate parts"],
      ["Pair with", "Magnetic base / holder"],
    ],
    notes:
      "Sweep to tram the vise square, indicate a bore, or check runout. Handle gently — don't slam the plunger. Return it to its padded case after use.",
  },

  /* ---- END MILLS ---------------------------------------------------------- */
  {
    id: "endmill-flat",
    name: "Flat End Mill",
    code: "EM-01",
    category: "End Mills",
    icon: "endmill",
    photo: "",
    tagline: "Square-nose · slots, pockets, profiles",
    specs: [
      ["Nose", "Square (flat)"],
      ["Use", "Slots, pockets, side milling"],
      ["Note", "Flat floors & vertical walls"],
    ],
    notes:
      "The default cutter for flat-bottomed features and straight walls. Match diameter and flute count to material. Inspect the corners for chipping before use.",
  },
  {
    id: "endmill-ball",
    name: "Ball End Mill",
    code: "EM-02",
    category: "End Mills",
    icon: "endmill",
    photo: "",
    tagline: "Ball-nose · 3D & contoured surfaces",
    specs: [
      ["Nose", "Ball (radiused)"],
      ["Use", "3D contours, fillets, sculpting"],
      ["Note", "Leaves scallops — step over fine"],
    ],
    notes:
      "For curved and 3D surfacing. Smaller stepovers give a finer finish but longer cycles. Not for sharp inside corners or flat floors — use a flat end mill there.",
  },
  {
    id: "endmill-center-drill",
    name: "Center Drill",
    code: "EM-03",
    category: "End Mills",
    icon: "endmill",
    photo: "",
    tagline: "Spot-drill before drilling",
    specs: [
      ["Type", "Combined drill / countersink"],
      ["Use", "Start / locate a hole"],
      ["Benefit", "Keeps drills from walking"],
    ],
    notes:
      "Spot the hole location first so the twist drill doesn't wander. Short and rigid — use a shallow peck. Don't try to drill deep with it.",
  },
  {
    id: "edge-finder-mechanical",
    name: "Edge Finder",
    code: "EM-04",
    category: "End Mills",
    icon: "endmill",
    photo: "",
    tagline: "Mechanical wiggler for X/Y zero",
    specs: [
      ["Type", "Mechanical (contact)"],
      ["Use", "Set X/Y edge zero"],
      ["Spin", "~1000 RPM, feed to kick-out"],
    ],
    notes:
      "Spin it, feed slowly into the edge until the tip kicks out concentric, then offset by the known tip radius. Lives with the end-mill / edge-finding kit.",
  },
];

/* ==========================================================================
   Blueprint placeholder art — drawn when an item has no `photo`.
   ========================================================================== */
const ICONS = {
  vise: `<path d="M14 44h72M22 44V26h24v18M50 44V30h20v14M22 26h24M30 20h8v6h-8z" fill="none"/><path d="M6 40h10v8H6zM84 40h10v8H84z" fill="none"/><path d="M16 44l4-4M84 44l-4-4" fill="none"/>`,
  toolholder: `<path d="M40 8h20v10H40zM44 18h12v8H44zM38 26h24l-6 44H44z" fill="none"/><path d="M44 26v44M56 26v44M48 26v44M52 26v44" fill="none" stroke-dasharray="2 4"/>`,
  measuring: `<circle cx="50" cy="34" r="22" fill="none"/><path d="M50 34l10-12M50 16v6M50 46v6M28 34h6M66 34h6" fill="none"/><path d="M50 56v24M44 80h12" fill="none"/>`,
  endmill: `<path d="M44 6h12v40H44z" fill="none"/><path d="M44 46l3 44M56 46l-3 44M50 46v44" fill="none"/><path d="M44 54l12 4M44 64l12 4M44 74l12 4M44 84l12 4" fill="none"/>`,
  misc: `<path d="M20 30h30v14H20zM50 24h26v26H50z" fill="none"/><circle cx="34" cy="66" r="10" fill="none"/><path d="M58 60h18v16H58z" fill="none"/><path d="M34 60v-6M34 76v6" fill="none"/>`,
};

function placeholderSVG(item) {
  const glyph = ICONS[item.icon] || ICONS.misc;
  return `data:image/svg+xml;utf8,` + encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
      <defs>
        <pattern id="g" width="10" height="10" patternUnits="userSpaceOnUse">
          <path d="M10 0H0V10" fill="none" stroke="rgba(255,180,0,0.10)" stroke-width="0.5"/>
        </pattern>
      </defs>
      <rect width="100" height="100" fill="#16181a"/>
      <rect width="100" height="100" fill="url(#g)"/>
      <g stroke="#ffb400" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">${glyph}</g>
    </svg>`
  );
}

/* ==========================================================================
   Rendering
   ========================================================================== */
const grid = document.getElementById("grid");
const filterBar = document.getElementById("filters");
const searchInput = document.getElementById("search");
const countEl = document.getElementById("count");

const CATEGORIES = ["All", ...Array.from(new Set(EQUIPMENT.map((e) => e.category)))];
let activeCategory = "All";
let query = "";

function matches(item) {
  const inCat = activeCategory === "All" || item.category === activeCategory;
  const q = query.trim().toLowerCase();
  const inQuery =
    !q ||
    [item.name, item.category, item.tagline, item.code, item.notes]
      .join(" ")
      .toLowerCase()
      .includes(q);
  return inCat && inQuery;
}

function render() {
  const items = EQUIPMENT.filter(matches);
  countEl.textContent = `${items.length} / ${EQUIPMENT.length}`;
  grid.innerHTML = "";

  if (!items.length) {
    grid.innerHTML = `<p class="empty">No equipment matches “${query}”.</p>`;
    return;
  }

  items.forEach((item, i) => {
    const src = item.photo ? `images/${item.photo}` : placeholderSVG(item);
    const card = document.createElement("article");
    card.className = "card";
    card.style.setProperty("--i", i);
    card.tabIndex = 0;
    card.innerHTML = `
      <div class="card__img">
        <img src="${src}" alt="${item.name}" loading="lazy"
             onerror="this.src='${placeholderSVG(item)}'">
        <span class="card__code">${item.code}</span>
      </div>
      <div class="card__body">
        <span class="card__cat">${item.category}</span>
        <h3 class="card__name">${item.name}</h3>
        <p class="card__tag">${item.tagline}</p>
      </div>`;
    card.addEventListener("click", () => openModal(item));
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openModal(item);
      }
    });
    grid.appendChild(card);
  });
}

function renderFilters() {
  CATEGORIES.forEach((cat) => {
    const btn = document.createElement("button");
    btn.className = "chip" + (cat === activeCategory ? " chip--on" : "");
    btn.textContent = cat;
    btn.addEventListener("click", () => {
      activeCategory = cat;
      document.querySelectorAll(".chip").forEach((c) => c.classList.remove("chip--on"));
      btn.classList.add("chip--on");
      render();
    });
    filterBar.appendChild(btn);
  });
}

/* ---- Detail modal -------------------------------------------------------- */
const modal = document.getElementById("modal");
const modalBody = document.getElementById("modal-body");

function openModal(item) {
  const src = item.photo ? `images/${item.photo}` : placeholderSVG(item);
  modalBody.innerHTML = `
    <div class="modal__img">
      <img src="${src}" alt="${item.name}" onerror="this.src='${placeholderSVG(item)}'">
      <span class="card__code">${item.code}</span>
    </div>
    <div class="modal__info">
      <span class="card__cat">${item.category}</span>
      <h2>${item.name}</h2>
      <p class="modal__tag">${item.tagline}</p>
      <dl class="spec">
        ${item.specs.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join("")}
      </dl>
      <p class="modal__notes">${item.notes}</p>
    </div>`;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

modal.addEventListener("click", (e) => {
  if (e.target === modal || e.target.closest("[data-close]")) closeModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});
searchInput.addEventListener("input", (e) => {
  query = e.target.value;
  render();
});

renderFilters();
render();
