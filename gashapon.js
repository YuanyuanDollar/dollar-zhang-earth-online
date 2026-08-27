/* =============================================================================
   gashapon.js — the capsule-toy experience in the "Beyond Work" section.

   Flow (one explicit state machine, no scattered booleans):
     idle → coinInserting → readyToTurn → turning → capsuleDropping
          → capsuleReady → opening → storyRevealed → (try again) → idle

   Story text lives in capsule-stories.js. Nothing in this file needs editing
   to change content.

   Audio: drops optional .mp3 files in ./audio/gashapon/. If a file is missing,
   a small WebAudio synth stands in so the module always has sound. Nothing is
   created or played until the visitor's first click inside the module.
   ========================================================================== */

(() => {
  "use strict";

  const root = document.querySelector("[data-gashapon]");
  if (!root) return;

  /* --------------------------------------------------------------- elements */

  const stage = root.querySelector("[data-gasha-stage]");
  const knob = root.querySelector("[data-gasha-knob]");
  const knobHot = root.querySelector("[data-gasha-handle]");
  const innerCapsules = root.querySelector(".gasha-machine-inner");
  const coin = root.querySelector("[data-gasha-coin]");
  const capsule = root.querySelector("[data-gasha-capsule]");
  const capTop = capsule.querySelector(".is-top");
  const capBottom = capsule.querySelector(".is-bottom");
  const burst = root.querySelector("[data-gasha-burst]");
  const hintTurn = root.querySelector("[data-gasha-hint='turn']");
  const hintOpen = root.querySelector("[data-gasha-hint='open']");
  const statusLine = root.querySelector("[data-gasha-status]");
  const legend = root.querySelector("[data-gasha-legend]");
  const reveal = root.querySelector("[data-gasha-reveal]");
  const collection = root.querySelector("[data-gasha-collection]");
  const progress = root.querySelector("[data-gasha-progress]");
  const againBtn = root.querySelector("[data-gasha-again]");
  const collectionBtn = root.querySelector("[data-gasha-collection-toggle]");
  const soundBtn = root.querySelector("[data-gasha-sound]");

  /* ------------------------------------------------------- machine geometry
     Fractions of the machine artwork (1086 × 1448) — measured from the
     painting, so every layer lines up at any size. */

  const ANCHOR = {
    slot: { x: 0.741, y: 0.669 }, // mouth of the coin slot
    knob: { x: 0.509, y: 0.73 }, // centre of the dial
    exit: { x: 0.5, y: 0.808 }, // where a capsule appears in the chute
    tray: { x: 0.502, y: 0.872 }, // resting spot in the collection tray
    coinWide: { x: 1.09, y: 0.63 }, // coin parked beside the machine (desktop)
    coinNarrow: { x: 0.72, y: 1.06 }, // coin parked under the machine (mobile)
  };

  const CAP_RATIO = 0.17; // capsule width, as a fraction of machine width
  const COIN_RATIO = 0.16;
  const NARROW = window.matchMedia("(max-width: 900px)");
  const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)");

  const EASE = {
    out: "cubic-bezier(0.22, 1, 0.36, 1)",
    in: "cubic-bezier(0.55, 0, 0.85, 0.35)",
    soft: "cubic-bezier(0.4, 0, 0.2, 1)",
    pop: "cubic-bezier(0.2, 0.9, 0.25, 1.15)",
    gear: "cubic-bezier(0.5, 0.02, 0.2, 1)",
  };

  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const ms = (value) => (REDUCED.matches ? Math.min(value, 120) : value);

  /* ------------------------------------------------------------------ audio
     Real files if they exist, a tiny synth if they don't. */

  const AudioKit = (() => {
    const FILES = {
      coin: "coin-insert",
      handle: "handle-turn",
      rattle: "capsule-rattle",
      drop: "capsule-drop",
      open: "capsule-open",
      paper: "paper-reveal",
    };
    const BASE = "./audio/gashapon/";
    const buffers = Object.create(null);

    let ctx = null;
    let master = null;
    let noise = null;
    let ready = false;
    let enabled = true;

    try {
      enabled = window.localStorage.getItem("dollar.gashapon.sound") !== "off";
    } catch (error) {
      enabled = true;
    }

    const makeNoise = () => {
      const length = ctx.sampleRate * 1.2;
      const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < length; i += 1) data[i] = Math.random() * 2 - 1;
      return buffer;
    };

    const init = () => {
      if (ready) return;
      const Ctor = window.AudioContext || window.webkitAudioContext;
      if (!Ctor) return;
      ctx = new Ctor();
      master = ctx.createGain();
      master.gain.value = 0.55;
      master.connect(ctx.destination);
      noise = makeNoise();
      ready = true;
      Object.keys(FILES).forEach((key) => {
        fetch(`${BASE}${FILES[key]}.mp3`)
          .then((response) => (response.ok ? response.arrayBuffer() : Promise.reject()))
          .then((data) => ctx.decodeAudioData(data))
          .then((decoded) => {
            buffers[key] = decoded;
          })
          .catch(() => {
            buffers[key] = null; // fall back to the synth
          });
      });
    };

    /* ---- little synth voices ---- */

    const burstOfNoise = (start, length, freq, q, gain, type = "bandpass") => {
      const source = ctx.createBufferSource();
      source.buffer = noise;
      source.playbackRate.value = 1;
      const filter = ctx.createBiquadFilter();
      filter.type = type;
      filter.frequency.value = freq;
      filter.Q.value = q;
      const amp = ctx.createGain();
      amp.gain.setValueAtTime(0.0001, start);
      amp.gain.exponentialRampToValueAtTime(gain, start + 0.006);
      amp.gain.exponentialRampToValueAtTime(0.0001, start + length);
      source.connect(filter);
      filter.connect(amp);
      amp.connect(master);
      source.start(start, Math.random() * 0.5);
      source.stop(start + length + 0.02);
    };

    const tone = (start, from, to, length, gain, type = "sine") => {
      const osc = ctx.createOscillator();
      const amp = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(from, start);
      osc.frequency.exponentialRampToValueAtTime(Math.max(to, 1), start + length);
      amp.gain.setValueAtTime(0.0001, start);
      amp.gain.exponentialRampToValueAtTime(gain, start + 0.01);
      amp.gain.exponentialRampToValueAtTime(0.0001, start + length);
      osc.connect(amp);
      amp.connect(master);
      osc.start(start);
      osc.stop(start + length + 0.02);
    };

    const synth = {
      coin(now) {
        tone(now, 1980, 1620, 0.26, 0.06, "triangle");
        tone(now + 0.012, 2760, 2340, 0.2, 0.035, "triangle");
        burstOfNoise(now + 0.16, 0.07, 1400, 3, 0.05);
      },
      handle(now) {
        const total = 1.0;
        let t = now;
        let gap = 0.036;
        while (t < now + total) {
          burstOfNoise(t, 0.035, 2100 + Math.random() * 900, 6, 0.045);
          gap *= 1.075;
          t += gap;
        }
        tone(now, 96, 66, total, 0.028, "sawtooth");
      },
      rattle(now) {
        for (let i = 0; i < 7; i += 1) {
          burstOfNoise(now + Math.random() * 0.5, 0.05, 900 + Math.random() * 1100, 5, 0.035);
        }
      },
      drop(now) {
        tone(now, 300, 96, 0.16, 0.09, "sine");
        burstOfNoise(now, 0.09, 620, 1.2, 0.07, "lowpass");
        tone(now + 0.19, 250, 110, 0.1, 0.045, "sine");
        burstOfNoise(now + 0.19, 0.06, 700, 1.2, 0.035, "lowpass");
        burstOfNoise(now + 0.34, 0.05, 800, 1.4, 0.02, "lowpass");
      },
      open(now) {
        burstOfNoise(now, 0.045, 3100, 8, 0.11);
        tone(now + 0.01, 1500, 640, 0.09, 0.05, "square");
        burstOfNoise(now + 0.07, 0.05, 1800, 4, 0.04);
      },
      paper(now) {
        const source = ctx.createBufferSource();
        source.buffer = noise;
        const filter = ctx.createBiquadFilter();
        filter.type = "bandpass";
        filter.Q.value = 1.1;
        filter.frequency.setValueAtTime(700, now);
        filter.frequency.exponentialRampToValueAtTime(2800, now + 0.3);
        const amp = ctx.createGain();
        amp.gain.setValueAtTime(0.0001, now);
        amp.gain.exponentialRampToValueAtTime(0.038, now + 0.08);
        amp.gain.exponentialRampToValueAtTime(0.0001, now + 0.34);
        source.connect(filter);
        filter.connect(amp);
        amp.connect(master);
        source.start(now, Math.random() * 0.4);
        source.stop(now + 0.36);
      },
    };

    return {
      unlock() {
        init();
        if (ctx && ctx.state === "suspended") ctx.resume().catch(() => {});
      },
      get enabled() {
        return enabled;
      },
      toggle() {
        enabled = !enabled;
        try {
          window.localStorage.setItem("dollar.gashapon.sound", enabled ? "on" : "off");
        } catch (error) {
          /* private mode — just keep it in memory */
        }
        if (enabled) this.unlock();
        return enabled;
      },
      play(name) {
        if (!enabled) return;
        this.unlock();
        if (!ready || !ctx) return;
        const now = ctx.currentTime + 0.01;
        const buffer = buffers[name];
        if (buffer) {
          const source = ctx.createBufferSource();
          source.buffer = buffer;
          source.connect(master);
          source.start(now);
          return;
        }
        if (synth[name]) synth[name](now);
      },
    };
  })();

  /* -------------------------------------------------------- story selection */

  const STORAGE_KEY = "dollar.gashapon.seen.v1";
  const stories = Array.isArray(window.capsuleStories) ? window.capsuleStories : [];
  const categories = Array.isArray(window.capsuleCategories) ? window.capsuleCategories : [];
  const colorOf = (story) =>
    story.color ||
    (categories.find((entry) => entry.label === story.category) || {}).color ||
    "blue";

  const readSeen = () => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      return [];
    }
  };

  let seen = readSeen().filter((id) => stories.some((story) => story.id === id));
  let lastId = null;
  let currentStory = null;

  const remember = (story) => {
    if (seen.includes(story.id)) return;
    seen.push(story.id);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seen));
    } catch (error) {
      /* nothing to do — the collection just won't survive a refresh */
    }
  };

  const pickStory = () => {
    if (!stories.length) return null;
    let pool = stories.filter((story) => !seen.includes(story.id));
    if (!pool.length) pool = stories.slice();
    if (pool.length > 1 && lastId !== null) {
      const withoutLast = pool.filter((story) => story.id !== lastId);
      if (withoutLast.length) pool = withoutLast;
    }
    return pool[Math.floor(Math.random() * pool.length)];
  };

  /* ------------------------------------------------------------- layout maths
     Everything is measured against .gasha so the capsule and coin can travel
     from the machine into the panel without changing parents. */

  const P = {};

  const measure = () => {
    const rootBox = root.getBoundingClientRect();
    const stageBox = stage.getBoundingClientRect();
    const x = stageBox.left - rootBox.left;
    const y = stageBox.top - rootBox.top;
    const w = stageBox.width;
    const h = stageBox.height;

    const at = (anchor) => ({ x: x + w * anchor.x, y: y + h * anchor.y });

    P.slot = at(ANCHOR.slot);
    P.knob = at(ANCHOR.knob);
    P.exit = at(ANCHOR.exit);
    P.tray = at(ANCHOR.tray);
    P.coin = at(NARROW.matches ? ANCHOR.coinNarrow : ANCHOR.coinWide);
    P.capSize = w * CAP_RATIO;
    P.coinSize = w * COIN_RATIO;

    const swap = root.querySelector(".gasha-swap").getBoundingClientRect();
    P.focus = {
      x: swap.left - rootBox.left + swap.width / 2,
      y: swap.top - rootBox.top + Math.min(swap.height / 2, 130),
    };

    root.style.setProperty("--gs-cap", `${P.capSize}px`);
    root.style.setProperty("--gs-coin", `${P.coinSize}px`);
  };

  const placeCoin = () => {
    coin.style.transition = "none";
    coin.style.transform = `translate3d(${P.coin.x}px, ${P.coin.y}px, 0)`;
    coin.style.opacity = "1";
    void coin.offsetWidth;
    coin.style.transition = "";
  };

  const moveCoin = (x, y, scale, rotate, duration, easing) => {
    coin.style.transitionProperty = "transform, opacity";
    coin.style.transitionDuration = `${duration}ms`;
    coin.style.transitionTimingFunction = easing;
    coin.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale}) rotate(${rotate}deg)`;
  };

  const moveCapsule = (x, y, scale, rotate, duration, easing) => {
    capsule.style.transitionProperty = "transform, opacity";
    capsule.style.transitionDuration = `${duration}ms`;
    capsule.style.transitionTimingFunction = easing;
    capsule.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale}) rotate(${rotate}deg)`;
  };

  /* ------------------------------------------------------------ state machine */

  const STATUS = {
    idle: "Ready — drop in your dollar.",
    coinInserting: "Coin accepted…",
    readyToTurn: "Now turn the handle.",
    turning: "Turning…",
    capsuleDropping: "Something is on its way…",
    capsuleReady: "A capsule landed in the tray.",
    opening: "Opening…",
    storyRevealed: "Story unlocked.",
  };

  let state = "idle";
  let busy = false;

  const setState = (next) => {
    state = next;
    root.dataset.state = next;
    statusLine.textContent = STATUS[next] || "";
    coin.disabled = next !== "idle";
    knobHot.disabled = next !== "readyToTurn";
    capsule.disabled = next !== "capsuleReady";
    capsule.classList.toggle("is-grabbable", next === "capsuleReady");
    hintTurn.classList.toggle("is-shown", next === "readyToTurn");
    hintOpen.classList.toggle("is-shown", next === "capsuleReady");
    againBtn.hidden = next !== "storyRevealed";
  };

  /* ------------------------------------------------------------------ visuals */

  const setKnobAngle = (deg, duration, easing) => {
    knob.style.transitionProperty = duration ? "transform" : "none";
    knob.style.transitionDuration = `${duration || 0}ms`;
    knob.style.transitionTimingFunction = easing || EASE.soft;
    knob.style.setProperty("--knob-rot", `${deg}deg`);
  };

  const restartAnimation = (element, className) => {
    element.classList.remove(className);
    void element.offsetWidth;
    element.classList.add(className);
  };

  const fireBurst = (x, y) => {
    if (REDUCED.matches) return;
    burst.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    [...burst.children].forEach((spark, index) => {
      const angle = (-140 + index * 46 + Math.random() * 22) * (Math.PI / 180);
      const distance = P.capSize * (0.9 + Math.random() * 0.7);
      spark.style.setProperty("--bx", `${Math.cos(angle) * distance}px`);
      spark.style.setProperty("--by", `${Math.sin(angle) * distance}px`);
      spark.style.setProperty("--br", `${-60 + Math.random() * 120}deg`);
      spark.style.animationDelay = `${index * 28}ms`;
    });
    restartAnimation(burst, "is-firing");
  };

  const paintCapsule = (story) => {
    const color = colorOf(story);
    capsule.style.setProperty("--cap-img", `url("./assets/capsule-${color}.webp")`);
    capsule.setAttribute("aria-label", `Open the ${story.category.toLowerCase()} capsule`);
    capTop.style.transition = "none";
    capBottom.style.transition = "none";
    capTop.style.transform = "none";
    capBottom.style.transform = "none";
    capTop.style.opacity = "1";
    capBottom.style.opacity = "1";
    void capsule.offsetWidth;
    capTop.style.transition = "";
    capBottom.style.transition = "";
  };

  /* ------------------------------------------------------------- story card */

  const svgPin = () =>
    `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s7-5.2 7-11a7 7 0 1 0-14 0c0 5.8 7 11 7 11Z"></path><circle cx="12" cy="10" r="2.5"></circle></svg>`;

  const renderCard = (story, animate) => {
    const color = colorOf(story);
    reveal.innerHTML = "";

    const card = document.createElement("article");
    card.className = "gasha-card";
    card.style.setProperty("--card-tone", `var(--cap-${color})`);
    card.style.setProperty("--card-ink", `var(--cap-${color}-ink)`);

    const head = document.createElement("div");
    head.className = "gasha-card-head";
    const thumb = document.createElement("img");
    thumb.src = `./assets/capsule-${color}.webp`;
    thumb.alt = "";
    thumb.setAttribute("aria-hidden", "true");
    const chip = document.createElement("span");
    chip.className = "gasha-card-chip";
    chip.textContent = story.category;
    head.append(thumb, chip);

    const title = document.createElement("h3");
    title.textContent = story.title;

    const body = document.createElement("p");
    body.textContent = story.story;

    card.append(head, title, body);

    if (story.meta) {
      const meta = document.createElement("p");
      meta.className = "gasha-card-meta";
      meta.innerHTML = svgPin();
      meta.append(document.createTextNode(story.meta));
      card.append(meta);
    }

    if (animate) card.classList.add("is-entering");
    reveal.append(card);
    reveal.hidden = false;
    legend.hidden = true;
    collection.hidden = true;
    collectionBtn.setAttribute("aria-expanded", "false");
    collectionBtn.textContent = "View collection";

    if (animate) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => card.classList.remove("is-entering"));
      });
    }
    return card;
  };

  const updateProgress = () => {
    progress.textContent = `${seen.length} / ${stories.length} stories discovered`;
    [...legend.children].forEach((item) => {
      const found = stories.some(
        (story) => story.category === item.dataset.category && seen.includes(story.id)
      );
      item.classList.toggle("is-found", found);
    });
  };

  const renderCollection = () => {
    collection.innerHTML = "";
    const found = stories.filter((story) => seen.includes(story.id));
    if (!found.length) {
      const empty = document.createElement("p");
      empty.className = "gasha-collection-empty";
      empty.textContent = "Nothing collected yet — turn the handle once.";
      collection.append(empty);
      return;
    }
    found.forEach((story) => {
      const color = colorOf(story);
      const item = document.createElement("li");
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "gasha-chip";
      const thumb = document.createElement("img");
      thumb.src = `./assets/capsule-${color}.webp`;
      thumb.alt = "";
      const text = document.createElement("span");
      const label = document.createElement("b");
      label.textContent = story.title;
      const cat = document.createElement("span");
      cat.textContent = story.category;
      text.append(label, cat);
      chip.append(thumb, text);
      chip.addEventListener("click", () => {
        currentStory = story;
        renderCard(story, true);
        AudioKit.play("paper");
      });
      item.append(chip);
      collection.append(item);
    });
  };

  /* ---------------------------------------------------------- the sequences */

  const insertCoin = async () => {
    if (busy || state !== "idle") return;
    busy = true;
    AudioKit.unlock();
    setState("coinInserting");
    measure();

    moveCoin(P.coin.x, P.coin.y - P.coinSize * 0.22, 1.08, -6, ms(150), EASE.out);
    await wait(ms(150));

    moveCoin(P.slot.x, P.slot.y, 0.34, -212, ms(520), EASE.gear);
    await wait(ms(520));

    AudioKit.play("coin");
    moveCoin(P.slot.x, P.slot.y + P.coinSize * 0.1, 0.1, -250, ms(180), EASE.in);
    coin.style.opacity = "0";
    await wait(ms(180));

    setState("readyToTurn");
    busy = false;
  };

  const dropCapsule = async () => {
    setState("capsuleDropping");
    measure();

    const story = pickStory();
    if (!story) {
      setState("idle");
      busy = false;
      return;
    }
    currentStory = story;
    paintCapsule(story);

    const floor = P.tray.y;
    capsule.classList.add("is-live");
    moveCapsule(P.exit.x, P.exit.y - P.capSize * 0.15, 0.55, -18, 0, EASE.soft);
    capsule.style.opacity = "0";
    void capsule.offsetWidth;

    moveCapsule(P.exit.x, P.exit.y + P.capSize * 0.1, 0.82, -8, ms(140), EASE.out);
    capsule.style.opacity = "1";
    await wait(ms(140));

    moveCapsule(P.tray.x + P.capSize * 0.12, floor, 1, 6, ms(240), EASE.in);
    await wait(ms(230));
    AudioKit.play("drop");

    moveCapsule(P.tray.x + P.capSize * 0.06, floor - P.capSize * 0.34, 1, -7, ms(190), EASE.out);
    await wait(ms(190));

    moveCapsule(P.tray.x - P.capSize * 0.02, floor, 1, 4, ms(150), EASE.in);
    await wait(ms(150));

    moveCapsule(P.tray.x - P.capSize * 0.04, floor - P.capSize * 0.11, 1, -2, ms(120), EASE.out);
    await wait(ms(120));

    moveCapsule(P.tray.x, floor, 1, 0, ms(150), EASE.out);
    await wait(ms(150));

    setState("capsuleReady");
    busy = false;
  };

  const runTurn = async () => {
    busy = true;
    setState("turning");
    AudioKit.play("handle");
    AudioKit.play("rattle");
    restartAnimation(stage, "is-turning");
    restartAnimation(innerCapsules, "is-rattling");

    setKnobAngle(372, ms(950), EASE.gear);
    await wait(ms(950));
    setKnobAngle(360, ms(170), EASE.out);
    await wait(ms(170));
    setKnobAngle(0, 0);

    await dropCapsule();
  };

  const openCapsule = async () => {
    if (busy || state !== "capsuleReady") return;
    busy = true;
    setState("opening");
    measure();

    /* STATE 4 — pick it up and bring it to the middle of the panel */
    const lift = P.capSize * 0.5;
    moveCapsule(P.tray.x, P.tray.y - lift, 1.25, -5, ms(220), EASE.out);
    await wait(ms(200));
    moveCapsule(P.focus.x, P.focus.y, 1.85, 0, ms(460), EASE.pop);
    await wait(ms(470));

    /* STATE 5 — wiggle, tension, split */
    restartAnimation(capsule, "is-wiggling");
    await wait(ms(430));
    capsule.classList.remove("is-wiggling");
    await wait(ms(110));

    AudioKit.play("open");
    fireBurst(P.focus.x, P.focus.y);

    const split = ms(520);
    capTop.style.transition = `transform ${split}ms ${EASE.out}, opacity ${split}ms ease`;
    capBottom.style.transition = `transform ${split}ms ${EASE.out}`;
    capTop.style.transform = "translate3d(6%, -58%, 0) rotate(-15deg) scale(1.04)";
    capTop.style.opacity = "0";
    capBottom.style.transform = "translate3d(0, 5%, 0)";
    await wait(ms(200));

    /* STATE 6 — the card rises out of the capsule */
    AudioKit.play("paper");
    const card = renderCard(currentStory, true);
    remember(currentStory);
    lastId = currentStory.id;
    updateProgress();
    await wait(ms(260));

    /* tuck the empty bottom half under the card, like the card is sitting in it */
    const rootBox = root.getBoundingClientRect();
    const cardBox = card.getBoundingClientRect();
    moveCapsule(
      cardBox.left - rootBox.left + cardBox.width / 2,
      cardBox.bottom - rootBox.top - P.capSize * 0.06,
      0.92,
      -3,
      ms(420),
      EASE.out
    );
    capsule.style.zIndex = "1";

    setState("storyRevealed");
    busy = false;
  };

  const resetMachine = () => {
    if (busy) return;
    measure();
    capsule.style.transition = "none";
    capsule.style.opacity = "0";
    capsule.style.zIndex = "";
    capsule.classList.remove("is-live", "is-wiggling");
    void capsule.offsetWidth;
    capsule.style.transition = "";

    reveal.hidden = true;
    reveal.innerHTML = "";
    collection.hidden = true;
    collectionBtn.setAttribute("aria-expanded", "false");
    collectionBtn.textContent = "View collection";
    legend.hidden = false;

    setKnobAngle(0, 0);
    placeCoin();
    setState("idle");
  };

  /* ----------------------------------------------------- handle interaction */

  const angleAt = (event, cx, cy) =>
    (Math.atan2(event.clientY - cy, event.clientX - cx) * 180) / Math.PI;

  let drag = null;

  knobHot.addEventListener("pointerdown", (event) => {
    if (state !== "readyToTurn" || busy) return;
    const box = stage.getBoundingClientRect();
    const cx = box.left + box.width * ANCHOR.knob.x;
    const cy = box.top + box.height * ANCHOR.knob.y;
    drag = {
      id: event.pointerId,
      cx,
      cy,
      last: angleAt(event, cx, cy),
      total: 0,
      ticks: 0,
      moved: false,
    };
    knobHot.setPointerCapture(event.pointerId);
    AudioKit.unlock();
  });

  knobHot.addEventListener("pointermove", (event) => {
    if (!drag || event.pointerId !== drag.id) return;
    const angle = angleAt(event, drag.cx, drag.cy);
    let delta = angle - drag.last;
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;
    drag.last = angle;
    drag.total = Math.max(0, drag.total + delta);
    if (drag.total > 8) drag.moved = true;
    setKnobAngle(drag.total, 0);

    const tick = Math.floor(drag.total / 26);
    if (tick > drag.ticks) {
      drag.ticks = tick;
      AudioKit.play("rattle");
    }

    if (drag.total >= 200) {
      const finished = drag;
      drag = null;
      try {
        knobHot.releasePointerCapture(finished.id);
      } catch (error) {
        /* pointer already gone */
      }
      restartAnimation(innerCapsules, "is-rattling");
      setKnobAngle(360, ms(380), EASE.out);
      window.setTimeout(() => {
        setKnobAngle(0, 0);
        dropCapsule();
      }, ms(390));
      busy = true;
      setState("turning");
      AudioKit.play("rattle");
    }
  });

  const endDrag = (event) => {
    if (!drag || (event && event.pointerId !== drag.id)) return;
    const finished = drag;
    drag = null;
    if (!finished.moved) {
      runTurn();
      return;
    }
    setKnobAngle(0, ms(420), EASE.out);
  };

  knobHot.addEventListener("pointerup", endDrag);
  knobHot.addEventListener("pointercancel", endDrag);
  knobHot.addEventListener("lostpointercapture", endDrag);

  knobHot.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    if (state === "readyToTurn" && !busy) runTurn();
  });

  /* ------------------------------------------------------------------ wiring */

  coin.addEventListener("click", (event) => {
    event.preventDefault();
    insertCoin();
  });

  capsule.addEventListener("click", (event) => {
    event.preventDefault();
    openCapsule();
  });

  againBtn.addEventListener("click", resetMachine);

  collectionBtn.addEventListener("click", () => {
    const open = collectionBtn.getAttribute("aria-expanded") === "true";
    if (open) {
      collection.hidden = true;
      collectionBtn.setAttribute("aria-expanded", "false");
      collectionBtn.textContent = "View collection";
      if (state === "storyRevealed" && currentStory) {
        renderCard(currentStory, false);
      } else {
        reveal.hidden = true;
        legend.hidden = false;
      }
      return;
    }
    renderCollection();
    legend.hidden = true;
    reveal.hidden = true;
    collection.hidden = false;
    collectionBtn.setAttribute("aria-expanded", "true");
    collectionBtn.textContent = "Hide collection";
  });

  soundBtn.addEventListener("click", () => {
    const on = AudioKit.toggle();
    soundBtn.setAttribute("aria-pressed", String(on));
    soundBtn.setAttribute("aria-label", on ? "Turn machine sound off" : "Turn machine sound on");
    if (on) AudioKit.play("open");
  });

  /* ------------------------------------------------------------------- boot */

  const relayout = () => {
    measure();
    if (state === "idle") placeCoin();
    if (state === "capsuleReady") moveCapsule(P.tray.x, P.tray.y, 1, 0, 0, EASE.soft);
  };

  if ("ResizeObserver" in window) {
    let first = true;
    const observer = new ResizeObserver(() => {
      if (first) {
        first = false;
        return;
      }
      relayout();
    });
    observer.observe(root);
  }
  window.addEventListener("resize", relayout);
  window.addEventListener("orientationchange", relayout);

  if ("IntersectionObserver" in window) {
    const visibility = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => root.classList.toggle("is-paused", !entry.isIntersecting));
      },
      { threshold: 0.02 }
    );
    visibility.observe(root);
  }

  soundBtn.setAttribute("aria-pressed", String(AudioKit.enabled));
  soundBtn.setAttribute(
    "aria-label",
    AudioKit.enabled ? "Turn machine sound off" : "Turn machine sound on"
  );

  updateProgress();
  measure();
  placeCoin();
  setState("idle");

  /* the machine image decides the stage height — re-measure once it has loaded */
  const machine = root.querySelector(".gasha-machine");
  if (machine && !machine.complete) {
    machine.addEventListener("load", relayout, { once: true });
  }
  window.addEventListener("load", relayout, { once: true });
})();
