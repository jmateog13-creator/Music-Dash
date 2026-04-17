// ============================================================================
// quiz-inject.js — Music Dash (preguntas + niveles + villano) para PolyDash
// ============================================================================
(function () {
  // ================= NIVELES =================
  const LEVELS = [
    // 1 — Fàcil
    { name: "Aurora",    diff: "Fàcil",   bgTop: "#1e3a8a", bgBot: "#06b6d4", accent: "#fde047", villain: "🦇", villainColor: "#fde047", taunts: [
      "Ha, ha, saps llegir un pentagrama?",
      "A veure si endevines aquesta, mortal.",
      "Tens oïda o només orelles?",
      "Si falles, cauràs a l'abisme...",
      "Petit músic! Resol o pateix."
    ]},
    // 2 — Una mica més complicat
    { name: "Bosc",      diff: "Moderat", bgTop: "#1a472a", bgBot: "#22c55e", accent: "#86efac", villain: "🐺", villainColor: "#86efac", taunts: [
      "Grrrr... els dèbils no passen del bosc.",
      "Creus que pots amb mi? Ingenu.",
      "El bosc és fosc i ple de trampes.",
      "Respon ràpid o et menjo!",
      "Auuuuuu! Mala sort, petit músic."
    ]},
    // 3 — Normal
    { name: "Jungla",    diff: "Normal",  bgTop: "#14532d", bgBot: "#fde047", accent: "#22c55e", villain: "🐍", villainColor: "#22c55e", taunts: [
      "Sssegueixes viu? Ja ho veurem...",
      "La jungla es menja els ignorants.",
      "Compassos? Jo em menjo els errors.",
      "Aixxxò et costarà, nano.",
      "Demostra el teu ritme o seràs berenar!"
    ]},
    // 4 — Normal plus
    { name: "Oceà",      diff: "Normal+", bgTop: "#0c4a6e", bgBot: "#0891b2", accent: "#67e8f9", villain: "🦈", villainColor: "#67e8f9", taunts: [
      "A l'oceà no hi ha segones oportunitats.",
      "Neda ràpid o et trinxo!",
      "Les ones no esperen... i jo tampoc.",
      "Saps música o saps nedar? Cap de les dues!",
      "El fons marí serà la teva llar."
    ]},
    // 5 — Difícil
    { name: "Cosmos",    diff: "Difícil", bgTop: "#4c1d95", bgBot: "#ec4899", accent: "#22d3ee", villain: "👽", villainColor: "#22d3ee", taunts: [
      "El teu cervell humà no pot amb això.",
      "Al meu planeta això ho sap un nadó.",
      "Calcula ràpid o et teletransporto.",
      "Figures musicals? Trivials.",
      "Demostra que mereixes passar!"
    ]},
    // 6 — Molt difícil
    { name: "Volcà",     diff: "Molt difícil", bgTop: "#7c2d12", bgBot: "#ea580c", accent: "#fbbf24", villain: "🐉", villainColor: "#fbbf24", taunts: [
      "La lava crema més que els teus errors.",
      "Ni un drac aguanta tanta pressió!",
      "Foc, foc i més foc. Respon o crema!",
      "Creies que el volcà era el pitjor? Sóc jo.",
      "Fonent-se... com les teves respostes."
    ]},
    // 7 — Molt molt difícil
    { name: "Inframón",  diff: "Infernal", bgTop: "#0f0f0f", bgBot: "#dc2626", accent: "#ff00aa", villain: "👹", villainColor: "#ff4466", taunts: [
      "Respon o cremaràs!",
      "Ningú n'ha sortit amb vida, d'aquí.",
      "Un error... i ets meu.",
      "MUAJAJAJA! Massa difícil, eh?",
      "Últimes paraules abans de fallar?"
    ]},
    // 8 — Quasi impossible
    { name: "El Buit",   diff: "Impossible", bgTop: "#000000", bgBot: "#18181b", accent: "#a855f7", villain: "💀", villainColor: "#a855f7", taunts: [
      "Aquí no arriba ningú. Ningú.",
      "El silenci etern t'espera.",
      "No existeix la sort en el buit.",
      "Jo sóc l'última cosa que veuràs.",
      "Ja ets mort. Encara no ho saps."
    ]}
  ];
  function randomTaunt(level) {
    const t = level.taunts;
    return t[Math.floor(Math.random() * t.length)];
  }

  // ================= COLORS DEL CUB =================
  const CUBE_COLORS = [
    { name: "Rosa neó",   hex: "#fe019a", rgb: [254, 1, 154] },
    { name: "Groc",       hex: "#fde047", rgb: [253, 224, 71] },
    { name: "Cian",       hex: "#22d3ee", rgb: [34, 211, 238] },
    { name: "Verd",       hex: "#22c55e", rgb: [34, 197, 94] },
    { name: "Lila",       hex: "#a855f7", rgb: [168, 85, 247] },
    { name: "Taronja",    hex: "#fb923c", rgb: [251, 146, 60] },
    { name: "Vermell",    hex: "#ef4444", rgb: [239, 68, 68] },
    { name: "Blanc",      hex: "#f8fafc", rgb: [248, 250, 252] },
    { name: "Or",         hex: "#eab308", rgb: [234, 179, 8] },
    { name: "Turquesa",   hex: "#14b8a6", rgb: [20, 184, 166] }
  ];
  const COLOR_KEY = "musicdash_cube_color_v1";
  function loadCubeColor() {
    try {
      const saved = localStorage.getItem(COLOR_KEY);
      if (saved !== null) {
        const idx = parseInt(saved, 10);
        if (!isNaN(idx) && CUBE_COLORS[idx]) return idx;
      }
    } catch {}
    return 0;
  }
  function applyCubeColor(idx) {
    const c = CUBE_COLORS[idx] || CUBE_COLORS[0];
    window.MusicDash.cubeRGB = c.rgb;
    document.documentElement.style.setProperty("--cube-color", c.hex);
    try { localStorage.setItem(COLOR_KEY, String(idx)); } catch {}
  }

  window.MusicDash = {
    levels: LEVELS,
    currentLevel: 0,
    cubeRGB: CUBE_COLORS[loadCubeColor()].rgb
  };
  // Aplicar el color desat des de l'inici
  document.documentElement.style.setProperty("--cube-color", CUBE_COLORS[loadCubeColor()].hex);

  // ================= PROGRESO =================
  const SAVE_KEY = "musicdash_polydash_v1";
  function loadProgress() {
    try { return JSON.parse(localStorage.getItem(SAVE_KEY)) || { unlocked: 1, completed: [] }; }
    catch { return { unlocked: 1, completed: [] }; }
  }
  function saveProgress(p) { localStorage.setItem(SAVE_KEY, JSON.stringify(p)); }

  // ================= BANCO PREGUNTAS =================
  // 15 FÀCILS — identificació i equivalències bàsiques
  const FACILES = [
    { q: "Quants temps té un compàs de 4/4?", opts: ["2","3","4","6"], correct: 2 },
    { q: "Quants temps té un compàs de 2/4?", opts: ["1","2","3","4"], correct: 1 },
    { q: "Quants temps té un compàs de 3/4?", opts: ["2","3","4","6"], correct: 1 },
    { q: "Quantes negres caben en una rodona?", opts: ["2","4","8","16"], correct: 1 },
    { q: "Quantes negres equivalen a una blanca?", opts: ["1","2","3","4"], correct: 1 },
    { q: "Quantes corxeres equivalen a una negra?", opts: ["1","2","3","4"], correct: 1 },
    { q: "Quantes semicorxeres hi ha en una corxera?", opts: ["1","2","3","4"], correct: 1 },
    { q: "Quantes blanques equivalen a una rodona?", opts: ["1","2","3","4"], correct: 1 },
    { q: "Quina figura dura més?", opts: ["Negra","Blanca","Corxera","Semicorxera"], correct: 1 },
    { q: "Quina és la figura més llarga d'aquestes?", opts: ["Blanca","Rodona","Negra","Corxera"], correct: 1 },
    { q: "Quants temps val una blanca en 4/4?", opts: ["1","2","3","4"], correct: 1 },
    { q: "Quina figura val 1 temps en 4/4?", opts: ["Blanca","Negra","Corxera","Rodona"], correct: 1 },
    { q: "Quina figura dura mig temps en 4/4?", opts: ["Negra","Blanca","Corxera","Rodona"], correct: 2 },
    { q: "Quant dura un silenci de negra (en 4/4)?", opts: ["0,5 temps","1 temps","2 temps","4 temps"], correct: 1 },
    { q: "Quant dura un silenci de blanca (en 4/4)?", opts: ["1 temps","2 temps","3 temps","4 temps"], correct: 1 }
  ];

  // 15 MITJANES — compassos compostos, puntet, operacions senzilles
  const MEDIAS = [
    { q: "Quin és un compàs simple?", opts: ["6/8","3/4","9/8","12/8"], correct: 1 },
    { q: "Quin és un compàs compost?", opts: ["2/4","4/4","6/8","3/4"], correct: 2 },
    { q: "Quin NO és un compàs simple?", opts: ["2/4","3/4","4/4","9/8"], correct: 3 },
    { q: "Una negra amb puntet equival a...", opts: ["2 corxeres","3 corxeres","4 corxeres","1 corxera"], correct: 1 },
    { q: "Una blanca amb puntet dura... temps en 4/4", opts: ["2","2,5","3","4"], correct: 2 },
    { q: "El puntet afegeix a la figura...", opts: ["El seu mateix valor","El doble","La meitat del seu valor","Un quart"], correct: 2 },
    { q: "Quantes corxeres hi ha en un compàs de 6/8?", opts: ["3","6","8","12"], correct: 1 },
    { q: "En 3/4, quantes corxeres caben en un compàs?", opts: ["3","6","8","12"], correct: 1 },
    { q: "Quantes semicorxeres caben en una blanca?", opts: ["4","8","16","32"], correct: 1 },
    { q: "Quantes semicorxeres equivalen a una negra?", opts: ["2","3","4","6"], correct: 2 },
    { q: "En 6/8 el pols s'agrupa de... en...", opts: ["2 en 2","3 en 3","4 en 4","6 en 6"], correct: 1 },
    { q: "Què indica el número de dalt d'un compàs?", opts: ["La figura del pols","El nombre de temps","El tempo","La tonalitat"], correct: 1 },
    { q: "2 negres + 4 corxeres = quants temps?", opts: ["3","4","5","6"], correct: 1 },
    { q: "1 blanca + 2 corxeres = quantes negres?", opts: ["2","3","4","5"], correct: 1 },
    { q: "Quants silencis de corxera = 1 silenci de blanca?", opts: ["2","3","4","6"], correct: 2 }
  ];

  // 15 DIFÍCILS — compassos compostos, doble puntet, càlculs avançats
  const DIFICILES = [
    { q: "En 6/8 (compost), quants polsos reals hi ha?", opts: ["2","3","4","6"], correct: 0 },
    { q: "En 9/8 (compost), quants polsos reals hi ha?", opts: ["2","3","4","9"], correct: 1 },
    { q: "En 12/8, quants polsos reals hi ha?", opts: ["3","4","6","12"], correct: 1 },
    { q: "En un compàs compost, cada pols es subdivideix en...", opts: ["2","3","4","6"], correct: 1 },
    { q: "Quin compàs compost equival a 4/4 simple?", opts: ["6/8","9/8","12/8","3/8"], correct: 2 },
    { q: "L'equivalent compost de 3/4 és...", opts: ["6/8","9/8","12/8","3/8"], correct: 1 },
    { q: "L'equivalent compost de 2/4 és...", opts: ["6/8","9/8","12/8","3/8"], correct: 0 },
    { q: "Corxera amb puntet + semicorxera =", opts: ["1 negra","1 blanca","2 negres","1 corxera"], correct: 0 },
    { q: "Rodona amb puntet = ... negres", opts: ["4","5","6","8"], correct: 2 },
    { q: "Blanca amb doble puntet dura... temps", opts: ["3","3,25","3,5","3,75"], correct: 2 },
    { q: "Quantes semicorxeres hi ha en una negra amb puntet?", opts: ["4","5","6","8"], correct: 2 },
    { q: "Quantes fuses hi ha en una negra?", opts: ["4","8","16","32"], correct: 1 },
    { q: "3 corxeres + 1 negra amb puntet = quants temps?", opts: ["2","2,5","3","3,5"], correct: 2 },
    { q: "Negra amb puntet + 2 semicorxeres = quants temps?", opts: ["1,5","2","2,5","3"], correct: 1 },
    { q: "El número 8 baix en 9/8 indica que el pols és una...", opts: ["Negra","Corxera","Semicorxera","Blanca"], correct: 1 }
  ];

  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  function buildList() {
    return [
      ...shuffle(FACILES).slice(0, 3).map(q => ({ ...q, diff: "Fácil" })),
      ...shuffle(MEDIAS).slice(0, 3).map(q => ({ ...q, diff: "Media" })),
      ...shuffle(DIFICILES).slice(0, 4).map(q => ({ ...q, diff: "Difícil" }))
    ];
  }

  // ================= ESTILOS =================
  const style = document.createElement("style");
  style.textContent = `
    body { font-family: 'Trebuchet MS', system-ui, sans-serif; }
    #md-screen {
      position: fixed; inset: 0; z-index: 9999;
      display: flex; align-items: center; justify-content: center;
      flex-direction: column; padding: 24px; color: #fff;
      background: linear-gradient(135deg, #0f0c29, #302b63, #24243e, #6a11cb, #2575fc);
      background-size: 400% 400%;
      animation: md-bg 15s ease infinite;
    }
    @keyframes md-bg { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
    #md-screen.hide { display: none; }
    .md-title {
      font-family: 'Orbitron', 'Trebuchet MS', sans-serif;
      font-size: clamp(48px, 9vw, 110px); font-weight: 900; letter-spacing: 4px; margin: 0;
      background: linear-gradient(90deg, #fde047, #f97316, #ec4899, #8b5cf6, #06b6d4);
      background-size: 200% auto;
      -webkit-background-clip: text; background-clip: text; color: transparent;
      animation: md-shine 4s linear infinite;
    }
    @keyframes md-shine { to { background-position: 200% center; } }
    .md-tag { font-size: clamp(16px, 2vw, 20px); max-width: 720px; text-align: center;
      line-height: 1.5; margin: 14px 0 28px; opacity: 0.9; }

    /* Notes musicals flotants al fons */
    .md-note {
      position: absolute; color: rgba(255,255,255,0.18);
      font-size: 32px; pointer-events: none;
      animation: md-float-up linear infinite;
      filter: drop-shadow(0 0 20px rgba(255,255,255,0.3));
    }
    @keyframes md-float-up {
      0% { transform: translateY(110vh) rotate(-10deg); opacity: 0; }
      10% { opacity: 0.5; }
      90% { opacity: 0.5; }
      100% { transform: translateY(-20vh) rotate(20deg); opacity: 0; }
    }

    /* Estadístiques (badges) */
    .md-stats { display: flex; gap: 14px; flex-wrap: wrap; justify-content: center; margin: 0 0 24px; }
    .md-stat {
      background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.18);
      border-radius: 50px; padding: 8px 18px; font-size: 14px; font-weight: 600;
      backdrop-filter: blur(10px); display: flex; align-items: center; gap: 8px;
    }
    .md-stat .num { color: #fde047; font-size: 18px; font-weight: 800; font-family: 'Orbitron', monospace; }

    /* Botó play premium amb pulse */
    .md-btn {
      padding: 18px 48px; font-size: 22px; font-weight: 800;
      background: linear-gradient(135deg, #ec4899, #8b5cf6);
      color: #fff; border: none; border-radius: 50px; cursor: pointer;
      box-shadow: 0 10px 30px rgba(139,92,246,0.5);
      transition: 0.2s; letter-spacing: 2px; text-transform: uppercase;
      font-family: inherit; position: relative;
    }
    .md-btn:hover { transform: translateY(-3px) scale(1.05); box-shadow: 0 15px 40px rgba(236,72,153,0.6); }
    .md-btn.pulse::before {
      content: ''; position: absolute; inset: 0; border-radius: 50px;
      background: linear-gradient(135deg, #ec4899, #8b5cf6);
      animation: md-pulse 2s ease-out infinite; z-index: -1;
    }
    @keyframes md-pulse {
      0% { transform: scale(1); opacity: 0.7; }
      100% { transform: scale(1.4); opacity: 0; }
    }

    /* Fila de vilans (preview) */
    .md-villains {
      display: flex; gap: 20px; flex-wrap: wrap; justify-content: center;
      margin-top: 36px; padding: 18px 24px;
      background: rgba(0,0,0,0.25); border-radius: 24px;
      border: 1px solid rgba(255,255,255,0.1); backdrop-filter: blur(8px);
    }
    .md-villains-label {
      width: 100%; text-align: center; font-size: 12px; letter-spacing: 3px;
      text-transform: uppercase; opacity: 0.7; margin-bottom: 4px;
      font-family: 'Orbitron', sans-serif;
    }
    .md-vill {
      display: flex; flex-direction: column; align-items: center; gap: 4px;
      min-width: 80px;
    }
    .md-vill-emoji {
      font-size: 44px; filter: drop-shadow(0 4px 10px rgba(0,0,0,0.4));
      animation: md-vill-bob 3s ease-in-out infinite;
    }
    .md-vill:nth-child(2) .md-vill-emoji { animation-delay: 0.3s; }
    .md-vill:nth-child(3) .md-vill-emoji { animation-delay: 0.6s; }
    .md-vill:nth-child(4) .md-vill-emoji { animation-delay: 0.9s; }
    .md-vill:nth-child(5) .md-vill-emoji { animation-delay: 1.2s; }
    @keyframes md-vill-bob { 0%,100%{transform:translateY(0) rotate(-3deg)} 50%{transform:translateY(-6px) rotate(3deg)} }
    .md-vill-name { font-size: 12px; font-weight: 700; opacity: 0.85; letter-spacing: 1px; }
    .md-vill.locked .md-vill-emoji { filter: grayscale(1) brightness(0.4); animation: none; }
    .md-vill.locked .md-vill-name { opacity: 0.4; }

    /* Cub personatge estil Geometry Dash */
    .md-cube {
      width: 64px; height: 64px;
      background: var(--cube-color, #fe019a);
      border: 3px solid #1a1a1a; border-radius: 6px;
      box-shadow: 0 0 24px var(--cube-color, #fe019a),
                  0 10px 30px rgba(0,0,0,0.5);
      position: relative; display: inline-block;
    }
    .md-cube .eye {
      position: absolute; top: 22px;
      width: 14px; height: 14px;
      background: #fff; border-radius: 2px;
      display: flex; align-items: center; justify-content: center;
    }
    .md-cube .eye::after {
      content: ''; width: 6px; height: 6px; background: #1a1a1a; border-radius: 1px;
    }
    .md-cube .eye.left  { left: 10px; }
    .md-cube .eye.right { right: 10px; }
    .md-cube.bouncing {
      position: absolute; bottom: 30px; right: 40px;
      animation: md-cube-bounce 1.2s ease-in-out infinite;
    }
    @keyframes md-cube-bounce {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      50% { transform: translateY(-30px) rotate(180deg); }
    }
    @media (max-width: 700px) { .md-cube.bouncing { display: none; } }

    /* Selector de color */
    .md-color-picker {
      display: flex; flex-direction: column; align-items: center; gap: 14px;
      margin-top: 24px; padding: 18px 28px;
      background: rgba(0,0,0,0.25); border-radius: 24px;
      border: 1px solid rgba(255,255,255,0.1); backdrop-filter: blur(8px);
    }
    .md-color-label {
      font-size: 12px; letter-spacing: 3px; text-transform: uppercase;
      opacity: 0.7; font-family: 'Orbitron', sans-serif;
    }
    .md-color-row { display: flex; gap: 14px; align-items: center; }
    .md-color-preview { /* el cub de mostra (no bouncing) */ }
    .md-color-swatches { display: flex; gap: 8px; flex-wrap: wrap; max-width: 320px; justify-content: center; }
    .md-swatch {
      width: 32px; height: 32px; border-radius: 8px;
      border: 3px solid rgba(255,255,255,0.25); cursor: pointer;
      transition: 0.15s; box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    }
    .md-swatch:hover { transform: scale(1.15); }
    .md-swatch.active { border-color: #fff; box-shadow: 0 0 16px currentColor; transform: scale(1.15); }

    /* Versió/credits */
    .md-credits {
      position: absolute; bottom: 14px; left: 18px;
      font-size: 11px; opacity: 0.4; letter-spacing: 1px;
    }
    .md-btn.secondary {
      background: transparent; border: 2px solid rgba(255,255,255,0.35);
      box-shadow: none; padding: 10px 22px; font-size: 14px;
    }
    .md-btn.secondary:hover { background: rgba(255,255,255,0.1); transform: none; box-shadow: none; }
    .md-back { position: absolute; top: 20px; left: 20px; }

    .md-levels {
      display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 24px; max-width: 1100px; width: 100%; margin-top: 24px;
    }
    .md-lvl {
      aspect-ratio: 4/3; border-radius: 20px; cursor: pointer; position: relative;
      display: flex; align-items: center; justify-content: center; flex-direction: column;
      border: 3px solid rgba(255,255,255,0.2);
      transition: 0.25s; overflow: hidden; color: #fff;
      box-shadow: 0 12px 30px rgba(0,0,0,0.4);
    }
    .md-lvl:hover { transform: translateY(-8px) scale(1.03); box-shadow: 0 20px 50px rgba(0,0,0,0.6); }
    .md-lvl.locked { opacity: 0.45; cursor: not-allowed; filter: grayscale(0.6); }
    .md-lvl.locked:hover { transform: none; }
    .md-villain { font-size: 54px; }
    .md-lvl-name { font-size: 22px; font-weight: 700; margin-top: 6px; }
    .md-lvl-diff { font-size: 13px; opacity: 0.85; margin-top: 2px; }
    .md-lock { position: absolute; top: 12px; right: 14px; font-size: 22px; }
    .md-star { position: absolute; top: 12px; left: 14px; font-size: 22px; }

    /* Quiz overlay */
    #md-quiz {
      position: fixed; inset: 0; z-index: 10000;
      background: rgba(5,5,15,0.9); backdrop-filter: blur(10px);
      display: none; align-items: center; justify-content: center;
      font-family: 'Trebuchet MS', system-ui, sans-serif;
    }
    #md-quiz.active { display: flex; }
    .q-wrap { display: flex; gap: 24px; align-items: flex-end; max-width: 860px; width: 94%; }
    @keyframes q-float { 0%,100%{transform:translateY(0) rotate(-3deg)} 50%{transform:translateY(-10px) rotate(3deg)} }
    .q-paper {
      flex: 1;
      background: repeating-linear-gradient(#fefefe 0 31px, #cfd8e3 31px 32px);
      border: 1px solid #b0b8c5; border-left: 8px solid #e74c3c;
      border-radius: 6px; padding: 26px 32px;
      box-shadow: 0 25px 60px rgba(0,0,0,0.7);
      animation: q-pop 0.3s cubic-bezier(0.34,1.56,0.64,1);
      color: #1a1a1a;
    }
    @keyframes q-pop { from{transform:scale(.8);opacity:0} to{transform:scale(1);opacity:1} }
    .q-bubble {
      background: #fff; border: 2px solid #1a1a1a; border-radius: 14px;
      padding: 10px 16px; font-size: 14px; margin-bottom: 16px; position: relative;
      font-family: 'Comic Sans MS', cursive;
    }
    .q-bubble::before {
      content: ''; position: absolute; left: -10px; bottom: 12px;
      border: 8px solid transparent; border-right-color: #1a1a1a;
    }
    .q-diff {
      display: inline-block; padding: 4px 14px; border-radius: 50px;
      font-size: 12px; font-weight: 700; letter-spacing: 1px;
      text-transform: uppercase; color: #fff; margin-bottom: 10px;
    }
    .diff-Fácil { background: #10b981; }
    .diff-Media { background: #f59e0b; }
    .diff-Difícil { background: #ef4444; }
    .q-text { font-size: 22px; font-weight: 600; margin: 4px 0 20px; line-height: 1.35;
      font-family: 'Comic Sans MS', cursive; color: #1a1a1a; }
    .q-opts { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .q-opt {
      padding: 14px; font-size: 16px; font-weight: 600;
      background: #fff; color: #1a1a1a;
      border: 2px solid #1a1a1a; border-radius: 10px;
      cursor: pointer; transition: .1s; font-family: inherit;
      box-shadow: 3px 3px 0 #1a1a1a;
    }
    .q-opt:hover { background: #fde047; transform: translate(-2px,-2px); box-shadow: 5px 5px 0 #1a1a1a; }
    .q-opt:active { transform: translate(2px,2px); box-shadow: 1px 1px 0 #1a1a1a; }
    .q-opt.correct { background: #22c55e !important; color: #fff !important; animation: q-flash-g 0.5s; }
    .q-opt.wrong   { background: #ef4444 !important; color: #fff !important; animation: q-shake 0.4s; }
    @keyframes q-flash-g { 0%,100%{transform:scale(1)} 50%{transform:scale(1.08);box-shadow:0 0 30px #22c55e} }
    @keyframes q-shake   { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-8px)} 40%{transform:translateX(8px)} 60%{transform:translateX(-6px)} 80%{transform:translateX(6px)} }
    #md-quiz.shake .q-paper { animation: q-shake 0.4s; }
    #md-quiz.pulse .q-portrait { animation: q-pulse-g 0.5s; }
    @keyframes q-pulse-g { 0%,100%{transform:scale(1)} 50%{transform:scale(1.15);filter:brightness(1.4)} }

    /* Flash global */
    #md-flash {
      position: fixed; inset: 0; pointer-events: none; z-index: 10500;
      opacity: 0; transition: opacity 0.15s;
    }
    #md-flash.g { background: radial-gradient(circle, rgba(34,197,94,0.6), transparent 70%); opacity: 1; }
    #md-flash.r { background: radial-gradient(circle, rgba(239,68,68,0.7), transparent 70%); opacity: 1; }

    @media (max-width: 640px) {
      .q-wrap { flex-direction: column; align-items: center; }
      .q-villain { font-size: 80px; }
    }

    /* HUD en juego */
    #md-hud {
      position: fixed; top: 14px; right: 14px; z-index: 9998;
      display: none; gap: 10px; flex-direction: column; align-items: flex-end;
      font-family: 'Orbitron', system-ui, sans-serif;
    }
    #md-hud.active { display: flex; }
    #md-hud .pill {
      background: rgba(0,0,0,0.65); color: #fff; padding: 8px 18px;
      border-radius: 50px; font-size: 14px; letter-spacing: 1px;
      border: 1px solid rgba(255,255,255,0.2);
      min-width: 140px; text-align: center;
      backdrop-filter: blur(6px);
    }
    #md-hud .meters { color: #fde047; font-weight: 700; }
    #md-hud .qcount { color: #22d3ee; }

    /* Retrato del villano */
    .q-portrait {
      width: 140px; height: 140px; flex-shrink: 0;
      border-radius: 20px; border: 4px solid #1a1a1a;
      background: radial-gradient(circle at 30% 30%, #fff, #ccc 60%, #888);
      box-shadow: 8px 8px 0 #1a1a1a, 0 15px 40px rgba(0,0,0,0.5);
      display: flex; align-items: center; justify-content: center;
      font-size: 90px; position: relative; overflow: hidden;
      animation: q-float 2s ease-in-out infinite;
    }
    .q-portrait::after {
      content: ''; position: absolute; inset: 0;
      background: linear-gradient(135deg, rgba(255,255,255,0.25), transparent 40%);
      pointer-events: none;
    }
    .q-portrait .name-tag {
      position: absolute; bottom: -6px; left: 50%; transform: translateX(-50%);
      background: #1a1a1a; color: #fff; font-size: 11px; font-weight: 700;
      padding: 2px 10px; border-radius: 6px; letter-spacing: 1px;
      font-family: 'Trebuchet MS', sans-serif;
    }

    /* Fin de partida */
    #md-end {
      position: fixed; inset: 0; z-index: 10001;
      display: none; flex-direction: column; align-items: center; justify-content: center;
      background: rgba(5,5,15,0.95); color: #fff; padding: 24px;
    }
    #md-end.active { display: flex; }
    .end-title { font-size: clamp(48px, 8vw, 90px); margin: 0; font-weight: 900;
      background: linear-gradient(90deg,#fde047,#ec4899);
      -webkit-background-clip: text; background-clip: text; color: transparent; }
    #md-end.fail .end-title { background: linear-gradient(90deg,#ef4444,#f97316);
      -webkit-background-clip: text; background-clip: text; }
    .end-msg { font-size: 18px; margin: 16px 0 24px; opacity: 0.9; text-align: center; }
    .end-row { display: flex; gap: 14px; flex-wrap: wrap; justify-content: center; }
  `;
  document.head.appendChild(style);

  // ================= DOM: pantallas =================
  // Contenedor para bloquear el juego hasta elegir nivel
  const screen = document.createElement("div");
  screen.id = "md-screen";
  screen.innerHTML = `
    <div class="md-home">
      <h1 class="md-title">MUSIC DASH</h1>
      <p class="md-tag">
        Salta, esquiva els obstacles i demostra els teus coneixements musicals.<br>
        Cada certa distància un vilà et bloqueja amb una pregunta. Fallar és morir!
      </p>
      <p class="md-tag" style="font-size:14px; opacity:0.7; margin-top:-10px;">
        Controls: <b>Espai</b> per saltar · <b>S</b> per guardar checkpoint
      </p>
      <button class="md-btn" id="md-go-select">▶ Jugar</button>
    </div>
  `;
  document.body.appendChild(screen);

  const hud = document.createElement("div");
  hud.id = "md-hud";
  hud.innerHTML = `
    <div class="pill meters">📏 <span id="md-meters">0</span> m</div>
    <div class="pill qcount">❓ <span id="md-qcount">0</span>/10</div>
    <div class="pill" id="md-fps-pill" style="font-size:12px;">⚡ <span id="md-fps">60</span> fps</div>
  `;
  document.body.appendChild(hud);

  // ================= FPS COUNTER =================
  let fpsFrames = 0, fpsLast = performance.now();
  function tickFps() {
    fpsFrames++;
    const now = performance.now();
    if (now - fpsLast >= 500) {
      const fps = Math.round((fpsFrames * 1000) / (now - fpsLast));
      const el = document.getElementById("md-fps");
      if (el) {
        el.textContent = fps;
        el.parentElement.style.color = fps < 30 ? "#ef4444" : (fps < 50 ? "#fbbf24" : "#22c55e");
      }
      fpsFrames = 0; fpsLast = now;
    }
    requestAnimationFrame(tickFps);
  }
  requestAnimationFrame(tickFps);

  const quiz = document.createElement("div");
  quiz.id = "md-quiz";
  quiz.innerHTML = `
    <div class="q-wrap">
      <div class="q-portrait" id="q-portrait">
        <span id="q-villain">🦇</span>
        <span class="name-tag" id="q-name">VILÀ</span>
      </div>
      <div class="q-paper">
        <div class="q-bubble" id="q-bubble"></div>
        <span class="q-diff" id="q-diff"></span>
        <div class="q-text" id="q-text"></div>
        <div class="q-opts" id="q-opts"></div>
      </div>
    </div>
  `;
  document.body.appendChild(quiz);

  const flash = document.createElement("div");
  flash.id = "md-flash";
  document.body.appendChild(flash);

  const end = document.createElement("div");
  end.id = "md-end";
  end.innerHTML = `
    <h1 class="end-title" id="end-title"></h1>
    <p class="end-msg" id="end-msg"></p>
    <div class="end-row">
      <button class="md-btn" id="end-retry">Tornar-ho a provar</button>
      <button class="md-btn secondary" id="end-menu">Nivells</button>
    </div>
  `;
  document.body.appendChild(end);

  // ================= NAV =================
  function renderFloatingNotes(container) {
    const notes = ["♪", "♫", "♬", "♩", "𝄞", "♭", "♯"];
    for (let i = 0; i < 14; i++) {
      const n = document.createElement("span");
      n.className = "md-note";
      n.textContent = notes[i % notes.length];
      n.style.left = (Math.random() * 95) + "%";
      n.style.fontSize = (20 + Math.random() * 30) + "px";
      n.style.animationDuration = (10 + Math.random() * 12) + "s";
      n.style.animationDelay = (Math.random() * -15) + "s";
      container.appendChild(n);
    }
  }

  function showHome() {
    screen.classList.remove("hide");
    const progress = loadProgress();
    const completedCount = progress.completed.length;
    const hasProgress = completedCount > 0;
    const villainsHTML = LEVELS.map((lvl, i) => {
      const unlocked = i < progress.unlocked;
      return `<div class="md-vill ${unlocked ? "" : "locked"}">
        <div class="md-vill-emoji">${lvl.villain}</div>
        <div class="md-vill-name">${lvl.name}</div>
      </div>`;
    }).join("");

    screen.innerHTML = `
      <h1 class="md-title">MUSIC DASH</h1>
      <p class="md-tag">
        Salta, esquiva els obstacles i demostra els teus coneixements musicals.<br>
        Cada certa distància un <b>vilà</b> et bloqueja amb una pregunta. Fallar és morir!
      </p>
      ${hasProgress ? `
        <div class="md-stats">
          <div class="md-stat">⭐ <span class="num">${completedCount}</span>/${LEVELS.length} nivells</div>
          <div class="md-stat">🔓 <span class="num">${Math.min(progress.unlocked, LEVELS.length)}</span> desbloquejats</div>
        </div>` : ""}
      <button class="md-btn pulse" id="md-go-select">▶ ${hasProgress ? "Continuar" : "Jugar"}</button>
      <div class="md-villains">
        <div class="md-villains-label">Vilans que t'esperen</div>
        ${villainsHTML}
      </div>
      <div class="md-color-picker">
        <div class="md-color-label">El teu cub</div>
        <div class="md-color-row">
          <div class="md-cube md-color-preview"><span class="eye left"></span><span class="eye right"></span></div>
          <div class="md-color-swatches" id="md-swatches"></div>
        </div>
      </div>
      <p class="md-tag" style="font-size:13px; opacity:0.65; margin-top:20px;">
        <b>Espai</b> saltar · <b>1-4</b> respondre · <b>S</b> checkpoint
      </p>
      <div class="md-cube bouncing"><span class="eye left"></span><span class="eye right"></span></div>
      <div class="md-credits">v1.0 · Music Dash</div>
    `;
    renderFloatingNotes(screen);
    document.getElementById("md-go-select").onclick = showSelect;

    // Renderitzar swatches de color
    const sw = document.getElementById("md-swatches");
    const currentIdx = loadCubeColor();
    CUBE_COLORS.forEach((c, i) => {
      const el = document.createElement("div");
      el.className = "md-swatch" + (i === currentIdx ? " active" : "");
      el.style.background = c.hex;
      el.style.color = c.hex;
      el.title = c.name;
      el.onclick = () => {
        applyCubeColor(i);
        sw.querySelectorAll(".md-swatch").forEach(x => x.classList.remove("active"));
        el.classList.add("active");
        sfx.tick();
      };
      sw.appendChild(el);
    });

    hud.classList.remove("active");
  }

  function showSelect() {
    screen.classList.remove("hide");
    const progress = loadProgress();
    let html = `
      <button class="md-btn secondary md-back" id="md-back-home">← Tornar</button>
      <h1 class="md-title" style="font-size: clamp(36px,6vw,60px);">Tria el teu nivell</h1>
      <div class="md-levels">`;
    LEVELS.forEach((lvl, i) => {
      const unlocked = i < progress.unlocked;
      const done = progress.completed.includes(i);
      html += `
        <div class="md-lvl ${unlocked ? "" : "locked"}" data-idx="${i}"
             style="background: linear-gradient(160deg, ${lvl.bgTop}, ${lvl.bgBot});">
          ${done ? '<span class="md-star">⭐</span>' : ''}
          ${unlocked ? '' : '<span class="md-lock">🔒</span>'}
          <div class="md-villain">${lvl.villain}</div>
          <div class="md-lvl-name">${lvl.name}</div>
          <div class="md-lvl-diff">${lvl.diff}</div>
        </div>`;
    });
    html += `</div>
      <button class="md-btn secondary" id="md-reset" style="margin-top:28px;">Reiniciar progrés</button>`;
    screen.innerHTML = html;
    document.getElementById("md-back-home").onclick = showHome;
    document.getElementById("md-reset").onclick = () => {
      if (confirm("Esborrar el progrés desat?")) { localStorage.removeItem(SAVE_KEY); showSelect(); }
    };
    screen.querySelectorAll(".md-lvl").forEach(el => {
      if (!el.classList.contains("locked")) {
        el.onclick = () => startLevel(parseInt(el.dataset.idx, 10));
      }
    });
    hud.classList.remove("active");
  }

  function startLevel(idx) {
    window.MusicDash.currentLevel = idx;
    state.questions = buildList();
    state.index = 0;
    state.startX = null;
    state.paused = false;
    document.getElementById("md-qcount").textContent = 0;
    document.getElementById("md-meters").textContent = 0;
    hud.classList.add("active");
    screen.classList.add("hide");
    end.classList.remove("active");
    // Pulsa espacio para empezar (PolyDash arranca con espacio)
  }

  // ================= SO (Web Audio, sense fitxers) =================
  let audioCtx = null;
  function ensureAudio() {
    if (!audioCtx) {
      try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); }
      catch (e) { audioCtx = null; }
    }
    if (audioCtx && audioCtx.state === "suspended") audioCtx.resume();
  }
  function beep(freq, dur, type = "sine", gain = 0.15) {
    if (!audioCtx) return;
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.type = type; o.frequency.value = freq;
    g.gain.value = gain;
    g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + dur);
    o.connect(g).connect(audioCtx.destination);
    o.start(); o.stop(audioCtx.currentTime + dur);
  }
  const sfx = {
    jump:    () => beep(520, 0.08, "square", 0.08),
    correct: () => { beep(660, 0.12, "triangle", 0.2); setTimeout(() => beep(990, 0.18, "triangle", 0.2), 100); },
    wrong:   () => { beep(220, 0.18, "sawtooth", 0.2); setTimeout(() => beep(140, 0.25, "sawtooth", 0.2), 120); },
    tick:    () => beep(880, 0.05, "square", 0.06),
    win:     () => { [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => beep(f, 0.18, "triangle", 0.18), i * 100)); }
  };

  // ================= SUPORT TÀCTIL (salt en mòbil) =================
  function installTouchJump() {
    document.addEventListener("touchstart", (e) => {
      // Evita disparar salt si toca un botó del quiz/menú
      if (e.target.closest(".q-opt, .md-btn, .md-lvl")) return;
      ensureAudio();
      const down = new KeyboardEvent("keydown", { code: "Space", key: " " });
      const up   = new KeyboardEvent("keyup",   { code: "Space", key: " " });
      document.dispatchEvent(down);
      setTimeout(() => document.dispatchEvent(up), 50);
    }, { passive: true });
  }
  installTouchJump();

  // Primer gest d'usuari desbloqueja àudio
  document.addEventListener("keydown", ensureAudio, { once: true });
  document.addEventListener("pointerdown", ensureAudio, { once: true });

  // Efecte de so en saltar (monitor passiu via keydown Space)
  document.addEventListener("keydown", (e) => {
    if (e.code === "Space") sfx.jump();
  });

  // Teclat 1-4 al quiz
  document.addEventListener("keydown", (e) => {
    if (!quiz.classList.contains("active")) return;
    const map = { "Digit1": 0, "Digit2": 1, "Digit3": 2, "Digit4": 3,
                  "Numpad1": 0, "Numpad2": 1, "Numpad3": 2, "Numpad4": 3 };
    const idx = map[e.code];
    if (idx !== undefined && state.currentButtons && !state.currentButtons[idx].disabled) {
      e.preventDefault();
      answerWithIdx(idx);
    }
  });

  // ================= QUIZ =================
  const QUIZ_DISTANCE = 200;
  const TOTAL_QUESTIONS = 10;
  const CALM_REQUIRED_MS = 2000;   // 2s sin saltar = zona tranquila
  const state = {
    questions: buildList(),
    index: 0,
    startX: null,
    paused: false,
    onResume: null,
    onDieHook: null,
    calmStart: null,
    lastIsJumping: false,
    currentButtons: null,
    correctIdx: 0
  };

  function showQuestion(onResume, onDie) {
    if (state.index >= state.questions.length) { onResume(); return; }
    state.paused = true;
    state.onResume = onResume;
    state.onDieHook = onDie;

    const q = state.questions[state.index];
    const lvl = LEVELS[window.MusicDash.currentLevel];
    document.getElementById("q-villain").textContent = lvl.villain;
    document.getElementById("q-name").textContent = lvl.name.toUpperCase();
    document.getElementById("q-portrait").style.background =
      `radial-gradient(circle at 30% 30%, #fff, ${lvl.villainColor} 60%, ${lvl.bgTop})`;
    document.getElementById("q-bubble").textContent = randomTaunt(lvl);
    const diff = document.getElementById("q-diff");
    diff.textContent = `${q.diff} · ${state.index + 1}/${TOTAL_QUESTIONS}`;
    diff.className = "q-diff diff-" + q.diff;
    document.getElementById("q-text").textContent = q.q;
    const opts = document.getElementById("q-opts");
    opts.innerHTML = "";
    state.currentButtons = [];

    // Barrejar opcions: emparellem text amb si és correcte, mesclem, busquem nou índex
    const pairs = q.opts.map((txt, i) => ({ txt, isCorrect: i === q.correct }));
    for (let i = pairs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pairs[i], pairs[j]] = [pairs[j], pairs[i]];
    }
    state.correctIdx = pairs.findIndex(p => p.isCorrect);

    pairs.forEach((p, i) => {
      const btn = document.createElement("button");
      btn.className = "q-opt";
      btn.dataset.idx = i;
      btn.textContent = p.txt;
      btn.onclick = () => answerWithIdx(i);
      opts.appendChild(btn);
      state.currentButtons.push(btn);
    });
    quiz.classList.add("active");
    sfx.tick();
  }

  function answerWithIdx(i) {
    if (!state.currentButtons) return;
    const correct = (i === state.correctIdx);
    const btn = state.currentButtons[i];
    const correctBtn = state.currentButtons[state.correctIdx];
    btn.classList.add(correct ? "correct" : "wrong");
    if (!correct) correctBtn.classList.add("correct");
    state.currentButtons.forEach(b => b.disabled = true);
    // Feedback global
    flash.className = correct ? "g" : "r";
    setTimeout(() => flash.className = "", 300);
    quiz.classList.toggle("shake", !correct);
    quiz.classList.toggle("pulse", correct);
    (correct ? sfx.correct : sfx.wrong)();
    // Espera curta per veure el feedback abans de tancar
    setTimeout(() => {
      quiz.classList.remove("shake", "pulse");
      answer(correct);
    }, correct ? 450 : 700);
  }

  function answer(correct) {
    quiz.classList.remove("active");
    state.paused = false;
    // Reset de calma: al reanudar no queremos que dispare otra inmediatamente
    state.calmStart = null;
    if (correct) {
      state.index++;
      document.getElementById("md-qcount").textContent = state.index;
      if (state.onResume) state.onResume();
      if (state.index >= TOTAL_QUESTIONS) {
        const p = loadProgress();
        const idx = window.MusicDash.currentLevel;
        if (!p.completed.includes(idx)) p.completed.push(idx);
        p.unlocked = Math.max(p.unlocked, Math.min(idx + 2, LEVELS.length));
        saveProgress(p);
        setTimeout(() => showEnd(true), 300);
      }
    } else {
      // Fallo → muerte natural de PolyDash → respawn desde último checkpoint.
      // Mantenemos state.index sin incrementar: al volver al punto, se vuelve
      // a lanzar una pregunta (de la misma posición en la lista).
      if (state.onDieHook) state.onDieHook();
    }
  }

  function showEnd(won) {
    end.classList.add("active");
    end.classList.toggle("fail", !won);
    const idx = window.MusicDash.currentLevel;
    const p = loadProgress();
    const allDone = won && p.completed.length >= LEVELS.length;
    if (allDone) {
      document.getElementById("end-title").textContent = "🏆 HAS GUANYAT!";
      document.getElementById("end-msg").textContent =
        `Has completat els ${LEVELS.length} nivells. Un autèntic mestre musical!`;
    } else {
      document.getElementById("end-title").textContent = won ? "COMPLETAT!" : "HAS PERDUT";
      let msg = `Encerts: ${state.index}/${TOTAL_QUESTIONS}`;
      if (won && idx + 1 < LEVELS.length) msg += `\nDesbloquejat: "${LEVELS[idx + 1].name}"!`;
      document.getElementById("end-msg").textContent = msg;
    }
    if (won) sfx.win();
    hud.classList.remove("active");
  }
  document.addEventListener("click", (e) => {
    if (e.target.id === "end-retry") {
      sessionStorage.setItem("md-autostart", window.MusicDash.currentLevel);
      location.reload();
    }
    if (e.target.id === "end-menu") location.reload();
  });

  // Autostart tras recarga (al pulsar Reintentar)
  window.addEventListener("load", () => {
    const auto = sessionStorage.getItem("md-autostart");
    if (auto !== null) {
      sessionStorage.removeItem("md-autostart");
      startLevel(parseInt(auto, 10));
    }
  });

  // ================= API =================
  window.MusicQuiz = {
    // Dispara la pregunta cuando, tras pasar QUIZ_DISTANCE, el jugador lleva
    // 2 segundos seguidos SIN saltar (zona tranquila).
    tick: function (heroX, isJumping, onResume, onDie) {
      if (state.paused) return true;
      if (state.startX === null) state.startX = heroX;
      const travelled = heroX - state.startX;
      const meters = Math.max(0, Math.floor(travelled));
      const mEl = document.getElementById("md-meters");
      if (mEl) mEl.textContent = meters;

      // Reset de la calma en el flanco de subida (justo cuando inicia salto)
      // o mientras siga en el aire
      const now = performance.now();
      if (isJumping) {
        state.calmStart = null;
      } else if (state.calmStart === null) {
        state.calmStart = now;
      }
      state.lastIsJumping = isJumping;

      const nextTrigger = (state.index + 1) * QUIZ_DISTANCE;
      if (state.index < TOTAL_QUESTIONS && travelled >= nextTrigger) {
        const calmFor = state.calmStart === null ? 0 : (now - state.calmStart);
        if (calmFor >= CALM_REQUIRED_MS) {
          showQuestion(onResume, onDie);
          return true;
        }
      }
      return false;
    },
    reset: function () {
      state.questions = buildList();
      state.index = 0;
      state.startX = null;
      state.paused = false;
      state.calmStart = null;
      state.lastIsJumping = false;
      const q = document.getElementById("md-qcount"); if (q) q.textContent = 0;
      const m = document.getElementById("md-meters"); if (m) m.textContent = 0;
      quiz.classList.remove("active");
    },
    isPaused: function () { return state.paused; },
    notifyDeath: function () { showEnd(false); },
    notifyWin: function () { showEnd(true); }
  };

  // Render inicial de la home premium (notes flotants, vilans, stats)
  showHome();
})();
