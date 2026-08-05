/* ==========================================================================
   NYU Makerspace — CNC Equipment Catalog
   Hash-routed SPA: Home -> Machine -> Category -> (wizard facets) -> Item
   Data lives in data.js. This file is rendering + routing logic only.
   ========================================================================== */

const root = document.getElementById("app");

/* ---- helpers --------------------------------------------------------- */
function slugify(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/"/g, "in")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function escAttr(s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function machineById(id) {
  return MACHINES.find((m) => m.id === id);
}

function categoriesFor(machine) {
  return CATEGORY_DEFS[machine.type] || [];
}

function categoryById(machine, catId) {
  return categoriesFor(machine).find((c) => c.id === catId);
}

function imgSrc(machineId, photo) {
  return photo ? `images/${machineId}/${photo}` : null;
}

/* ---- blueprint placeholder art ----------------------------------------- */
const ICONS = {
  vise: `<path d="M14 44h72M22 44V26h24v18M50 44V30h20v14M22 26h24M30 20h8v6h-8z" fill="none"/><path d="M6 40h10v8H6zM84 40h10v8H84z" fill="none"/><path d="M16 44l4-4M84 44l-4-4" fill="none"/>`,
  toolholder: `<path d="M40 8h20v10H40zM44 18h12v8H44zM38 26h24l-6 44H44z" fill="none"/><path d="M44 26v44M56 26v44M48 26v44M52 26v44" fill="none" stroke-dasharray="2 4"/>`,
  measuring: `<circle cx="50" cy="34" r="22" fill="none"/><path d="M50 34l10-12M50 16v6M50 46v6M28 34h6M66 34h6" fill="none"/><path d="M50 56v24M44 80h12" fill="none"/>`,
  endmill: `<path d="M44 6h12v40H44z" fill="none"/><path d="M44 46l3 44M56 46l-3 44M50 46v44" fill="none"/><path d="M44 54l12 4M44 64l12 4M44 74l12 4M44 84l12 4" fill="none"/>`,
  misc: `<path d="M20 30h30v14H20zM50 24h26v26H50z" fill="none"/><circle cx="34" cy="66" r="10" fill="none"/><path d="M58 60h18v16H58z" fill="none"/><path d="M34 60v-6M34 76v6" fill="none"/>`,
  mill: `<path d="M10 78h80M20 78V50h20V30h20v20h10v28M40 30V16h10v14" fill="none"/><path d="M50 16v-8" fill="none"/>`,
  lathe: `<path d="M8 60h84M16 60V44h14v16M70 60V38h18v22" fill="none"/><circle cx="70" cy="49" r="7" fill="none"/><path d="M30 44v-8h8v8" fill="none"/>`,
};

function placeholderSVG(icon) {
  const glyph = ICONS[icon] || ICONS.misc;
  return (
    `data:image/svg+xml;utf8,` +
    encodeURIComponent(
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
    )
  );
}

function imgTag(machineId, photo, icon, alt, extraClass) {
  const real = imgSrc(machineId, photo);
  const fallback = placeholderSVG(icon);
  const src = real || fallback;
  return `<img class="${extraClass || ""}" src="${src}" alt="${escAttr(alt)}" loading="lazy" onerror="this.onerror=null;this.src='${fallback}'">`;
}

/* ---- drilldown item generation ----------------------------------------
   Expands each family's `variants` into one leaf item per variant, using
   the category's facet key order (facetKeys[0]=type, [1]=material, rest
   come from the variant object itself, e.g. {diameter, flutes} or {size}). */
function buildDrilldownItems(families, facetKeys) {
  const items = [];
  (families || []).forEach((fam) => {
    (fam.variants || [{}]).forEach((variant) => {
      const facets = {};
      facetKeys.forEach((key) => {
        if (key === "type") facets[key] = fam.type;
        else if (key === "material") facets[key] = fam.material;
        else if (variant[key] != null) facets[key] = variant[key];
      });
      const idParts = facetKeys.map((k) => slugify(facets[k] || ""));
      const nameParts = facetKeys
        .filter((k) => facets[k])
        .map((k) => formatFacetValue(k, facets[k]));
      items.push({
        id: idParts.join("__"),
        facets,
        icon: fam.icon,
        photo: fam.photo,
        name: nameParts.join(" · "),
        tagline: fam.tagline,
        specs: [
          ...facetKeys
            .filter((k) => facets[k])
            .map((k) => [
              CATEGORY_LABELS_FOR_FACET[k] || k,
              formatFacetValue(k, facets[k]),
            ]),
          ...(fam.extraSpecs || []),
        ],
        notes: fam.notes,
      });
    });
  });
  return items;
}
const CATEGORY_LABELS_FOR_FACET = {
  type: "Type",
  material: "Material",
  diameter: "Diameter",
  flutes: "Flutes",
  size: "Size",
};

const DATASETS = { ENDMILL_FAMILIES, TURNING_FAMILIES };

function drilldownItemsFor(machine, category) {
  const families = DATASETS[category.dataKey]?.[machine.id] || [];
  const facetKeys = category.facets.map((f) => f.key);
  return buildDrilldownItems(families, facetKeys);
}

function formatFacetValue(key, val) {
  if (key === "flutes") return `${val}-Flute`;
  return String(val);
}

function itemMatchesSelections(item, facetKeys, selections) {
  for (let i = 0; i < selections.length; i++) {
    if (slugify(item.facets[facetKeys[i]] || "") !== selections[i]) return false;
  }
  return true;
}

/* ==========================================================================
   Router
   ========================================================================== */
function parseHash() {
  const raw = location.hash.replace(/^#\/?/, "");
  const [path] = raw.split("?");
  return path.split("/").filter(Boolean);
}

function go(hash) {
  location.hash = hash;
}

function crumbBar(items) {
  // items: [{label, href}] — last one is current (no link)
  return `<nav class="crumbs">${items
    .map((it, i) =>
      i === items.length - 1
        ? `<span class="crumbs__here">${it.label}</span>`
        : `<a href="${it.href}">${it.label}</a><span class="crumbs__sep">/</span>`
    )
    .join("")}</nav>`;
}

function render() {
  const segs = parseHash();
  window.scrollTo({ top: 0, behavior: "instant" in window.scrollTo ? "instant" : "auto" });

  if (segs.length === 0) return renderHome();

  if (segs[0] === "m" && segs[1]) {
    const machine = machineById(segs[1]);
    if (!machine) return renderNotFound();

    if (segs.length === 2) return renderMachineHub(machine);

    const category = categoryById(machine, segs[2]);
    if (!category) return renderNotFound();

    if (category.facets) return renderWizard(machine, category, segs.slice(3));

    if (segs.length === 4) return renderFlatDetail(machine, category, segs[3]);
    return renderFlatGrid(machine, category);
  }

  renderNotFound();
}

window.addEventListener("hashchange", render);
window.addEventListener("DOMContentLoaded", render);

/* ==========================================================================
   Views
   ========================================================================== */
function renderNotFound() {
  root.innerHTML = `
    <div class="page">
      ${crumbBar([{ label: "Home", href: "#/" }, { label: "Not found" }])}
      <div class="empty">That page doesn't exist. <a href="#/">Back home</a>.</div>
    </div>`;
}

function renderHome() {
  root.innerHTML = `
    <header class="hero">
      <div class="hero__bar">
        <span class="hero__loc">NYU MAKERSPACE</span>
        <span class="hero__status"><i></i> ONLINE</span>
      </div>
      <div class="hero__main">
        <p class="hero__eyebrow">CNC EQUIPMENT CATALOG</p>
        <h1>SELECT<span>MACHINE</span></h1>
        <p class="hero__sub">Scan the code on any machine, or pick it below, to see everything available for it — workholding, tool holders, cutting tools, and measuring gear.</p>
      </div>
    </header>
    <div class="page">
      <div class="mgrid">
        ${MACHINES.map(
          (m, i) => `
          <a class="mcard" style="--i:${i}" href="#/m/${m.id}">
            <div class="mcard__img">
              ${imgTag(m.id, m.photo, m.type, m.name)}
              <span class="card__code">${m.code}</span>
            </div>
            <div class="mcard__body">
              <h2>${m.name}</h2>
              <p>${m.tagline}</p>
            </div>
          </a>`
        ).join("")}
      </div>
    </div>
    <footer class="foot">
      <span>NYU Makerspace · CNC equipment catalog</span>
      <span>Return all tooling to its labeled home · Report damage to the CNC grad assistant</span>
    </footer>`;
}

function renderMachineHub(machine) {
  const cats = categoriesFor(machine);
  root.innerHTML = `
    <header class="hero hero--sub">
      <div class="hero__bar">
        <span class="hero__loc">NYU MAKERSPACE</span>
        <span class="hero__status"><i></i> ONLINE</span>
      </div>
      ${crumbBar([{ label: "Home", href: "#/" }, { label: machine.name }])}
      <div class="hero__main hero__main--sub">
        <p class="hero__eyebrow">${machine.type === "lathe" ? "CNC LATHE" : "CNC MILL"} · ${machine.code}</p>
        <h1 class="h1--sub">${machine.name}</h1>
        <p class="hero__sub">${machine.tagline}</p>
      </div>
      <div class="hero__meta">
        ${machine.specs.map(([k, v]) => `<span>${k}: <b>${v}</b></span>`).join("")}
      </div>
    </header>
    <div class="page">
      <div class="cgrid">
        ${cats
          .map((c, i) => {
            const count = c.facets
              ? drilldownItemsFor(machine, c).length
              : (EQUIPMENT[machine.id]?.[c.id] || []).length;
            return `
            <a class="ccard" style="--i:${i}" href="#/m/${machine.id}/${c.id}">
              <div class="ccard__icon"><svg viewBox="0 0 100 100" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round">${ICONS[c.icon]}</svg></div>
              <h3>${c.label}</h3>
              <span class="ccard__count">${count} item${count === 1 ? "" : "s"}</span>
            </a>`;
          })
          .join("")}
      </div>
    </div>`;
}

/* ---- Flat category: grid + search -------------------------------------- */
function renderFlatGrid(machine, category) {
  const items = EQUIPMENT[machine.id]?.[category.id] || [];

  root.innerHTML = `
    <header class="hero hero--sub hero--tight">
      ${crumbBar([
        { label: "Home", href: "#/" },
        { label: machine.name, href: `#/m/${machine.id}` },
        { label: category.label },
      ])}
      <h1 class="h1--cat">${category.label}</h1>
    </header>
    <div class="page">
      <div class="controls controls--static">
        <div class="search">
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
          <input id="search" type="search" placeholder="Search ${category.label.toLowerCase()}…" autocomplete="off" />
        </div>
      </div>
      <div id="grid" class="grid"></div>
    </div>`;

  const grid = document.getElementById("grid");
  const searchInput = document.getElementById("search");

  function draw(query) {
    const q = (query || "").trim().toLowerCase();
    const filtered = !q
      ? items
      : items.filter((it) =>
          [it.name, it.tagline, it.notes, it.code].join(" ").toLowerCase().includes(q)
        );

    if (!filtered.length) {
      grid.innerHTML = `<p class="empty">No matches${q ? ` for “${query}”` : ""}.</p>`;
      return;
    }

    grid.innerHTML = filtered
      .map(
        (it, i) => `
      <a class="card" style="--i:${i}" href="#/m/${machine.id}/${category.id}/${it.id}">
        <div class="card__img">
          ${imgTag(machine.id, it.photo, it.icon, it.name)}
          <span class="card__code">${it.code}</span>
        </div>
        <div class="card__body">
          <span class="card__cat">${category.label}</span>
          <h3 class="card__name">${it.name}</h3>
          <p class="card__tag">${it.tagline}</p>
        </div>
      </a>`
      )
      .join("");
  }

  draw("");
  searchInput.addEventListener("input", (e) => draw(e.target.value));
}

function renderFlatDetail(machine, category, itemId) {
  const items = EQUIPMENT[machine.id]?.[category.id] || [];
  const item = items.find((it) => it.id === itemId);
  if (!item) return renderNotFound();

  root.innerHTML = `
    <div class="page">
      ${crumbBar([
        { label: "Home", href: "#/" },
        { label: machine.name, href: `#/m/${machine.id}` },
        { label: category.label, href: `#/m/${machine.id}/${category.id}` },
        { label: item.name },
      ])}
      ${detailPanel(machine, item, category.label)}
    </div>`;
}

function detailPanel(machine, item, categoryLabel) {
  return `
    <div class="detail">
      <div class="detail__img">
        ${imgTag(machine.id, item.photo, item.icon, item.name)}
        <span class="card__code">${item.code || ""}</span>
      </div>
      <div class="detail__info">
        <span class="card__cat">${categoryLabel}</span>
        <h2>${item.name}</h2>
        <p class="modal__tag">${item.tagline}</p>
        <dl class="spec">
          ${item.specs.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join("")}
        </dl>
        <p class="modal__notes">${item.notes}</p>
      </div>
    </div>`;
}

/* ---- Drilldown wizard (End Mills / Turning Tools) ----------------------- */
function renderWizard(machine, category, selections) {
  const facetKeys = category.facets.map((f) => f.key);
  const allItems = drilldownItemsFor(machine, category);
  const filtered = allItems.filter((it) => itemMatchesSelections(it, facetKeys, selections));

  const crumbs = [
    { label: "Home", href: "#/" },
    { label: machine.name, href: `#/m/${machine.id}` },
    { label: category.label, href: `#/m/${machine.id}/${category.id}` },
  ];
  selections.forEach((sel, i) => {
    const prefixItems = allItems.filter((it) =>
      itemMatchesSelections(it, facetKeys, selections.slice(0, i))
    );
    const match = prefixItems.find((it) => slugify(it.facets[facetKeys[i]] || "") === sel);
    const label = match ? formatFacetValue(facetKeys[i], match.facets[facetKeys[i]]) : sel;
    crumbs.push({
      label,
      href: `#/m/${machine.id}/${category.id}/${selections.slice(0, i + 1).join("/")}`,
    });
  });

  root.innerHTML = `
    <header class="hero hero--sub hero--tight">
      ${crumbBar(crumbs)}
      <h1 class="h1--cat">${category.label}</h1>
    </header>
    <div class="page" id="wizard-body"></div>`;

  const body = document.getElementById("wizard-body");

  // All facets chosen -> show the resolved item(s)
  if (selections.length >= facetKeys.length) {
    if (!filtered.length) {
      body.innerHTML = `<p class="empty">No match. <a href="#/m/${machine.id}/${category.id}">Start over</a>.</p>`;
      return;
    }
    body.innerHTML = filtered
      .map((it) => detailPanel(machine, it, category.label))
      .join('<div style="height:16px"></div>');
    return;
  }

  const nextKey = facetKeys[selections.length];
  const nextLabel = category.facets[selections.length].label;

  // distinct values available for the next facet, given prior selections
  const seen = new Map(); // slug -> label
  filtered.forEach((it) => {
    const val = it.facets[nextKey];
    if (val != null) seen.set(slugify(val), formatFacetValue(nextKey, val));
  });

  if (!seen.size) {
    body.innerHTML = `<p class="empty">No options here yet. <a href="#/m/${machine.id}/${category.id}">Start over</a>.</p>`;
    return;
  }

  const stepNum = selections.length + 1;
  const stepTotal = facetKeys.length;

  body.innerHTML = `
    <div class="wizard">
      <div class="wizard__step">STEP ${stepNum} / ${stepTotal} — CHOOSE ${nextLabel.toUpperCase()}</div>
      <div class="wizard__chips">
        ${Array.from(seen.entries())
          .map(
            ([slug, label]) =>
              `<a class="chip chip--lg" href="#/m/${machine.id}/${category.id}/${[...selections, slug].join("/")}">${label}</a>`
          )
          .join("")}
      </div>
      <p class="wizard__count">${filtered.length} matching item${filtered.length === 1 ? "" : "s"} so far</p>
    </div>`;
}
