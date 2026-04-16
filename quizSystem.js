// ============================================================================
// quizSystem.js — Módulo de inyección educativa para clones de Geometry Dash
// Vanilla JS (ES6). Sin dependencias. Pensado para HTML5 Canvas.
// ============================================================================

// ----- 1. MÁQUINA DE ESTADOS ------------------------------------------------
export const GameState = Object.freeze({
  RUNNING: "RUNNING",
  QUIZ_PAUSED: "QUIZ_PAUSED",
  DEAD: "DEAD"
});

export const StateMachine = {
  current: GameState.RUNNING,
  set(state) { this.current = state; },
  is(state) { return this.current === state; }
};

// ----- 2. BANCO DE PREGUNTAS (intervalos + ritmo) ---------------------------
// Cada pregunta: { q, opts: [4], correct: idx, diff: "Fácil"|"Media"|"Difícil" }
export const QUESTION_BANK = {
  facil: [
    { q: "¿Cuántos tiempos tiene un compás de 4/4?", opts: ["2","3","4","6"], correct: 2 },
    { q: "¿Cuántas negras caben en una redonda?", opts: ["2","4","8","16"], correct: 1 },
    { q: "¿Cuántas corcheas equivalen a una negra?", opts: ["1","2","3","4"], correct: 1 },
    { q: "¿Qué figura dura más?", opts: ["Negra","Blanca","Corchea","Semicorchea"], correct: 1 },
    { q: "¿Cuántos tiempos vale una blanca en 4/4?", opts: ["1","2","3","4"], correct: 1 },
    { q: "Intervalo Do→Do (misma nota)", opts: ["1ª Justa","2ª Mayor","3ª Menor","8ª Justa"], correct: 0 },
    { q: "Intervalo Do→Sol", opts: ["3ª","4ª Justa","5ª Justa","6ª"], correct: 2 },
    { q: "Intervalo Do→Do (octava arriba)", opts: ["5ª","6ª","7ª","8ª Justa"], correct: 3 },
    { q: "¿Cuántos tiempos tiene un compás de 2/4?", opts: ["1","2","3","4"], correct: 1 },
    { q: "¿Qué figura dura medio tiempo en 4/4?", opts: ["Negra","Blanca","Corchea","Redonda"], correct: 2 }
  ],
  media: [
    { q: "¿Cuál es un compás compuesto?", opts: ["2/4","4/4","6/8","3/4"], correct: 2 },
    { q: "Una negra con puntillo equivale a...", opts: ["2 corcheas","3 corcheas","4 corcheas","1 corchea"], correct: 1 },
    { q: "¿Cuántas corcheas hay en un compás de 6/8?", opts: ["3","6","8","12"], correct: 1 },
    { q: "El puntillo añade...", opts: ["Su mismo valor","El doble","La mitad de su valor","Un cuarto"], correct: 2 },
    { q: "Intervalo Do→Mi", opts: ["3ª Menor","3ª Mayor","4ª","2ª"], correct: 1 },
    { q: "Intervalo Do→Mi♭", opts: ["3ª Menor","3ª Mayor","2ª","4ª"], correct: 0 },
    { q: "Intervalo Do→Fa", opts: ["3ª","4ª Justa","5ª","6ª"], correct: 1 },
    { q: "Una blanca con puntillo dura... tiempos en 4/4", opts: ["2","2.5","3","4"], correct: 2 },
    { q: "¿Cuál NO es compás simple?", opts: ["2/4","3/4","4/4","9/8"], correct: 3 },
    { q: "En 6/8 el pulso se agrupa de... en...", opts: ["2 en 2","3 en 3","4 en 4","6 en 6"], correct: 1 }
  ],
  dificil: [
    { q: "En 9/8 (compuesto), ¿cuántos pulsos reales hay?", opts: ["2","3","4","9"], correct: 1 },
    { q: "Corchea con puntillo + semicorchea =", opts: ["1 negra","1 blanca","2 negras","1 corchea"], correct: 0 },
    { q: "¿Qué compás compuesto equivale a 4/4?", opts: ["6/8","9/8","12/8","3/8"], correct: 2 },
    { q: "Redonda con puntillo = ... negras", opts: ["4","5","6","8"], correct: 2 },
    { q: "Intervalo Do→Si", opts: ["6ª","7ª Menor","7ª Mayor","8ª"], correct: 2 },
    { q: "Intervalo Do→Si♭", opts: ["6ª","7ª Menor","7ª Mayor","8ª"], correct: 1 },
    { q: "El equivalente compuesto de 3/4 es...", opts: ["6/8","9/8","12/8","3/8"], correct: 1 },
    { q: "Blanca con doble puntillo dura...", opts: ["3","3.25","3.5","3.75"], correct: 2 },
    { q: "En compás compuesto cada pulso se subdivide en...", opts: ["2","3","4","6"], correct: 1 },
    { q: "¿Cuántas fusas hay en una negra?", opts: ["4","8","16","32"], correct: 1 }
  ]
};

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Construye la lista de un nivel: 3 fáciles + 3 medias + 4 difíciles
export function buildLevelQuestions() {
  return [
    ...shuffle(QUESTION_BANK.facil).slice(0, 3).map(q => ({ ...q, diff: "Fácil" })),
    ...shuffle(QUESTION_BANK.media).slice(0, 3).map(q => ({ ...q, diff: "Media" })),
    ...shuffle(QUESTION_BANK.dificil).slice(0, 4).map(q => ({ ...q, diff: "Difícil" }))
  ];
}

// ----- 3. QUIZ TRIGGER (bloque colisionable en el mapa) ---------------------
// Crea uno cada N metros y comprueba colisión con el jugador.
export class QuizTrigger {
  constructor(x, y, w = 30, h = 80) {
    this.x = x; this.y = y; this.w = w; this.h = h;
    this.consumed = false;
    this.glowPhase = 0;
  }

  update(scrollDx) {
    this.x -= scrollDx;
    this.glowPhase += 0.1;
  }

  // AABB simple
  collidesWith(player) {
    if (this.consumed) return false;
    return !(player.x + player.w < this.x ||
             player.x > this.x + this.w ||
             player.y + player.h < this.y ||
             player.y > this.y + this.h);
  }

  draw(ctx) {
    if (this.consumed) return;
    const glow = 0.5 + 0.5 * Math.sin(this.glowPhase);
    ctx.save();
    ctx.shadowColor = "#ec4899";
    ctx.shadowBlur = 20 + glow * 15;
    ctx.fillStyle = `rgba(236, 72, 153, ${0.7 + glow * 0.3})`;
    ctx.fillRect(this.x, this.y, this.w, this.h);
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;
    ctx.strokeRect(this.x, this.y, this.w, this.h);
    // "?" central
    ctx.shadowBlur = 0;
    ctx.fillStyle = "#fff";
    ctx.font = "bold 28px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("?", this.x + this.w / 2, this.y + this.h / 2);
    ctx.restore();
  }
}

// ----- 4. QUIZ MANAGER ------------------------------------------------------
// Controla la lista de preguntas, el overlay HTML y la resolución.
export class QuizManager {
  constructor({ onCorrect, onWrong, onAllCleared } = {}) {
    this.questions = buildLevelQuestions();
    this.index = 0;
    this.onCorrect = onCorrect || (() => {});
    this.onWrong = onWrong || (() => {});
    this.onAllCleared = onAllCleared || (() => {});
    this._injectStylesIfNeeded();
    this._buildOverlay();
  }

  reset() {
    this.questions = buildLevelQuestions();
    this.index = 0;
    this.hide();
  }

  hasMore() { return this.index < this.questions.length; }

  show() {
    if (!this.hasMore()) { this.onAllCleared(); return; }
    const q = this.questions[this.index];
    StateMachine.set(GameState.QUIZ_PAUSED);

    const diffEl = this.overlay.querySelector(".q-diff");
    diffEl.textContent = `${q.diff} · ${this.index + 1}/${this.questions.length}`;
    diffEl.className = "q-diff diff-" + q.diff;

    this.overlay.querySelector(".q-text").textContent = q.q;

    const optsBox = this.overlay.querySelector(".q-opts");
    optsBox.innerHTML = "";
    q.opts.forEach((opt, i) => {
      const btn = document.createElement("button");
      btn.className = "q-opt";
      btn.textContent = opt;
      btn.onclick = () => this._answer(i === q.correct);
      optsBox.appendChild(btn);
    });

    this.overlay.classList.add("active");
  }

  hide() { this.overlay.classList.remove("active"); }

  _answer(correct) {
    this.hide();
    this.index++;
    if (correct) {
      StateMachine.set(GameState.RUNNING);
      this.onCorrect();
      if (!this.hasMore()) this.onAllCleared();
    } else {
      StateMachine.set(GameState.DEAD);
      this.onWrong();
    }
  }

  _buildOverlay() {
    const div = document.createElement("div");
    div.id = "quiz-overlay";
    div.innerHTML = `
      <div class="q-paper">
        <div class="q-npc">
          <div class="q-npc-face">🎓</div>
          <div class="q-npc-bubble">¡Rápido! Resuelve esto para romper el muro.</div>
        </div>
        <span class="q-diff"></span>
        <div class="q-text"></div>
        <div class="q-opts"></div>
      </div>
    `;
    document.body.appendChild(div);
    this.overlay = div;
  }

  _injectStylesIfNeeded() {
    if (document.getElementById("quiz-overlay-styles")) return;
    const css = document.createElement("style");
    css.id = "quiz-overlay-styles";
    css.textContent = `
      #quiz-overlay {
        position: fixed; inset: 0; z-index: 9999;
        background: rgba(5, 5, 15, 0.88);
        backdrop-filter: blur(8px);
        display: none; align-items: center; justify-content: center;
        font-family: 'Trebuchet MS', system-ui, sans-serif; color: #1a1a1a;
      }
      #quiz-overlay.active { display: flex; }
      .q-paper {
        background: repeating-linear-gradient(#fefefe 0 31px, #cfd8e3 31px 32px);
        border: 1px solid #b0b8c5; border-left: 6px solid #e74c3c;
        border-radius: 6px; padding: 36px 40px 32px;
        max-width: 720px; width: 92%;
        box-shadow: 0 25px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05) inset;
        position: relative;
        animation: q-pop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      }
      @keyframes q-pop { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      .q-npc {
        display: flex; align-items: center; gap: 12px; margin-bottom: 18px;
      }
      .q-npc-face {
        font-size: 36px; width: 56px; height: 56px;
        background: #fde047; border: 2px solid #1a1a1a; border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
      }
      .q-npc-bubble {
        background: #fff; border: 2px solid #1a1a1a; border-radius: 12px;
        padding: 8px 14px; font-size: 14px; position: relative;
      }
      .q-npc-bubble::before {
        content: ''; position: absolute; left: -10px; top: 50%;
        transform: translateY(-50%);
        border: 8px solid transparent; border-right-color: #1a1a1a;
      }
      .q-diff {
        display: inline-block; padding: 4px 14px; border-radius: 50px;
        font-size: 12px; font-weight: 700; letter-spacing: 1px;
        text-transform: uppercase; color: #fff; margin-bottom: 14px;
      }
      .diff-Fácil { background: #10b981; }
      .diff-Media { background: #f59e0b; }
      .diff-Difícil { background: #ef4444; }
      .q-text {
        font-size: 22px; font-weight: 600; margin-bottom: 24px; line-height: 1.4;
        color: #1a1a1a; font-family: 'Comic Sans MS', cursive;
      }
      .q-opts { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
      .q-opt {
        padding: 16px; font-size: 16px; font-weight: 600;
        background: #fff; color: #1a1a1a;
        border: 2px solid #1a1a1a; border-radius: 10px;
        cursor: pointer; transition: 0.15s; font-family: inherit;
        box-shadow: 3px 3px 0 #1a1a1a;
      }
      .q-opt:hover {
        background: #fde047; transform: translate(-2px, -2px);
        box-shadow: 5px 5px 0 #1a1a1a;
      }
      .q-opt:active {
        transform: translate(2px, 2px); box-shadow: 1px 1px 0 #1a1a1a;
      }
    `;
    document.head.appendChild(css);
  }
}

// ----- 5. SPAWNER DE TRIGGERS POR DISTANCIA ---------------------------------
// Llamar cada frame con la distancia recorrida; emite triggers cada `every` metros.
export class TriggerSpawner {
  constructor({ every = 100, groundY, totalQuestions = 10 }) {
    this.every = every;
    this.groundY = groundY;
    this.totalQuestions = totalQuestions;
    this.spawned = 0;
    this.triggers = [];
  }

  update(currentDistance, scrollDx, screenWidth) {
    // Spawn cuando la distancia "objetivo" del próximo trigger esté a punto de aparecer
    const targetDist = (this.spawned + 1) * this.every;
    const lookAhead = 50; // metros de ventaja para dibujarlo viniendo
    if (this.spawned < this.totalQuestions && currentDistance >= targetDist - lookAhead) {
      this.triggers.push(new QuizTrigger(screenWidth + 50, this.groundY - 80));
      this.spawned++;
    }
    // Mover y limpiar
    for (const t of this.triggers) t.update(scrollDx);
    this.triggers = this.triggers.filter(t => !t.consumed && t.x + t.w > -20);
  }

  draw(ctx) { for (const t of this.triggers) t.draw(ctx); }

  checkCollision(player) {
    for (const t of this.triggers) {
      if (t.collidesWith(player)) { t.consumed = true; return true; }
    }
    return false;
  }
}
