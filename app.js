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

/* Common (shared-pool) equipment photos live under images/common/... — one
   file works for every machine that stocks it — instead of images/<machineId>/...
   which is only correct for that one machine's own extras. `ns` is that
   folder namespace: "common" or a specific machine id. */
function imgSrc(ns, photo) {
  return photo ? `images/${ns}/${photo}` : null;
}

/* ---- shared-pool merge (440 + 770M pull from one common mill crib) ------
   Items/families from the common pool are tagged _shared:true so image
   lookups and anything else that cares can tell them apart from a specific
   machine's own extras. */
function equipmentFor(machine, categoryId) {
  const extras = (EQUIPMENT[machine.id]?.[categoryId] || []).map((it) => ({ ...it, _shared: false }));
  const common =
    machine.type === "mill"
      ? (COMMON_MILL_EQUIPMENT[categoryId] || []).map((it) => ({ ...it, _shared: true }))
      : [];
  return [...common, ...extras];
}

function familiesFor(machine, category) {
  const extras = (DATASETS[category.dataKey]?.[machine.id] || []).map((f) => ({ ...f, _shared: false }));
  const common =
    machine.type === "mill" && category.id === "endmills"
      ? COMMON_MILL_ENDMILL_FAMILIES.map((f) => ({ ...f, _shared: true }))
      : [];
  return [...common, ...extras];
}

function imgNamespace(machine, item) {
  return item._shared ? "common" : machine.id;
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

/* Keep these hex values in sync with the :root palette in styles.css —
   data-URI SVGs can't read CSS variables from the host page. */
function placeholderSVG(icon) {
  const glyph = ICONS[icon] || ICONS.misc;
  return (
    `data:image/svg+xml;utf8,` +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
        <defs>
          <pattern id="g" width="10" height="10" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1" fill="rgba(87,6,140,0.16)"/>
          </pattern>
        </defs>
        <rect width="100" height="100" fill="#f4effa"/>
        <rect width="100" height="100" fill="url(#g)"/>
        <g stroke="#57068c" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">${glyph}</g>
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
        _shared: fam._shared,
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
  const families = familiesFor(machine, category);
  const facetKeys = category.facets.map((f) => f.key);
  return buildDrilldownItems(families, facetKeys);
}

function formatFacetValue(key, val) {
  if (key === "flutes") return `${val}-Flute`;
  return String(val);
}

/* ---- Global search index (built once, used on the home page) ----------- */
let _searchIndex = null;
function searchIndex() {
  if (_searchIndex) return _searchIndex;
  const rows = [];
  MACHINES.forEach((machine) => {
    categoriesFor(machine).forEach((category) => {
      if (category.facets) {
        const facetKeys = category.facets.map((f) => f.key);
        drilldownItemsFor(machine, category).forEach((item) => {
          const qs = facetKeys
            .map((k) => `${k}=${encodeURIComponent(slugify(item.facets[k] || ""))}`)
            .join("&");
          rows.push({
            machine,
            category,
            item,
            href: `#/m/${machine.id}/${category.id}?${qs}`,
          });
        });
      } else {
        equipmentFor(machine, category.id).forEach((item) => {
          rows.push({
            machine,
            category,
            item,
            href: `#/m/${machine.id}/${category.id}/${item.id}`,
          });
        });
      }
    });
  });
  _searchIndex = rows;
  return rows;
}

/* ==========================================================================
   Router
   ========================================================================== */
function parseHash() {
  const raw = location.hash.replace(/^#\/?/, "");
  const [path] = raw.split("?");
  return path.split("/").filter(Boolean);
}

function hashQueryParams() {
  const raw = location.hash.replace(/^#\/?/, "");
  const [, search] = raw.split("?");
  return new URLSearchParams(search || "");
}

function go(hash) {
  location.hash = hash;
}

/* Close any open search dropdown when the user clicks outside its wrapper.
   Attached once at load — never re-added on re-render — since it lives on
   `document`, which persists across route changes. */
document.addEventListener("click", (e) => {
  document.querySelectorAll(".searchwrap").forEach((wrap) => {
    if (!wrap.contains(e.target)) {
      const dd = wrap.querySelector(".dropdown");
      if (dd) dd.innerHTML = "";
    }
  });
});

function topBar() {
  return `
    <div class="hero__bar">
      <a href="#/" class="hero__home">NYU MAKERSPACE</a>
      <span class="hero__status"><i></i> ONLINE</span>
    </div>`;
}

function crumbBar(items) {
  // items: [{label, href}] — last one is current (no link)
  const backHref = items.length > 1 ? items[items.length - 2].href : null;
  const back = backHref
    ? `<a class="backbtn" href="${backHref}" aria-label="Back">
        <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
        Back
      </a>`
    : "";
  const crumbs = `<nav class="crumbs">${items
    .map((it, i) =>
      i === items.length - 1
        ? `<span class="crumbs__here">${it.label}</span>`
        : `<a href="${it.href}">${it.label}</a><span class="crumbs__sep">/</span>`
    )
    .join("")}</nav>`;
  return `<div class="crumbrow">${back}${crumbs}</div>`;
}

function machineSwitcher(currentMachine) {
  const others = MACHINES.filter((m) => m.id !== currentMachine.id);
  return `
    <div class="switcher">
      <span class="switcher__label">Switch machine</span>
      <div class="switcher__chips">
        ${others.map((m) => `<a class="chip" href="#/m/${m.id}">${m.name}</a>`).join("")}
      </div>
    </div>`;
}

function goodToKnow(machine) {
  if (!machine.specs || !machine.specs.length) return "";
  return `
    <div class="goodtoknow">
      <svg class="goodtoknow__icon" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="9"/><path d="M12 11v5"/><path d="M12 8h.01"/>
      </svg>
      <div class="goodtoknow__body">
        <p class="goodtoknow__label">Good to know</p>
        <dl class="goodtoknow__grid">
          ${machine.specs.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join("")}
        </dl>
      </div>
    </div>`;
}

function render() {
  const segs = parseHash();
  window.scrollTo({ top: 0, behavior: "instant" in window.scrollTo ? "instant" : "auto" });

  if (segs.length === 0) return renderHome(hashQueryParams().get("q") || "");

  if (segs[0] === "m" && segs[1]) {
    const machine = machineById(segs[1]);
    if (!machine) return renderNotFound();

    if (segs.length === 2) return renderMachineHub(machine);

    const category = categoryById(machine, segs[2]);
    if (!category) return renderNotFound();

    if (category.facets) return renderFacetBrowser(machine, category);

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
      ${topBar()}
      ${crumbBar([{ label: "Home", href: "#/" }, { label: "Not found" }])}
      <div class="empty">That page doesn't exist. <a href="#/">Back home</a>.</div>
    </div>`;
}

function renderHome(initialQuery) {
  root.innerHTML = `
    <header class="hero">
      ${topBar()}
      <div class="hero__main">
        <p class="hero__eyebrow">CNC EQUIPMENT CATALOG</p>
        <h1>SELECT<span>MACHINE</span></h1>
        <p class="hero__sub">Scan the code on any machine, or pick it below, to see everything available for it — workholding, tool holders, cutting tools, and measuring gear.</p>
      </div>
    </header>
    <div class="page">
      <div class="controls controls--static">
        <div class="search">
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
          <input id="home-search" type="search" placeholder="Search all equipment across every machine…" autocomplete="off" />
        </div>
      </div>
      <div id="home-results"></div>
      <div id="mgrid-wrap">
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
    </div>
    <footer class="foot">
      <span>NYU Makerspace · CNC equipment catalog</span>
      <span>Return all tooling to its labeled home · Report damage to the CNC grad assistant</span>
    </footer>`;

  const input = document.getElementById("home-search");
  const results = document.getElementById("home-results");
  const mgridWrap = document.getElementById("mgrid-wrap");

  function doSearch(rawQuery) {
    const q = rawQuery.trim().toLowerCase();
    if (!q) {
      results.innerHTML = "";
      mgridWrap.style.display = "";
      return;
    }
    mgridWrap.style.display = "none";

    const matches = searchIndex().filter((row) =>
      [row.item.name, row.item.tagline, row.item.notes, row.machine.name, row.category.label]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );

    if (!matches.length) {
      results.innerHTML = `<p class="empty">No equipment matches “${escAttr(rawQuery)}”.</p>`;
      return;
    }

    results.innerHTML = `
      <div class="grid">
        ${matches
          .slice(0, 60)
          .map(
            (row, i) => `
          <a class="card" style="--i:${i}" href="${row.href}">
            <div class="card__img">
              ${imgTag(imgNamespace(row.machine, row.item), row.item.photo, row.item.icon, row.item.name)}
              <span class="card__code">${row.item.code || ""}</span>
            </div>
            <div class="card__body">
              <span class="card__cat">${row.machine.name} · ${row.category.label}</span>
              <h3 class="card__name">${row.item.name}</h3>
              <p class="card__tag">${row.item.tagline}</p>
            </div>
          </a>`
          )
          .join("")}
      </div>`;
  }

  input.addEventListener("input", (e) => doSearch(e.target.value));
  if (initialQuery) {
    input.value = initialQuery;
    doSearch(initialQuery);
  }
}

function renderMachineHub(machine) {
  const cats = categoriesFor(machine);
  root.innerHTML = `
    <header class="hero hero--sub">
      ${topBar()}
      ${crumbBar([{ label: "Home", href: "#/" }, { label: machine.name }])}
      <div class="hero__main hero__main--sub">
        <p class="hero__eyebrow">${machine.type === "lathe" ? "CNC LATHE" : "CNC MILL"} · ${machine.code}</p>
        <h1 class="h1--sub">${machine.name}</h1>
        <p class="hero__sub">${machine.tagline}</p>
      </div>
    </header>
    <div class="page">
      ${goodToKnow(machine)}
      <div class="controls controls--static">
        <div class="searchwrap">
          <div class="search">
            <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
            <input id="machine-search" type="search" placeholder="Search ${escAttr(machine.name)}…" autocomplete="off" />
          </div>
          <div class="dropdown" id="machine-search-dropdown"></div>
        </div>
      </div>
      <div class="cgrid">
        ${cats
          .map((c, i) => {
            const count = c.facets
              ? drilldownItemsFor(machine, c).length
              : equipmentFor(machine, c.id).length;
            return `
            <a class="ccard" style="--i:${i}" href="#/m/${machine.id}/${c.id}">
              <div class="ccard__icon"><svg viewBox="0 0 100 100" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round">${ICONS[c.icon]}</svg></div>
              <h3>${c.label}</h3>
              <span class="ccard__count">${count} item${count === 1 ? "" : "s"}</span>
            </a>`;
          })
          .join("")}
      </div>
      ${machineSwitcher(machine)}
    </div>`;

  const msInput = document.getElementById("machine-search");
  const msDropdown = document.getElementById("machine-search-dropdown");

  msInput.addEventListener("input", (e) => {
    const raw = e.target.value;
    const q = raw.trim().toLowerCase();
    if (!q) {
      msDropdown.innerHTML = "";
      return;
    }

    const matches = searchIndex().filter(
      (row) =>
        row.machine.id === machine.id &&
        [row.item.name, row.item.tagline, row.item.notes, row.category.label]
          .join(" ")
          .toLowerCase()
          .includes(q)
    );

    if (!matches.length) {
      msDropdown.innerHTML = `
        <a class="dropdown__row dropdown__row--global" href="#/?q=${encodeURIComponent(raw.trim())}">
          No matches on ${escAttr(machine.name)} for “${escAttr(raw.trim())}” — <strong>search all machines</strong> →
        </a>`;
      return;
    }

    msDropdown.innerHTML = matches
      .slice(0, 8)
      .map(
        (row) => `
      <a class="dropdown__row" href="${row.href}">
        <span class="dropdown__name">${row.item.name}</span>
        <span class="dropdown__cat">${row.category.label}</span>
      </a>`
      )
      .join("");
  });
}

/* ---- Flat category: grid + search -------------------------------------- */
function renderFlatGrid(machine, category) {
  const items = equipmentFor(machine, category.id);

  root.innerHTML = `
    <header class="hero hero--sub hero--tight">
      ${topBar()}
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
          ${imgTag(imgNamespace(machine, it), it.photo, it.icon, it.name)}
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
  const items = equipmentFor(machine, category.id);
  const item = items.find((it) => it.id === itemId);
  if (!item) return renderNotFound();

  root.innerHTML = `
    <header class="hero hero--sub hero--tight">
      ${topBar()}
      ${crumbBar([
        { label: "Home", href: "#/" },
        { label: machine.name, href: `#/m/${machine.id}` },
        { label: category.label, href: `#/m/${machine.id}/${category.id}` },
        { label: item.name },
      ])}
    </header>
    <div class="page">
      ${detailPanel(machine, item, category.label)}
    </div>`;
}

function detailPanel(machine, item, categoryLabel) {
  return `
    <div class="detail">
      <div class="detail__img">
        ${imgTag(imgNamespace(machine, item), item.photo, item.icon, item.name)}
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

/* ---- Faceted browser (End Mills / Turning Tools) --------------------------
   All facet rows (Type, Material, Diameter, Flutes...) are shown at once as
   multi-select toggle chips that narrow each other live, instead of forcing
   a sequential tap-through wizard. Results render as one card per Type+
   Material "family" with every matching size/flute listed inside it as a
   badge — since several brands can stock the same nominal spec, a card
   represents the SPEC, not a single photographable product.
   Selection state lives in the URL query string, e.g. ?type=flat&material=hss
   (comma-separated for multiple values in one facet), so results are
   shareable/bookmarkable and the browser back button works normally. */
function parseFacetSelections(facetKeys) {
  const params = hashQueryParams();
  const selections = {};
  facetKeys.forEach((k) => {
    const raw = params.get(k);
    selections[k] = raw ? raw.split(",").filter(Boolean) : [];
  });
  return selections;
}

function facetBrowserHref(machine, category, facetKeys, selections) {
  const qs = facetKeys
    .map((k) => (selections[k] && selections[k].length ? `${k}=${selections[k].join(",")}` : null))
    .filter(Boolean)
    .join("&");
  return `#/m/${machine.id}/${category.id}${qs ? "?" + qs : ""}`;
}

function itemMatchesAllFacets(item, facetKeys, selections) {
  return facetKeys.every((k) => {
    const sel = selections[k];
    if (!sel || !sel.length) return true;
    return sel.includes(slugify(item.facets[k] || ""));
  });
}

/* Distinct values (+ counts) available for `targetKey`, given the current
   selections on every OTHER facet — standard faceted-search narrowing. A
   count of 0 means "no results if you also picked this," shown disabled
   rather than hidden, so the filter bar doesn't jump around as you click. */
/* Distinct values (+ counts) available for `targetKey`, given the current
   selections on every OTHER facet. Values with zero remaining matches are
   left out entirely (rather than shown disabled) — Diameter/Flutes options
   vary a lot by Type (numbered drill sizes vs. fractional inches), so
   showing every value that ever exists, mostly disabled, would be noisier
   than just narrowing to what's actually reachable right now. */
function facetOptionCounts(allItems, facetKeys, selections, targetKey) {
  const filtered = allItems.filter((it) =>
    facetKeys.every((k) => {
      if (k === targetKey) return true;
      const sel = selections[k];
      if (!sel || !sel.length) return true;
      return sel.includes(slugify(it.facets[k] || ""));
    })
  );
  const options = new Map(); // slug -> {label, count}
  filtered.forEach((it) => {
    const val = it.facets[targetKey];
    if (val == null) return;
    const slug = slugify(val);
    const entry = options.get(slug) || { label: formatFacetValue(targetKey, val), count: 0 };
    entry.count++;
    options.set(slug, entry);
  });
  return options;
}

function renderFacetBrowser(machine, category) {
  const facetKeys = category.facets.map((f) => f.key);
  const allItems = drilldownItemsFor(machine, category);
  const selections = parseFacetSelections(facetKeys);
  const filtered = allItems.filter((it) => itemMatchesAllFacets(it, facetKeys, selections));
  const anyActive = facetKeys.some((k) => selections[k].length);

  const filterRows = category.facets
    .map((f) => {
      const options = facetOptionCounts(allItems, facetKeys, selections, f.key);
      const selectedSet = new Set(selections[f.key]);
      const sorted = Array.from(options.entries()).sort((a, b) =>
        a[1].label.localeCompare(b[1].label, undefined, { numeric: true })
      );
      const chips = sorted
        .map(([slug, { label, count }]) => {
          const isSel = selectedSet.has(slug);
          const isOff = count === 0 && !isSel;
          const next = { ...selections, [f.key]: isSel
            ? selections[f.key].filter((s) => s !== slug)
            : [...selections[f.key], slug] };
          const href = isOff ? null : facetBrowserHref(machine, category, facetKeys, next);
          return `<a class="fchip${isSel ? " fchip--on" : ""}${isOff ? " fchip--off" : ""}" ${href ? `href="${href}"` : 'aria-disabled="true"'}>${label}<span class="fchip__count">${count}</span></a>`;
        })
        .join("");
      return `
        <div class="frow">
          <span class="frow__label">${f.label}</span>
          <div class="frow__chips">${chips}</div>
        </div>`;
    })
    .join("");

  // Group results into one card per Type+Material family (facetKeys[0], [1])
  // — every category using this browser defines its first two facets that way.
  const groups = new Map();
  filtered.forEach((it) => {
    const gkey = slugify(it.facets[facetKeys[0]] || "") + "|" + slugify(it.facets[facetKeys[1]] || "");
    if (!groups.has(gkey)) groups.set(gkey, []);
    groups.get(gkey).push(it);
  });
  const badgeKeys = facetKeys.slice(2);

  const resultsHtml = groups.size
    ? Array.from(groups.values())
        .map((items) => {
          const sample = items[0];
          const badges = items
            .map((it) => {
              const label = badgeKeys
                .filter((k) => it.facets[k] != null)
                .map((k) => formatFacetValue(k, it.facets[k]))
                .join(" · ");
              return `<span class="fbadge">${label || "—"}</span>`;
            })
            .join("");
          return `
          <div class="fgroup">
            <div class="fgroup__icon"><svg viewBox="0 0 100 100" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round">${ICONS[sample.icon] || ICONS.misc}</svg></div>
            <div class="fgroup__body">
              <h3>${formatFacetValue(facetKeys[0], sample.facets[facetKeys[0]])} · ${formatFacetValue(facetKeys[1], sample.facets[facetKeys[1]])}</h3>
              <p class="fgroup__tag">${sample.tagline}</p>
              <div class="fgroup__badges">${badges}</div>
              <p class="fgroup__notes">${sample.notes}</p>
            </div>
          </div>`;
        })
        .join("")
    : `<p class="empty">No matches with these filters. <a href="#/m/${machine.id}/${category.id}">Clear filters</a>.</p>`;

  root.innerHTML = `
    <header class="hero hero--sub hero--tight">
      ${topBar()}
      ${crumbBar([
        { label: "Home", href: "#/" },
        { label: machine.name, href: `#/m/${machine.id}` },
        { label: category.label },
      ])}
      <h1 class="h1--cat">${category.label}</h1>
    </header>
    <div class="page">
      <div class="fbar">
        ${filterRows}
        ${anyActive ? `<a class="fclear" href="#/m/${machine.id}/${category.id}">Clear all filters</a>` : ""}
      </div>
      <p class="fcount">${filtered.length} matching item${filtered.length === 1 ? "" : "s"}</p>
      <div class="fgroups">${resultsHtml}</div>
    </div>`;
}
