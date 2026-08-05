/* ==========================================================================
   NYU Makerspace — CNC Equipment Catalog · DATA FILE
   --------------------------------------------------------------------------
   This is the ONLY file you need to touch to add machines, categories,
   equipment, or photos. See README.md for the full guide. Quick version:

   PHOTOS
   ------
   Put image files under  images/<machineId>/<category>/<filename>.jpg
   then set an item's `photo` field to  "<category>/<filename>.jpg"
   (relative to that machine's image folder). Leave `photo: ""` to get an
   automatic blueprint placeholder instead — handy while you're still
   collecting real photos.

   FLAT CATEGORIES (Workholding, Tool Holding, Measuring, Other, Chucks)
   -----------------------------------------------------------------------
   Just add an object to the relevant array in EQUIPMENT[machineId][category].

   DRILLDOWN CATEGORIES (End Mills, Turning Tools)
   -----------------------------------------------------------------------
   These use a step-wizard: Type -> Material -> Size (-> Flutes for mills).
   Add a "family" (one Type+Material combo) to ENDMILL_FAMILIES /
   TURNING_FAMILIES, and list every size/flute `variant` you actually stock
   inside it. Each variant becomes one leaf item in the wizard.
   ========================================================================== */

/* ---- Machines ------------------------------------------------------------ */
const MACHINES = [
  {
    id: "440",
    name: "Tormach 440",
    type: "mill",
    code: "MILL-440",
    tagline: "Desktop 3-axis mill · R8 spindle",
    photo: "",
    specs: [
      ["Footprint", "Benchtop"],
      ["Spindle", "R8"],
      ["Travel", "X10\" · Y6.5\" · Z10.5\""],
    ],
  },
  {
    id: "770",
    name: "Tormach 770M",
    type: "mill",
    code: "MILL-770",
    tagline: "3-axis mill · R8 spindle · shop workhorse",
    photo: "",
    specs: [
      ["Footprint", "Floor-standing"],
      ["Spindle", "R8"],
      ["Travel", "X30\" · Y16\" · Z16\""],
    ],
  },
  {
    id: "8l",
    name: "Tormach 8L Lathe",
    type: "lathe",
    code: "LATHE-8L",
    tagline: "CNC lathe · turning, facing, boring",
    photo: "",
    specs: [
      ["Swing", "8\" over bed"],
      ["Spindle", "A2-5 camlock"],
      ["Bed length", "~20\""],
    ],
  },
];

/* ---- Category definitions per machine type -------------------------------
   `facets` present => rendered as a step-wizard (drilldown).
   `facets` absent  => rendered as a flat searchable/filterable grid.        */
const CATEGORY_DEFS = {
  mill: [
    { id: "workholding", label: "Workholding", icon: "vise" },
    { id: "toolholding", label: "Tool Holding", icon: "toolholder" },
    {
      id: "endmills",
      label: "End Mills",
      icon: "endmill",
      dataKey: "ENDMILL_FAMILIES",
      facets: [
        { key: "type", label: "Type" },
        { key: "material", label: "Material" },
        { key: "diameter", label: "Diameter" },
        { key: "flutes", label: "Flutes" },
      ],
    },
    { id: "measuring", label: "Measuring", icon: "measuring" },
    { id: "other", label: "Other", icon: "misc" },
  ],
  lathe: [
    { id: "chucks", label: "Chucks & Workholding", icon: "vise" },
    { id: "toolholding", label: "Tool Holding", icon: "toolholder" },
    {
      id: "turningtools",
      label: "Turning Tools",
      icon: "endmill",
      dataKey: "TURNING_FAMILIES",
      facets: [
        { key: "type", label: "Type" },
        { key: "material", label: "Material" },
        { key: "size", label: "Size" },
      ],
    },
    { id: "measuring", label: "Measuring", icon: "measuring" },
    { id: "other", label: "Other", icon: "misc" },
  ],
};

/* ---- Flat-category equipment, per machine --------------------------------
   Shape: EQUIPMENT[machineId][categoryId] = [ {id,name,code,tagline,photo,specs,notes,icon}, ... ]
   ========================================================================== */
const EQUIPMENT = {
  /* =========================== 770M =========================== */
  "770": {
    workholding: [
      {
        id: "vise-standard",
        name: "Standard Vise",
        code: "WH-01",
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
    ],
    toolholding: [
      {
        id: "tts-drill-chuck",
        name: "TTS Drill Chuck",
        code: "TH-01",
        icon: "toolholder",
        photo: "",
        tagline: "Keyless chuck on a TTS shank",
        specs: [
          ["System", "TTS (Tormach Tooling System)"],
          ["Grip", "Keyless chuck, round shanks"],
          ["Use", "Twist drills, center drills"],
        ],
        notes:
          "Quick-change drill chuck on a TTS holder — same repeatable Z height as every other TTS tool once set with the ETS. Hand-tighten firmly; don't over-torque the sleeve.",
      },
      {
        id: "tts-solid-allen",
        name: "TTS Solid Holder (Set-Screw)",
        code: "TH-02",
        icon: "toolholder",
        photo: "",
        tagline: "Rigid holder, tightened with an allen key",
        specs: [
          ["System", "TTS (Tormach Tooling System)"],
          ["Grip", "Hex set-screw onto shank flat"],
          ["Use", "Rigid end mill holding"],
        ],
        notes:
          "A solid TTS holder that grips the end mill's shank directly via a set-screw, tightened with an allen/hex key. Stiffer than a collet for heavier cuts — make sure the set-screw lands on the shank's flat if it has one.",
      },
      {
        id: "tts-er20",
        name: "TTS ER20 Collet Holder",
        code: "TH-03",
        icon: "toolholder",
        photo: "",
        tagline: "Collet holder for round-shank tooling",
        specs: [
          ["System", "TTS (Tormach Tooling System)"],
          ["Collet", "ER20"],
          ["Range", "~1/8\"–1/2\" (collet-dependent)"],
        ],
        notes:
          "The most flexible TTS holder — swap ER20 collets to match whatever shank size you're running. Use the spanner to seat the collet nut; don't cross-thread it.",
      },
    ],
    measuring: [
      {
        id: "optical-edge-finder",
        name: "Optical Edge Finder",
        code: "ME-01",
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
    ],
    other: [
      {
        id: "ets",
        name: "ETS — Electronic Tool Setter",
        code: "OT-01",
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
    ],
  },

  /* =========================== 440 ===========================
     Placeholder starter set — edit specs/photos to match your actual crib. */
  "440": {
    workholding: [
      {
        id: "440-vise-standard",
        name: "Standard Vise",
        code: "WH-01",
        icon: "vise",
        photo: "",
        tagline: "General-purpose milling vise (440-scale)",
        specs: [
          ["Type", "Fixed-jaw precision vise"],
          ["Use", "Prismatic / flat stock"],
          ["Note", "EDIT ME — confirm size/model"],
        ],
        notes: "Placeholder entry — swap in the real vise details and a photo for the 440's vise.",
      },
      {
        id: "440-vise-small",
        name: "Small Vise",
        code: "WH-02",
        icon: "vise",
        photo: "",
        tagline: "Compact vise for the 440's smaller table",
        specs: [
          ["Type", "Compact milling vise"],
          ["Use", "Small parts"],
          ["Note", "EDIT ME — confirm size/model"],
        ],
        notes: "Placeholder entry — update once confirmed.",
      },
    ],
    toolholding: [
      {
        id: "440-tts-drill-chuck",
        name: "TTS Drill Chuck",
        code: "TH-01",
        icon: "toolholder",
        photo: "",
        tagline: "Keyless chuck on a TTS shank",
        specs: [
          ["System", "TTS"],
          ["Grip", "Keyless chuck"],
          ["Use", "Twist drills"],
        ],
        notes: "Same TTS system as the 770 — placeholder, confirm the 440's actual holder set.",
      },
      {
        id: "440-tts-er20",
        name: "TTS ER20 Collet Holder",
        code: "TH-02",
        icon: "toolholder",
        photo: "",
        tagline: "Collet holder for round-shank tooling",
        specs: [
          ["System", "TTS"],
          ["Collet", "ER20"],
          ["Range", "~1/8\"–1/2\""],
        ],
        notes: "Placeholder — confirm collet range actually stocked for this machine.",
      },
    ],
    measuring: [
      {
        id: "440-dial-indicator",
        name: "Dial Indicator",
        code: "ME-01",
        icon: "measuring",
        photo: "",
        tagline: "Tramming & indicating",
        specs: [
          ["Reads", "0.001\" increments"],
          ["Use", "Tram vise / indicate parts"],
        ],
        notes: "Placeholder — shared style with the 770's indicator.",
      },
    ],
    other: [],
  },

  /* =========================== 8L Lathe ===========================
     Placeholder starter set — this machine's peripherals weren't detailed
     yet, so everything here is a stand-in. Replace with your real chucks,
     tool posts, and centers. */
  "8l": {
    chucks: [
      {
        id: "8l-3jaw",
        name: "3-Jaw Self-Centering Chuck",
        code: "CH-01",
        icon: "vise",
        photo: "",
        tagline: "Fast-clamping chuck for round stock",
        specs: [
          ["Type", "Scroll, self-centering"],
          ["Use", "Round / hex stock"],
          ["Note", "EDIT ME — confirm size (e.g. 6\"/8\")"],
        ],
        notes: "Placeholder — confirm exact chuck model, size, and jaw sets available.",
      },
      {
        id: "8l-4jaw",
        name: "4-Jaw Independent Chuck",
        code: "CH-02",
        icon: "vise",
        photo: "",
        tagline: "Independent jaws for off-center / irregular work",
        specs: [
          ["Type", "Independent 4-jaw"],
          ["Use", "Irregular / off-axis parts"],
          ["Note", "Requires indicating in"],
        ],
        notes: "Placeholder — each jaw adjusts independently; part must be dial-indicated true before running.",
      },
    ],
    toolholding: [
      {
        id: "8l-qctp",
        name: "Quick-Change Tool Post",
        code: "TH-01",
        icon: "toolholder",
        photo: "",
        tagline: "Swap turning tool holders fast",
        specs: [
          ["Type", "Quick-change (QCTP)"],
          ["Use", "Mounts turning tool holders"],
          ["Note", "EDIT ME — confirm post style (e.g. AXA/BXA)"],
        ],
        notes: "Placeholder — confirm the actual tool post size/brand on the 8L.",
      },
      {
        id: "8l-boring-bar-holder",
        name: "Boring Bar Holder",
        code: "TH-02",
        icon: "toolholder",
        photo: "",
        tagline: "Holds boring bars for internal turning",
        specs: [
          ["Type", "Boring bar block"],
          ["Use", "Internal bores"],
        ],
        notes: "Placeholder — confirm shank size(s) supported.",
      },
    ],
    measuring: [
      {
        id: "8l-caliper",
        name: "Digital Caliper",
        code: "ME-01",
        icon: "measuring",
        photo: "",
        tagline: "OD / ID / depth measurement",
        specs: [
          ["Reads", "0.0005\" / 0.01mm"],
          ["Use", "Check turned diameters"],
        ],
        notes: "Placeholder — confirm shop caliper make/model kept at the lathe.",
      },
      {
        id: "8l-center",
        name: "Live Center",
        code: "ME-02",
        icon: "measuring",
        photo: "",
        tagline: "Tailstock support for long stock",
        specs: [
          ["Type", "Rotating (live) center"],
          ["Use", "Support long / slender turning"],
        ],
        notes: "Placeholder — confirm taper (e.g. MT2/MT3) fitted to the tailstock.",
      },
    ],
    other: [],
  },
};

/* ---- End Mill families — MILLS ONLY --------------------------------------
   facets order for mills: type -> material -> diameter -> flutes
   Each `variants` entry is one leaf item in the wizard. List only the
   sizes/flute-counts you actually stock.                                   */
const ENDMILL_FAMILIES = {
  "770": [
    {
      type: "Flat",
      material: "HSS",
      tagline: "Square-nose · slots, pockets, profiles",
      icon: "endmill",
      photo: "",
      extraSpecs: [["Nose", "Square (flat)"]],
      notes:
        "The default cutter for flat-bottomed features and straight walls. Match diameter and flute count to material. Inspect the corners for chipping before use.",
      variants: [
        { diameter: "1/8\"", flutes: 2 },
        { diameter: "1/8\"", flutes: 4 },
        { diameter: "1/4\"", flutes: 2 },
        { diameter: "1/4\"", flutes: 4 },
        { diameter: "3/8\"", flutes: 4 },
        { diameter: "1/2\"", flutes: 4 },
      ],
    },
    {
      type: "Flat",
      material: "Carbide",
      tagline: "Square-nose · faster feeds, harder materials",
      icon: "endmill",
      photo: "",
      extraSpecs: [["Nose", "Square (flat)"]],
      notes:
        "Runs faster and holds an edge longer than HSS, but is more brittle — avoid interrupted cuts and side-loading. Good for aluminum and harder steels alike.",
      variants: [
        { diameter: "1/8\"", flutes: 2 },
        { diameter: "1/4\"", flutes: 2 },
        { diameter: "1/4\"", flutes: 4 },
        { diameter: "3/8\"", flutes: 4 },
        { diameter: "1/2\"", flutes: 4 },
      ],
    },
    {
      type: "Ball",
      material: "HSS",
      tagline: "Ball-nose · 3D & contoured surfaces",
      icon: "endmill",
      photo: "",
      extraSpecs: [["Nose", "Ball (radiused)"]],
      notes:
        "For curved and 3D surfacing. Smaller stepovers give a finer finish but longer cycles. Not for sharp inside corners or flat floors — use a flat end mill there.",
      variants: [
        { diameter: "1/8\"", flutes: 2 },
        { diameter: "1/4\"", flutes: 2 },
        { diameter: "3/8\"", flutes: 2 },
      ],
    },
    {
      type: "Ball",
      material: "Carbide",
      tagline: "Ball-nose · fine finish 3D surfacing",
      icon: "endmill",
      photo: "",
      extraSpecs: [["Nose", "Ball (radiused)"]],
      notes:
        "Same use case as the HSS ball mill but stiffer and more chip-resistant at higher RPM — preferred for fine-finish 3D work.",
      variants: [
        { diameter: "1/8\"", flutes: 2 },
        { diameter: "1/4\"", flutes: 4 },
        { diameter: "3/8\"", flutes: 4 },
      ],
    },
    {
      type: "Center Drill",
      material: "HSS",
      tagline: "Spot-drill before drilling",
      icon: "endmill",
      photo: "",
      extraSpecs: [["Style", "Combined drill / countersink"]],
      notes:
        "Spot the hole location first so the twist drill doesn't wander. Short and rigid — use a shallow peck. Don't try to drill deep with it.",
      variants: [
        { diameter: "#00" },
        { diameter: "#0" },
        { diameter: "#1" },
        { diameter: "#2" },
        { diameter: "#3" },
      ],
    },
    {
      type: "Edge Finder",
      material: "Steel",
      tagline: "Mechanical wiggler for X/Y zero",
      icon: "endmill",
      photo: "",
      extraSpecs: [["Contact", "Mechanical (spinning)"]],
      notes:
        "Spin it, feed slowly into the edge until the tip kicks out concentric, then offset by the known tip radius. Lives with the end-mill / edge-finding kit.",
      variants: [{ diameter: "3/8\" body" }],
    },
  ],

  /* 440 — smaller, edit to match actual crib */
  "440": [
    {
      type: "Flat",
      material: "HSS",
      tagline: "Square-nose · slots, pockets, profiles",
      icon: "endmill",
      photo: "",
      extraSpecs: [["Nose", "Square (flat)"]],
      notes: "Placeholder set — confirm actual sizes stocked for the 440.",
      variants: [
        { diameter: "1/8\"", flutes: 2 },
        { diameter: "1/4\"", flutes: 2 },
        { diameter: "1/4\"", flutes: 4 },
      ],
    },
    {
      type: "Ball",
      material: "HSS",
      tagline: "Ball-nose · 3D & contoured surfaces",
      icon: "endmill",
      photo: "",
      extraSpecs: [["Nose", "Ball (radiused)"]],
      notes: "Placeholder set — confirm actual sizes stocked for the 440.",
      variants: [
        { diameter: "1/8\"", flutes: 2 },
        { diameter: "1/4\"", flutes: 2 },
      ],
    },
    {
      type: "Center Drill",
      material: "HSS",
      tagline: "Spot-drill before drilling",
      icon: "endmill",
      photo: "",
      notes: "Placeholder set — confirm actual sizes stocked for the 440.",
      variants: [{ diameter: "#0" }, { diameter: "#1" }, { diameter: "#2" }],
    },
    {
      type: "Edge Finder",
      material: "Steel",
      tagline: "Mechanical wiggler for X/Y zero",
      icon: "endmill",
      photo: "",
      notes: "Placeholder set.",
      variants: [{ diameter: "3/8\" body" }],
    },
  ],
};

/* ---- Turning tool families — LATHE ONLY -----------------------------------
   facets order for lathe: type -> material -> size
   All placeholder — this machine's tooling wasn't detailed yet.            */
const TURNING_FAMILIES = {
  "8l": [
    {
      type: "Turning (OD)",
      material: "Carbide Insert",
      tagline: "General outside-diameter turning",
      icon: "endmill",
      photo: "",
      notes: "Placeholder — confirm insert grade/shape actually stocked (e.g. CCMT, DCMT).",
      variants: [{ size: "1/4\" shank" }, { size: "3/8\" shank" }],
    },
    {
      type: "Facing",
      material: "Carbide Insert",
      tagline: "Squares off part ends",
      icon: "endmill",
      photo: "",
      notes: "Placeholder — confirm insert grade/shape.",
      variants: [{ size: "1/4\" shank" }, { size: "3/8\" shank" }],
    },
    {
      type: "Parting",
      material: "HSS",
      tagline: "Cuts off / grooves stock",
      icon: "endmill",
      photo: "",
      notes: "Placeholder — confirm blade width(s) available.",
      variants: [{ size: "1/16\" blade" }, { size: "3/32\" blade" }],
    },
    {
      type: "Boring",
      material: "Carbide Insert",
      tagline: "Enlarges / finishes internal bores",
      icon: "endmill",
      photo: "",
      notes: "Placeholder — confirm minimum bore diameter reachable per bar.",
      variants: [{ size: "3/8\" bar" }, { size: "1/2\" bar" }],
    },
  ],
};
