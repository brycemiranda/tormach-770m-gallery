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

   SHARED MILL EQUIPMENT (440 + 770M)
   -----------------------------------------------------------------------
   The two mills stock mostly identical vises, TTS tool holders, and end
   mills. That common set lives ONCE in COMMON_MILL_EQUIPMENT /
   COMMON_MILL_ENDMILL_FAMILIES and is shown on BOTH machine pages
   automatically — edit it once, both mills update. EQUIPMENT[machineId] /
   ENDMILL_FAMILIES[machineId] are for EXTRAS one specific mill has that the
   other doesn't (leave as [] if there's nothing extra).

   FLAT CATEGORIES (Workholding, Tool Holding, Measuring, Other, Chucks)
   -----------------------------------------------------------------------
   Just add an object to the relevant array (COMMON_MILL_EQUIPMENT for
   shared mill gear, EQUIPMENT[machineId] for machine-specific extras/lathe).

   DRILLDOWN CATEGORIES (End Mills, Turning Tools)
   -----------------------------------------------------------------------
   These use a step-wizard: Type -> Material -> Size (-> Flutes for mills).
   Add a "family" (one Type+Material combo) to COMMON_MILL_ENDMILL_FAMILIES
   (shared) / ENDMILL_FAMILIES[machineId] (mill-specific extra) /
   TURNING_FAMILIES (lathe), and list every size/flute `variant` you
   actually stock inside it. Each variant becomes one leaf item in the wizard.
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

/* ---- Common mill equipment ------------------------------------------------
   The 440 and 770M share almost all the same workholding, TTS tool holders,
   and measuring gear. Put anything BOTH mills stock here — it automatically
   shows up on both machine pages. Use EQUIPMENT["440"]/["770"] below ONLY
   for equipment that machine has and the other doesn't.
   ========================================================================== */
const COMMON_MILL_EQUIPMENT = {
    workholding: [
      {
        id: "vise-standard",
        name: "Standard Vise (6\")",
        code: "WH-01",
        icon: "vise",
        photo: "workholding/vise-standard-6inch.jpg",
        tagline: "General-purpose milling vise",
        specs: [
          ["Type", "Fixed-jaw precision vise"],
          ["Jaw width", "6\""],
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
        photo: "workholding/vise-smw.jpg",
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
        name: "Smaller Vise (4\")",
        code: "WH-03",
        icon: "vise",
        photo: "workholding/vise-small-4inch.jpg",
        tagline: "Compact vise for small parts",
        specs: [
          ["Type", "Compact milling vise"],
          ["Jaw width", "4\""],
          ["Use", "Small / delicate parts"],
          ["Benefit", "Clears short tools"],
        ],
        notes:
          "Lower profile and lighter than the standard vise. Ideal for tiny stock where the big vise gets in the way of short tooling and Z clearance.",
      },
      /* NOT CURRENTLY STOCKED — uncomment and add a photo when acquired.
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
      */
      /* NOT CURRENTLY STOCKED — uncomment and add a photo when acquired.
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
      */
      {
        id: "rotary-table-4th-axis",
        name: "4\" Rotary Table (with DRO)",
        code: "WH-04",
        icon: "vise",
        photo: "workholding/rotary-table-4inch.jpg",
        tagline: "Rotary indexing for cylindrical & angled features",
        specs: [
          ["Type", "4\" rotary table"],
          ["Readout", "Built-in DRO"],
          ["Use", "Indexed holes, radial features, wrapped profiles"],
        ],
        notes:
          "Mounts across the table to add rotary indexing — good for bolt-hole patterns, radial slots, or engraving around a cylindrical part. Confirm centerline height and tailstock support before running long stock. The onboard DRO is for manual reference only, not a substitute for zeroing in the controller.",
      },
      {
        id: "rotary-table-dividing-plate",
        name: "Dividing Plate (for Rotary Table)",
        code: "WH-05",
        icon: "misc",
        photo: "workholding/rotary-table-dividing-plate.jpg",
        tagline: "Manual index plate accessory for the rotary table",
        specs: [
          ["Type", "Dividing/index plate"],
          ["Use", "Manual rotary indexing without CNC control"],
          ["Pair with", "4\" Rotary Table"],
        ],
        notes:
          "Drops into the rotary table for manual hole-circle indexing when you're not driving the axis by CNC. Confirm the plate's hole-circle count matches what your layout needs before setup.",
      },
      {
        id: "rotary-table-tailstock",
        name: "Rotary Table Tailstock",
        code: "WH-06",
        icon: "misc",
        photo: "workholding/tailstock-rotary-table.jpg",
        tagline: "Support for the far end of longer stock",
        specs: [
          ["Type", "Tailstock"],
          ["Use", "Supports long stock during 4th-axis work"],
          ["Pair with", "4\" Rotary Table"],
        ],
        notes:
          "Supports the far end of longer stock during rotary/4th-axis work, the same idea as a lathe tailstock. Align its center to the rotary table's axis before clamping in the part.",
      },
      {
        id: "123-blocks",
        name: "1-2-3 Blocks (Pair)",
        code: "WH-07",
        icon: "misc",
        photo: "workholding/123-blocks.jpg",
        tagline: "Precision-ground setup blocks",
        specs: [
          ["Size", "1\" × 2\" × 3\""],
          ["Use", "Setups, spacing, squaring, fixturing"],
          ["Qty on hand", "2"],
        ],
        notes:
          "Precision-ground reference blocks for squaring up work, propping parts to height, or bolting together as a quick fixture (most sets are drilled/tapped). Handle by the faces, not the edges, to protect the ground finish.",
      },
      /* NOT CURRENTLY STOCKED — uncomment and add a photo when acquired.
      {
        id: "vise-stop-kit",
        name: "Vise Stop Kit",
        code: "WH-09",
        icon: "misc",
        photo: "",
        tagline: "Repeatable stop for vise-mounted stock",
        specs: [
          ["Type", "Adjustable vise stop"],
          ["Use", "Repeatable part-to-part positioning"],
        ],
        notes:
          "Clamps to the vise to give repeatable stock positioning across multiple parts — set it once, load/unload against the stop instead of re-indicating every part.",
      },
      */
      {
        id: "parallels-boxed-set",
        name: "Parallels (Boxed Set)",
        code: "WH-08",
        icon: "misc",
        photo: "workholding/parallels-boxed-set.jpg",
        tagline: "Matched precision parallel set",
        specs: [
          ["Type", "Precision ground parallels"],
          ["Use", "Elevate/support work in the vise"],
        ],
        notes:
          "The dedicated matched-pair boxed set — keep pairs together and pick matching heights so the part doesn't rock. Distinct from the loose parallels in Workholding Bits; return this set to its own box.",
      },
    ],
    toolholding: [
      {
        id: "tts-drill-chuck",
        name: "TTS Drill Chuck (1/4\")",
        code: "TH-01",
        icon: "toolholder",
        photo: "toolholding/tts-drill-chuck.webp",
        tagline: "Keyless chuck on a TTS shank",
        specs: [
          ["System", "TTS (Tormach Tooling System)"],
          ["Capacity", "1/4\""],
          ["Grip", "Keyless chuck, round shanks"],
          ["Use", "Twist drills, center drills"],
        ],
        notes:
          "Quick-change drill chuck on a TTS holder — same repeatable Z height as every other TTS tool once set with the ETS. Hand-tighten firmly; don't over-torque the sleeve.",
      },
      {
        id: "tts-solid-allen",
        name: "TTS Solid Holder (1/4\" Set-Screw)",
        code: "TH-02",
        icon: "toolholder",
        photo: "toolholding/tts-setscrew-holder-1-4inch.webp",
        tagline: "Rigid holder, tightened with an allen key",
        specs: [
          ["System", "TTS (Tormach Tooling System)"],
          ["Shank size", "1/4\""],
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
        photo: "toolholding/tts-er20.jpg",
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
      {
        id: "machinist-squares-kit",
        name: "Machinist Squares Kit",
        code: "ME-03",
        icon: "measuring",
        photo: "",
        tagline: "Squares for checking perpendicularity",
        specs: [
          ["Type", "Precision machinist square set"],
          ["Use", "Check vise/part squareness, layout"],
        ],
        notes:
          "For checking that a vise, fixture, or part face is truly square before you commit to a cut. Handle by the beam, not the blade edge, and wipe clean before storing.",
      },
      {
        id: "height-gauge-granite",
        name: "Height Gauge (Vertical Caliper) + Granite Bases",
        code: "ME-04",
        icon: "measuring",
        photo: "",
        tagline: "Precision height measurement on a granite surface plate",
        specs: [
          ["Type", "Vertical (height) caliper"],
          ["Surface", "Granite surface plate bases ×2"],
          ["Use", "Height measurement, layout scribing"],
        ],
        notes:
          "A spare height gauge kept with two granite surface-plate bases for a flat, stable reference surface. Keep the granite clean and free of chips — a single embedded chip will throw off every reading taken on it.",
      },
    ],
    other: [
      {
        id: "ets",
        name: "ETS — Electronic Tool Setter",
        code: "OT-01",
        icon: "measuring",
        photo: "",
        tagline: "Tormach auto tool-measuring probe",
        specs: [
          ["Type", "Touch-off tool setter"],
          ["Sets", "Tool length offsets (Z)"],
          ["Interface", "PathPilot"],
        ],
        notes:
          "Touches each tool off automatically to set its length offset. Place on the table, run the routine in PathPilot, then remove and store it before cutting. Never cut over it.",
      },
    ],
};

/* ---- Per-machine EXTRAS only ----------------------------------------------
   Flat-category equipment that ONE specific machine has beyond the common
   mill pool above (440/770), or the 8L's full equipment set (no common pool
   needed — it's the only lathe). Shape:
     EQUIPMENT[machineId][categoryId] = [ {id,name,code,tagline,photo,specs,notes,icon}, ... ]
   Leave a machine's category as [] if it has nothing beyond the common set.
   ========================================================================== */
const EQUIPMENT = {
  "770": {
    workholding: [
      {
        id: "770-smw-jaws-mounted",
        name: "SMW Jaws (Mounted)",
        code: "WH-X1",
        icon: "vise",
        photo: "",
        tagline: "Currently-installed jaw set for this machine's SMW Vise",
        specs: [
          ["Fits", "SMW Vise"],
          ["Status", "Mounted on the 770"],
        ],
        notes:
          "The jaw set currently mounted in the 770's SMW Vise. If you swap jaws for a job, put these back on before you leave so the next person's zero isn't thrown off.",
      },
    ],
    toolholding: [],
    measuring: [],
    other: [],
  },

  /* 440 has nothing beyond the common mill pool right now — add anything
     that's 440-only here (e.g. a smaller vise unique to its table). */
  "440": {
    workholding: [],
    toolholding: [],
    measuring: [],
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
      {
        id: "8l-5c-collet-set",
        name: "5C Round Collet Set (35 Pcs.) - Inch",
        code: "CH-03",
        icon: "vise",
        photo: "",
        tagline: "35-piece 5C round collet set, 1/16\"–1-1/8\"",
        specs: [
          ["Range", "1/16\" – 1-1/8\" nominal (1/32\" increments)"],
          ["Runout", "< .0005 in. TIR"],
          ["Clamping range", "+0 / -.004 in."],
          ["Construction", "Precision ground, hardened spring steel"],
          ["PN", "34727"],
        ],
        notes:
          "Full 35-piece 5C collet set for precise round-stock holding — use with the 5C collet chuck/closer for repeatable, low-runout work. Wipe collets clean before seating; a chip between the collet and stock will throw off both runout and grip. Stored in its wooden case — return each collet to its labeled slot.",
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
      {
        id: "8l-micrometer",
        name: "Micrometer",
        code: "ME-03",
        icon: "measuring",
        photo: "",
        tagline: "High-precision OD measurement",
        specs: [
          ["Reads", "0.0001 in. increments (typical)"],
          ["Use", "Precise OD checks on turned diameters"],
        ],
        notes:
          "Use for final-precision diameter checks where the digital caliper isn't tight enough — e.g. confirming a press-fit or slip-fit tolerance. Zero it before use and store it in its case, not loose in a drawer.",
      },
      {
        id: "8l-dial-indicator-holder-kit",
        name: "Dial Indicator Holder Kit",
        code: "ME-04",
        icon: "measuring",
        photo: "",
        tagline: "Mounting kit for indicating work in the lathe (×2 on hand)",
        specs: [
          ["Includes", "Magnetic base / mounting arm"],
          ["Use", "Mount a dial indicator to check runout/trueness"],
          ["Qty on hand", "2"],
        ],
        notes:
          "Holds a dial indicator against the spindle, chuck, or tailstock to check runout before you trust a setup — especially after switching to the 4-jaw chuck. Two kits are on hand so you don't have to wait if one's in use.",
      },
    ],
    other: [],
  },
};

/* ---- End Mill families — MILLS ONLY --------------------------------------
   facets order for mills: type -> material -> diameter -> flutes
   Each `variants` entry is one leaf item in the wizard. List only the
   sizes/flute-counts you actually stock.                                   */
/* ---- Common mill end mill families — shared by 440 + 770 ------------------
   facets order for mills: type -> material -> diameter -> flutes
   Each `variants` entry is one leaf item in the wizard. This is the shared
   crib both mills stock from. Use ENDMILL_FAMILIES below only for a family
   ONE specific mill has that the other doesn't.                            */
const COMMON_MILL_ENDMILL_FAMILIES = [
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
];

/* ---- Per-mill EXTRA end mill families --------------------------------------
   Only families ONE specific mill has beyond the common pool above. Leave a
   machine's array empty if it has nothing beyond the shared crib.          */
const ENDMILL_FAMILIES = {
  "770": [],
  "440": [],
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
