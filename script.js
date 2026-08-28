if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

window.addEventListener("pageshow", () => {
  if (!window.location.hash) window.scrollTo(0, 0);
});

const badge = document.querySelector("#draggableBadge");
const lanyardRig = document.querySelector(".lanyard-rig");
const leftLanyardPath = document.querySelector("#leftLanyardPath");
const rightLanyardPath = document.querySelector("#rightLanyardPath");
const leftLanyardShadow = document.querySelector("#leftLanyardShadow");
const rightLanyardShadow = document.querySelector("#rightLanyardShadow");
const strapBrandMarks = [...document.querySelectorAll(".strap-brand")];
const heroVideo = document.querySelector(".hero-character-video-source");
const heroCanvas = document.querySelector(".hero-character-canvas");
const blurHighlights = document.querySelectorAll("[data-blur-highlight]");
const scatterTitle = document.querySelector("[data-text-scatter]");
const heroSection = document.querySelector(".hero-section");
const introSection = document.querySelector(".intro-section");
const badgeCard = document.querySelector(".badge-card");
const badgeSignature = document.querySelector(".badge-signature");
const journeyReveal = document.querySelector("[data-3d-text-reveal]");
const centerTimeline = document.querySelector(".center-timeline");
const timelineItems = [...document.querySelectorAll(".timeline-item")];
const coverflowCarousel = document.querySelector("[data-coverflow]");
const topNavLinks = [...document.querySelectorAll(".top-nav a")];
const smoothCursorCanvas = document.querySelector(".smooth-cursor-canvas");
const easterEggs = [...document.querySelectorAll("[data-easter-egg]")];
const portfolioTextPath = document.querySelector("[data-text-path]");
const missingContactLinks = [...document.querySelectorAll("[data-contact-missing]")];
const onlineGlobe = document.querySelector(".online-globe");
const freelyProjectDialog = document.querySelector("#freelyProjectDialog");
const freelyProjectTrigger = document.querySelector("[data-open-freely]");
const freelyProjectClose = document.querySelector("[data-close-project]");
const projectViewTabs = [...document.querySelectorAll("[data-project-tab]")];
const projectViewPanels = [...document.querySelectorAll("[data-project-panel]")];
const projectViewers = [...document.querySelectorAll(".project-viewer")];
const portfolioReportDialog = document.querySelector("#portfolioReportDialog");
const portfolioReportClose = document.querySelector("[data-close-report]");
const portfolioReportIndex = document.querySelector("[data-report-index]");
const portfolioReportMeta = document.querySelector("[data-report-meta]");
const portfolioReportLink = document.querySelector("[data-report-link]");
const portfolioReportViewer = document.querySelector("[data-report-viewer]");
const portfolioReportPanel = document.querySelector("[data-report-panel]");
const spaceYProjectIntro = document.querySelector("[data-spacey-intro]");
const projectIntroPages = [...document.querySelectorAll("[data-project-intro]")];
const freelyIntroPanel = document.querySelector("[data-freely-intro-panel]");
const freelyIntroBlock = document.querySelector("[data-freely-intro]");
let activePortfolioReportTrigger = null;
let spaceYReportRestoreTop = null;

const initOnlineGlobe = () => {
  if (!onlineGlobe || !window.THREE) return;

  try {
    const renderer = new THREE.WebGLRenderer({ canvas: onlineGlobe, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);
    if (THREE.sRGBEncoding) renderer.outputEncoding = THREE.sRGBEncoding;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    camera.position.set(0, 0, 4.1);

    const textureCanvas = document.createElement("canvas");
    textureCanvas.width = 1024;
    textureCanvas.height = 512;
    const context = textureCanvas.getContext("2d");
    const ocean = context.createLinearGradient(0, 0, 0, textureCanvas.height);
    ocean.addColorStop(0, "#3f8ee8");
    ocean.addColorStop(0.48, "#1266bd");
    ocean.addColorStop(1, "#073b85");
    context.fillStyle = ocean;
    context.fillRect(0, 0, textureCanvas.width, textureCanvas.height);

    context.strokeStyle = "rgba(198, 229, 255, 0.16)";
    context.lineWidth = 1;
    for (let x = 0; x <= textureCanvas.width; x += 64) {
      context.beginPath();
      context.moveTo(x, 0);
      context.lineTo(x, textureCanvas.height);
      context.stroke();
    }
    for (let y = 64; y < textureCanvas.height; y += 64) {
      context.beginPath();
      context.moveTo(0, y);
      context.lineTo(textureCanvas.width, y);
      context.stroke();
    }

    const drawLand = (points, fill = "#62a957") => {
      context.beginPath();
      points.forEach(([x, y], index) => {
        if (index === 0) context.moveTo(x, y);
        else context.lineTo(x, y);
      });
      context.closePath();
      context.fillStyle = fill;
      context.fill();
      context.strokeStyle = "rgba(226, 240, 170, 0.72)";
      context.lineWidth = 3;
      context.stroke();
    };

    drawLand([[80,105],[130,70],[196,82],[245,112],[222,146],[185,158],[165,194],[125,202],[96,168],[58,151]], "#5a9f52");
    drawLand([[173,206],[218,220],[234,270],[219,323],[197,374],[181,432],[158,395],[149,337],[126,296],[142,245]], "#65aa55");
    drawLand([[430,93],[494,66],[560,75],[610,92],[676,91],[735,121],[791,137],[830,175],[803,207],[743,211],[707,190],[665,211],[628,197],[594,213],[566,185],[521,183],[488,156],[447,149]], "#6caf57");
    drawLand([[500,189],[551,198],[581,237],[570,282],[593,327],[557,388],[522,409],[484,364],[470,315],[448,272],[461,225]], "#63a651");
    drawLand([[818,326],[866,314],[904,332],[928,363],[905,395],[858,406],[821,383],[798,349]], "#72b45c");
    drawLand([[930,406],[947,399],[958,414],[948,430],[934,425]], "#72b45c");
    drawLand([[360,68],[389,52],[418,61],[426,84],[394,99],[367,91]], "#83b965");
    drawLand([[0,462],[160,448],[313,457],[470,445],[628,455],[788,446],[1024,460],[1024,512],[0,512]], "#d5e5cf");

    const mapTexture = new THREE.CanvasTexture(textureCanvas);
    mapTexture.wrapS = THREE.RepeatWrapping;
    mapTexture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    if (THREE.sRGBEncoding) mapTexture.encoding = THREE.sRGBEncoding;

    const globeGroup = new THREE.Group();
    globeGroup.rotation.z = -0.17;
    scene.add(globeGroup);

    const globe = new THREE.Mesh(
      new THREE.SphereGeometry(1, 64, 48),
      new THREE.MeshPhongMaterial({
        map: mapTexture,
        color: 0xffffff,
        shininess: 42,
        specular: new THREE.Color(0x9edaff)
      })
    );
    globe.rotation.y = -1.75;
    globeGroup.add(globe);

    const atmosphere = new THREE.Mesh(
      new THREE.SphereGeometry(1.035, 64, 48),
      new THREE.MeshBasicMaterial({
        color: 0x7bc8ff,
        transparent: true,
        opacity: 0.14,
        side: THREE.BackSide
      })
    );
    globeGroup.add(atmosphere);

    scene.add(new THREE.HemisphereLight(0xd9efff, 0x08295b, 1.35));
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.65);
    keyLight.position.set(-2.5, 2.8, 4);
    scene.add(keyLight);
    const rimLight = new THREE.DirectionalLight(0x4ea8ff, 0.75);
    rimLight.position.set(3, -1, -2);
    scene.add(rimLight);

    const resize = () => {
      const size = Math.max(32, Math.round(onlineGlobe.getBoundingClientRect().width));
      renderer.setSize(size, size, false);
      camera.aspect = 1;
      camera.updateProjectionMatrix();
    };
    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(onlineGlobe);

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let previousTime = performance.now();
    const render = (time) => {
      const delta = Math.min((time - previousTime) / 1000, 0.05);
      previousTime = time;
      if (!reducedMotion.matches) globe.rotation.y += delta * 0.48;
      renderer.render(scene, camera);
      requestAnimationFrame(render);
    };
    requestAnimationFrame(render);
  } catch (error) {
    const fallback = document.createElement("span");
    fallback.className = "online-globe-fallback";
    fallback.textContent = "🌏";
    onlineGlobe.replaceWith(fallback);
  }
};

initOnlineGlobe();

const activateProjectPanel = (name) => {
  projectViewTabs.forEach((tab) => {
    const isActive = tab.dataset.projectTab === name;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
    tab.tabIndex = isActive ? 0 : -1;
  });

  projectViewPanels.forEach((panel) => {
    const isActive = panel.dataset.projectPanel === name;
    panel.hidden = !isActive;
    if (!isActive) return;
    const viewer = panel.querySelector("iframe[data-src]");
    if (viewer && !viewer.getAttribute("src")) {
      viewer.closest(".project-view-stage")?.classList.remove("is-loaded");
      viewer.src = viewer.dataset.src;
    }
  });
};

projectViewers.forEach((viewer) => {
  viewer.addEventListener("load", () => {
    if (viewer.dataset.pendingSrc) return;
    viewer.closest(".project-view-stage")?.classList.add("is-loaded");
    if (
      viewer === portfolioReportViewer
      && portfolioReportPanel?.classList.contains("is-spacey-project")
      && spaceYReportRestoreTop !== null
    ) {
      const restoreTop = spaceYReportRestoreTop;
      const restoreScroll = () => {
        if (portfolioReportDialog?.open && portfolioReportPanel) portfolioReportPanel.scrollTop = restoreTop;
      };
      requestAnimationFrame(restoreScroll);
      window.setTimeout(restoreScroll, 120);
      window.setTimeout(() => {
        restoreScroll();
        spaceYReportRestoreTop = null;
      }, 500);
    }
  });
});

const loadPendingSpaceYReport = () => {
  if (!portfolioReportPanel || !portfolioReportViewer || !spaceYProjectIntro) return;
  const pendingSrc = portfolioReportViewer.dataset.pendingSrc;
  if (!pendingSrc || !portfolioReportPanel.classList.contains("is-spacey-project")) return;
  const loadThreshold = spaceYProjectIntro.offsetHeight - 160;
  if (portfolioReportPanel.scrollTop + portfolioReportPanel.clientHeight < loadThreshold) return;

  spaceYReportRestoreTop = portfolioReportPanel.scrollTop;
  delete portfolioReportViewer.dataset.pendingSrc;
  portfolioReportViewer.src = pendingSrc;
};

portfolioReportPanel?.addEventListener("scroll", loadPendingSpaceYReport, { passive: true });

const openFreelyProject = () => {
  if (!freelyProjectDialog) return;
  if (freelyIntroPanel) freelyIntroPanel.scrollTop = 0;
  freelyIntroBlock?.classList.remove("is-visible");
  freelyProjectDialog.showModal();
  document.body.classList.add("project-dialog-open");
  requestAnimationFrame(() => {
    if (freelyIntroPanel) freelyIntroPanel.scrollTop = 0;
    requestAnimationFrame(() => freelyIntroBlock?.classList.add("is-visible"));
  });
};

const openPortfolioReport = (trigger) => {
  if (!portfolioReportDialog || !portfolioReportViewer || !trigger) return;
  const { projectIndex, projectLabel, projectTitle, reportPages, reportSrc } = trigger.dataset;
  const reportUrl = reportSrc.split("#")[0];
  const introPage = projectIntroPages.find((page) => page.dataset.projectIntro === projectTitle);
  const hasProjectIntro = Boolean(introPage);
  activePortfolioReportTrigger = trigger;
  portfolioReportPanel?.classList.toggle("is-spacey-project", hasProjectIntro);
  projectIntroPages.forEach((page) => {
    page.hidden = page !== introPage;
  });
  if (portfolioReportPanel) portfolioReportPanel.scrollTop = 0;
  portfolioReportDialog.setAttribute("aria-label", `${projectTitle} project`);
  portfolioReportIndex.textContent = projectLabel || `${projectIndex} / Selected work`;
  portfolioReportMeta.textContent = `${projectTitle} · ${reportPages} pages`;
  portfolioReportLink.href = reportUrl;
  portfolioReportLink.setAttribute("aria-label", `Open ${projectTitle} report in a new tab`);
  portfolioReportViewer.title = `${projectTitle} report`;
  portfolioReportViewer.closest(".project-view-stage")?.classList.remove("is-loaded");
  if (hasProjectIntro) {
    delete portfolioReportViewer.dataset.pendingSrc;
    portfolioReportViewer.removeAttribute("src");
  } else {
    delete portfolioReportViewer.dataset.pendingSrc;
    portfolioReportViewer.src = reportSrc;
  }
  portfolioReportDialog.showModal();
  document.body.classList.add("project-dialog-open");

  requestAnimationFrame(() => {
    if (portfolioReportPanel) portfolioReportPanel.scrollTop = 0;
  });
  if (hasProjectIntro) {
    window.setTimeout(() => {
      if (portfolioReportDialog.open && activePortfolioReportTrigger === trigger && portfolioReportPanel) {
        portfolioReportPanel.scrollTop = 0;
      }
    }, 500);
  }

  if (introPage) {
    const highlightBlock = introPage.querySelector("[data-blur-highlight]");
    highlightBlock?.classList.remove("is-visible");
    requestAnimationFrame(() => requestAnimationFrame(() => highlightBlock?.classList.add("is-visible")));
  }
};

if (freelyProjectDialog && freelyProjectTrigger) {
  freelyProjectClose?.addEventListener("click", () => freelyProjectDialog.close());
  freelyProjectDialog.addEventListener("click", (event) => {
    if (event.target === freelyProjectDialog) freelyProjectDialog.close();
  });
  freelyProjectDialog.addEventListener("close", () => {
    document.body.classList.remove("project-dialog-open");
    freelyProjectTrigger.querySelector(".project-cover-button")?.focus({ preventScroll: true });
  });

  projectViewTabs.forEach((tab, index) => {
    tab.addEventListener("click", () => activateProjectPanel(tab.dataset.projectTab));
    tab.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      const direction = event.key === "ArrowRight" ? 1 : -1;
      const nextTab = projectViewTabs[(index + direction + projectViewTabs.length) % projectViewTabs.length];
      activateProjectPanel(nextTab.dataset.projectTab);
      nextTab.focus();
    });
  });
}

if (portfolioReportDialog && portfolioReportViewer) {
  portfolioReportClose?.addEventListener("click", () => portfolioReportDialog.close());
  portfolioReportDialog.addEventListener("click", (event) => {
    if (event.target === portfolioReportDialog) portfolioReportDialog.close();
  });
  portfolioReportDialog.addEventListener("close", () => {
    document.body.classList.remove("project-dialog-open");
    activePortfolioReportTrigger?.querySelector(".project-cover-button")?.focus({ preventScroll: true });
  });
}

missingContactLinks.forEach((link) => {
  link.addEventListener("click", (event) => event.preventDefault());
});

let bubbleAudioContext;

const playBubbleSound = () => {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;
  bubbleAudioContext ||= new AudioContext();

  const play = () => {
    const now = bubbleAudioContext.currentTime;
    const oscillator = bubbleAudioContext.createOscillator();
    const gain = bubbleAudioContext.createGain();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(390, now);
    oscillator.frequency.exponentialRampToValueAtTime(820, now + 0.085);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.055, now + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.11);
    oscillator.connect(gain);
    gain.connect(bubbleAudioContext.destination);
    oscillator.start(now);
    oscillator.stop(now + 0.12);
  };

  if (bubbleAudioContext.state === "suspended") {
    bubbleAudioContext.resume().then(play).catch(() => {});
  } else {
    play();
  }
};

document.addEventListener("click", (event) => {
  // the gashapon module has its own sound design — keep the page bubble out of it
  if (event.target.closest(".gasha")) return;
  if (event.target.closest("a, button, [role='button'], .coverflow-slide")) playBubbleSound();
});

if (portfolioTextPath) {
  const textPath = portfolioTextPath.querySelector("textPath");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let isVisible = true;
  let pathFrame = 0;
  let pathStartTime = performance.now();

  const paintTextPath = (time) => {
    if (!textPath || !isVisible || reducedMotion.matches) {
      pathFrame = 0;
      return;
    }

    const cycle = ((time - pathStartTime) % 12000) / 12000;
    const offset = -24 + cycle * 96;
    const edgeFade = Math.min(cycle / 0.05, (1 - cycle) / 0.05, 1);
    textPath.setAttribute("startOffset", `${offset.toFixed(3)}%`);
    textPath.closest("text").style.opacity = edgeFade.toFixed(3);
    pathFrame = requestAnimationFrame(paintTextPath);
  };

  const startTextPath = () => {
    if (pathFrame || reducedMotion.matches || !isVisible) return;
    pathStartTime = performance.now();
    pathFrame = requestAnimationFrame(paintTextPath);
  };

  const stopTextPath = () => {
    if (pathFrame) cancelAnimationFrame(pathFrame);
    pathFrame = 0;
  };

  if (reducedMotion.matches) {
    textPath?.setAttribute("startOffset", "10%");
    textPath?.closest("text")?.style.setProperty("opacity", "1");
  } else if ("IntersectionObserver" in window) {
    const textPathObserver = new IntersectionObserver((entries) => {
      isVisible = entries[0]?.isIntersecting ?? false;
      if (isVisible) startTextPath();
      else stopTextPath();
    }, { rootMargin: "120px 0px" });
    textPathObserver.observe(portfolioTextPath);
  } else {
    startTextPath();
  }
}

if (easterEggs.length) {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const hoverCapable = window.matchMedia("(hover: hover) and (pointer: fine)");
  let closeTimer = 0;
  let reactionPlayId = 0;

  const setEasterEggOpen = (easterEgg, shouldOpen, source = "click") => {
    const trigger = easterEgg.querySelector(".easter-egg-trigger");
    const popover = easterEgg.querySelector(".easter-egg-popover");
    const reaction = easterEgg.querySelector("img.easter-egg-reaction");

    easterEgg.classList.toggle("is-open", shouldOpen);
    easterEgg.closest(".timeline-item")?.classList.toggle("has-open-easter-egg", shouldOpen);
    if (shouldOpen) {
      easterEgg.dataset.openSource = source;
      const triggerRect = trigger?.getBoundingClientRect();
      if (triggerRect) {
        const roomAbove = triggerRect.top - 16;
        const roomBelow = window.innerHeight - triggerRect.bottom - 16;
        const opensUpward = roomAbove > roomBelow;
        const availableRoom = opensUpward ? roomAbove : roomBelow;
        easterEgg.classList.toggle("opens-upward", opensUpward);
        easterEgg.style.setProperty("--easter-egg-room", `${Math.max(180, availableRoom)}px`);
      }
    } else {
      delete easterEgg.dataset.openSource;
      easterEgg.classList.remove("opens-upward");
      easterEgg.style.removeProperty("--easter-egg-room");
    }
    trigger?.setAttribute("aria-expanded", String(shouldOpen));
    popover?.setAttribute("aria-hidden", String(!shouldOpen));

    if (!reaction) return;

    const stillSource = reaction.dataset.stillSrc;
    const animatedSource = reaction.dataset.animatedSrc;
    if (shouldOpen && animatedSource && !reducedMotion.matches) {
      reactionPlayId += 1;
      reaction.src = `${animatedSource}?play=${reactionPlayId}`;
    } else if (stillSource) {
      reaction.src = stillSource;
    }
  };

  const closeOtherEasterEggs = (exception) => {
    easterEggs.forEach((easterEgg) => {
      if (easterEgg !== exception && easterEgg.classList.contains("is-open")) {
        setEasterEggOpen(easterEgg, false);
      }
    });
  };

  easterEggs.forEach((easterEgg) => {
    const trigger = easterEgg.querySelector(".easter-egg-trigger");
    if (!trigger) return;

    trigger.addEventListener("click", () => {
      window.clearTimeout(closeTimer);
      const shouldOpen = easterEgg.dataset.openSource !== "click";
      closeOtherEasterEggs(easterEgg);
      setEasterEggOpen(easterEgg, shouldOpen, "click");
    });

    easterEgg.addEventListener("pointerenter", () => {
      if (!hoverCapable.matches) return;
      window.clearTimeout(closeTimer);
      closeOtherEasterEggs(easterEgg);
      if (easterEgg.dataset.openSource !== "click") {
        setEasterEggOpen(easterEgg, true, "hover");
      }
    });

    easterEgg.addEventListener("pointerleave", () => {
      if (!hoverCapable.matches) return;
      if (easterEgg.dataset.openSource === "hover") {
        closeTimer = window.setTimeout(() => setEasterEggOpen(easterEgg, false), 160);
      }
    });
  });

  document.addEventListener("pointerdown", (event) => {
    if (event.target.closest("[data-easter-egg]")) return;
    closeOtherEasterEggs(null);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    const openEasterEgg = easterEggs.find((easterEgg) => easterEgg.classList.contains("is-open"));
    if (!openEasterEgg) return;
    setEasterEggOpen(openEasterEgg, false);
    openEasterEgg.querySelector(".easter-egg-trigger")?.focus();
  });
}

if (
  smoothCursorCanvas
  && window.matchMedia("(pointer: fine)").matches
  && !window.matchMedia("(prefers-reduced-motion: reduce)").matches
) {
  const context = smoothCursorCanvas.getContext("2d");
  const pointsCount = 60;
  const springStrength = 0.32;
  const dampening = 0.42;
  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
  const pointer = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    speed: 0,
    lastMove: 0,
    hasMoved: false
  };
  const points = Array.from({ length: pointsCount }, () => ({
    x: pointer.x,
    y: pointer.y,
    vx: 0,
    vy: 0
  }));
  let dpr = 1;
  let opacity = 0;
  let previousFrame = performance.now();
  let previousPointerTime = previousFrame;

  const resizeSmoothCursor = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    smoothCursorCanvas.width = Math.round(window.innerWidth * dpr);
    smoothCursorCanvas.height = Math.round(window.innerHeight * dpr);
    context?.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  window.addEventListener("pointermove", (event) => {
    const now = performance.now();
    const deltaTime = Math.max((now - previousPointerTime) / 1000, 0.008);
    const moveX = event.clientX - pointer.x;
    const moveY = event.clientY - pointer.y;

    if (!pointer.hasMoved) {
      points.forEach((point) => {
        point.x = event.clientX;
        point.y = event.clientY;
        point.vx = 0;
        point.vy = 0;
      });
      pointer.hasMoved = true;
    }

    pointer.speed = Math.hypot(moveX, moveY) / deltaTime;
    pointer.x = event.clientX;
    pointer.y = event.clientY;
    pointer.lastMove = now;
    opacity = 1;
    previousPointerTime = now;
  }, { passive: true });

  const drawSmoothTrail = (lineWidth, alpha, blur) => {
    if (!context || !pointer.hasMoved || points.length < 2) return;
    const headPoint = points[0];
    const lastPoint = points[points.length - 1];
    const trailGradient = context.createLinearGradient(
      lastPoint.x,
      lastPoint.y,
      headPoint.x,
      headPoint.y
    );
    trailGradient.addColorStop(0, "rgba(50, 168, 82, 0)");
    trailGradient.addColorStop(0.48, "rgba(50, 168, 82, 0.5)");
    trailGradient.addColorStop(1, "rgba(50, 168, 82, 1)");
    context.save();
    context.globalAlpha = alpha * opacity;
    context.globalCompositeOperation = "source-over";
    context.strokeStyle = trailGradient;
    context.lineWidth = lineWidth;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.shadowBlur = blur;
    context.shadowColor = "rgba(50, 168, 82, 0.7)";
    context.beginPath();
    context.moveTo(headPoint.x, headPoint.y);

    for (let index = 1; index < points.length - 1; index += 1) {
      const point = points[index];
      const next = points[index + 1];
      const midpointX = (point.x + next.x) / 2;
      const midpointY = (point.y + next.y) / 2;
      context.quadraticCurveTo(point.x, point.y, midpointX, midpointY);
    }

    context.lineTo(lastPoint.x, lastPoint.y);
    context.stroke();
    context.restore();
  };

  const animateSmoothCursor = (frameTime) => {
    const deltaTime = Math.min((frameTime - previousFrame) / 1000, 0.034);
    previousFrame = frameTime;
    const frameScale = Math.min(deltaTime * 60, 2);

    points.forEach((point, index) => {
      const target = index === 0 ? pointer : points[index - 1];

      if (index === 0) {
        point.vx += (target.x - point.x) * springStrength * frameScale;
        point.vy += (target.y - point.y) * springStrength * frameScale;
        point.vx *= Math.pow(dampening, frameScale);
        point.vy *= Math.pow(dampening, frameScale);
        point.x += point.vx * frameScale;
        point.y += point.vy * frameScale;
        return;
      }

      const followStrength = Math.min((0.42 - Math.min(index, 30) * 0.004) * frameScale, 0.7);
      point.x += (target.x - point.x) * followStrength;
      point.y += (target.y - point.y) * followStrength;
      point.vx = 0;
      point.vy = 0;
    });

    if (frameTime - pointer.lastMove > 70) {
      opacity *= Math.exp(-3.2 * deltaTime);
    }

    context?.clearRect(0, 0, window.innerWidth, window.innerHeight);

    if (opacity > 0.01) {
      const velocityWidth = clamp(pointer.speed / 900, 0, 1) * 1.5;
      drawSmoothTrail(1.8 + velocityWidth, 0.62, 3.5);
    }

    pointer.speed *= Math.exp(-8 * deltaTime);
    requestAnimationFrame(animateSmoothCursor);
  };

  resizeSmoothCursor();
  window.addEventListener("resize", resizeSmoothCursor);
  requestAnimationFrame(animateSmoothCursor);
}

topNavLinks.forEach((link) => {
  link.addEventListener("click", () => {
    topNavLinks.forEach((navLink) => {
      const isCurrent = navLink === link;
      navLink.classList.toggle("is-active", isCurrent);
      if (isCurrent) {
        navLink.setAttribute("aria-current", "page");
      } else {
        navLink.removeAttribute("aria-current");
      }
    });
  });
});

blurHighlights.forEach((block) => {
  block.querySelectorAll(".blur-piece").forEach((piece, index) => {
    piece.style.setProperty("--blur-index", index);
  });

  block.querySelectorAll(".highlight-piece").forEach((piece, index) => {
    piece.style.setProperty("--highlight-index", index + 1);
  });
});

const revealBlurHighlight = (block) => {
  block.classList.add("is-visible");
};

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      revealBlurHighlight(entry.target);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.35 });

  blurHighlights.forEach((block) => observer.observe(block));
} else {
  blurHighlights.forEach(revealBlurHighlight);
}

if (journeyReveal) {
  const lines = [...journeyReveal.querySelectorAll(".journey-reveal-line")];
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
  const startRotation = -86;
  const endRotation = 98;
  const gap = 17;
  let sceneTop = 0;
  let scrollRange = 1;
  let radius = 280;
  let targetProgress = 0;
  let currentProgress = 0;
  let animationFrame = 0;
  let resizeTimer = 0;

  const paintJourneyReveal = () => {
    const rotation = startRotation + (endRotation - startRotation) * currentProgress;
    const centerIndex = (lines.length - 1) / 2;

    lines.forEach((line, index) => {
      const angle = rotation + (centerIndex - index) * gap;
      const angleRadians = angle * Math.PI / 180;
      const facing = Math.max(0, Math.cos(angleRadians));
      const opacity = clamp((facing - 0.34) / 0.66, 0, 1);
      const blur = (1 - facing) * 8;

      line.style.transform =
        `translate(-50%, -50%) rotateX(${angle.toFixed(3)}deg) translateZ(${radius.toFixed(2)}px)`;
      line.style.opacity = opacity.toFixed(3);
      line.style.filter = `blur(${blur.toFixed(2)}px)`;
    });
  };

  const readJourneyProgress = () => {
    targetProgress = clamp((window.scrollY - sceneTop) / scrollRange, 0, 1);
  };

  const animateJourneyReveal = () => {
    currentProgress += (targetProgress - currentProgress) * 0.09;
    paintJourneyReveal();

    if (Math.abs(targetProgress - currentProgress) > 0.0005) {
      animationFrame = requestAnimationFrame(animateJourneyReveal);
    } else {
      currentProgress = targetProgress;
      paintJourneyReveal();
      animationFrame = 0;
    }
  };

  const queueJourneyReveal = () => {
    readJourneyProgress();
    if (!animationFrame) animationFrame = requestAnimationFrame(animateJourneyReveal);
  };

  const measureJourneyReveal = () => {
    const rect = journeyReveal.getBoundingClientRect();
    sceneTop = rect.top + window.scrollY;
    scrollRange = Math.max(journeyReveal.offsetHeight - window.innerHeight, 1);
    const radiusRatio = window.innerWidth <= 820 ? 0.48 : 0.4;
    radius = Math.min(window.innerWidth, window.innerHeight) * radiusRatio;
    readJourneyProgress();
    currentProgress = targetProgress;
    paintJourneyReveal();
  };

  if (!prefersReducedMotion) {
    window.addEventListener("scroll", queueJourneyReveal, { passive: true });
    window.addEventListener("resize", () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(measureJourneyReveal, 100);
    });
    measureJourneyReveal();
  }
}

if (centerTimeline && timelineItems.length) {
  let timelineFrame = 0;

  const updateTimelineCursor = () => {
    const focusY = window.innerHeight * 0.52;
    const timelineRect = centerTimeline.getBoundingClientRect();
    let currentIndex = -1;

    if (timelineRect.top <= focusY && timelineRect.bottom >= focusY) {
      let closestDistance = Number.POSITIVE_INFINITY;
      timelineItems.forEach((item, index) => {
        const itemRect = item.getBoundingClientRect();
        const markerY = itemRect.top + 21;
        const distance = Math.abs(markerY - focusY);
        if (distance < closestDistance) {
          closestDistance = distance;
          currentIndex = index;
        }
      });
    }

    timelineItems.forEach((item, index) => {
      item.classList.toggle("is-current", index === currentIndex);
    });
    timelineFrame = 0;
  };

  const queueTimelineCursor = () => {
    if (!timelineFrame) timelineFrame = requestAnimationFrame(updateTimelineCursor);
  };

  window.addEventListener("scroll", queueTimelineCursor, { passive: true });
  window.addEventListener("resize", queueTimelineCursor);
  updateTimelineCursor();
}

if (scatterTitle && heroSection && introSection && badgeCard && badgeSignature) {
  const letters = [...scatterTitle.querySelectorAll(".scatter-letter")];
  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
  const states = letters.map((letter, index) => ({
    letter,
    index,
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    rotation: 0,
    rotationVelocity: 0,
    baseCenterX: 0,
    baseCenterY: 0,
    baseWidth: 0,
    pileX: 0,
    pileY: 0,
    pileScale: 0.4,
    pileRotation: 0
  }));
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let scatterUntil = 0;
  let scrollProgress = 0;
  let lastPointerMove = 0;
  let previousFrameTime = performance.now();
  let resizeTimer = 0;

  const measureLetterOrigins = () => {
    states.forEach(({ letter }) => {
      letter.style.transform = "none";
    });

    states.forEach((state) => {
      const rect = state.letter.getBoundingClientRect();
      const fontSize = Number.parseFloat(getComputedStyle(state.letter).fontSize) || 48;
      state.baseCenterX = rect.left + window.scrollX + rect.width / 2;
      state.baseCenterY = rect.top + window.scrollY + rect.height / 2;
      state.baseWidth = rect.width;
      state.pileScale = clamp(22 / fontSize, 0.3, 0.82);
    });
  };

  const updatePileTargets = () => {
    const signatureRect = badgeSignature.getBoundingClientRect();
    const signatureLeft = signatureRect.left + window.scrollX;
    const signatureTop = signatureRect.top + window.scrollY;
    const letterWidths = states.map((state) => state.baseWidth * state.pileScale);
    const wordGap = clamp(signatureRect.width * 0.04, 8, 12);
    const titleWidth = letterWidths.reduce((total, width) => total + width, 0) + wordGap;
    const titleCenterY = signatureTop + signatureRect.height / 2;
    let cursorX = signatureLeft + (signatureRect.width - titleWidth) / 2;

    states.forEach((state, index) => {
      if (index === 6) cursorX += wordGap;
      const letterWidth = letterWidths[index];
      const letterCenterX = cursorX + letterWidth / 2;
      state.pileX = letterCenterX - state.baseCenterX;
      state.pileY = titleCenterY - state.baseCenterY;
      cursorX += letterWidth;
    });
  };

  const updateScrollProgress = () => {
    const pileEnd = Math.max(window.innerHeight * 0.86, introSection.offsetTop - window.innerHeight * 0.12);
    scrollProgress = clamp(window.scrollY / pileEnd, 0, 1);
  };

  const scatterFromPoint = (clientX, clientY, fullBurst = false) => {
    if (prefersReducedMotion || scrollProgress > 0.72) return;
    const now = performance.now();
    scatterUntil = now + (fullBurst ? 1000 : 620);

    states.forEach((state) => {
      const rect = state.letter.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = centerX - clientX;
      const deltaY = centerY - clientY;
      const distance = Math.hypot(deltaX, deltaY) || 1;
      const radius = fullBurst ? Math.max(window.innerWidth * 0.55, 460) : 150;
      if (distance > radius) return;

      const force = 1 - distance / radius;
      const seedAngle = state.index * 1.91 + 0.6;
      const directionX = fullBurst ? Math.cos(seedAngle) : deltaX / distance;
      const directionY = fullBurst ? Math.sin(seedAngle) : deltaY / distance;
      const velocity = (fullBurst ? 200 : 92) * (0.42 + force * 0.9);
      state.vx += directionX * velocity;
      state.vy += directionY * velocity;
      state.rotationVelocity += (state.index % 2 ? 1 : -1) * (fullBurst ? 105 : 48) * force;
    });
  };

  window.addEventListener("pointermove", (event) => {
    const now = performance.now();
    if (now - lastPointerMove < 45) return;
    lastPointerMove = now;
    scatterFromPoint(event.clientX, event.clientY);
  }, { passive: true });

  heroSection.addEventListener("pointerdown", (event) => {
    scatterFromPoint(event.clientX, event.clientY, true);
  });

  window.addEventListener("scroll", updateScrollProgress, { passive: true });
  window.addEventListener("resize", () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      measureLetterOrigins();
      updatePileTargets();
      updateScrollProgress();
    }, 120);
  });

  const animateScatter = (frameTime) => {
    const deltaTime = Math.min((frameTime - previousFrameTime) / 1000, 0.034);
    previousFrameTime = frameTime;
    updatePileTargets();
    const signatureProgress = clamp((scrollProgress - 0.76) / 0.24, 0, 1);
    badgeSignature.style.opacity = signatureProgress.toFixed(3);
    badgeSignature.style.transform = `translateY(${((1 - signatureProgress) * 8).toFixed(2)}px)`;

    states.forEach((state) => {
      if (frameTime > scatterUntil) {
        const spring = 18;
        state.vx += -state.x * spring * deltaTime;
        state.vy += -state.y * spring * deltaTime;
        state.rotationVelocity += -state.rotation * spring * 0.72 * deltaTime;
      }

      const damping = Math.pow(frameTime > scatterUntil ? 0.055 : 0.31, deltaTime);
      state.vx *= damping;
      state.vy *= damping;
      state.rotationVelocity *= damping;
      state.x = clamp(state.x + state.vx * deltaTime, -210, 210);
      state.y = clamp(state.y + state.vy * deltaTime, -190, 190);
      state.rotation = clamp(state.rotation + state.rotationVelocity * deltaTime, -90, 90);

      const staggerStart = state.index * 0.018;
      const localProgress = clamp((scrollProgress - staggerStart) / (1 - staggerStart), 0, 1);
      const pileProgress = 1 - Math.pow(1 - localProgress, 3);
      const scatterWeight = 1 - pileProgress;
      const translateX = state.x * scatterWeight + state.pileX * pileProgress;
      const translateY = state.y * scatterWeight + state.pileY * pileProgress;
      const rotation = state.rotation * scatterWeight + state.pileRotation * pileProgress;
      const scale = 1 + (state.pileScale - 1) * pileProgress;

      state.letter.style.transform = `translate3d(${translateX.toFixed(2)}px, ${translateY.toFixed(2)}px, 0) rotate(${rotation.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
      state.letter.style.opacity = (1 - signatureProgress).toFixed(3);
    });

    requestAnimationFrame(animateScatter);
  };

  measureLetterOrigins();
  updatePileTargets();
  updateScrollProgress();
  requestAnimationFrame(animateScatter);
}

if (coverflowCarousel) {
  const frame = coverflowCarousel.querySelector(".coverflow-frame");
  const slides = [...coverflowCarousel.querySelectorAll(".coverflow-slide")];
  const count = slides.length;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const rotate = 44;
  const depth = 0.6;
  const falloff = 0.56;
  const fade = 0.1;
  const gap = 0.05;
  let position = 0;
  let target = 0;
  let cardWidth = 0;
  let animationFrame = 0;
  let wheelSettleTimer = 0;
  let drag = null;
  let suppressClick = false;

  const indexAt = (value) => ((Math.round(value) % count) + count) % count;

  const slideAtPoint = (x, y) => slides
    .filter((slide) => {
      const rect = slide.getBoundingClientRect();
      return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
    })
    .sort((a, b) => Number(b.style.zIndex || 0) - Number(a.style.zIndex || 0))[0] || null;

  const paintCoverflow = () => {
    if (!cardWidth || !count) return;
    const pitch = cardWidth * (1 + gap);

    slides.forEach((slide, index) => {
      let offset = index - position;
      offset = ((offset % count) + count) % count;
      if (offset > count / 2) offset -= count;

      const distance = Math.abs(offset);
      const ramp = Math.pow(distance, falloff);
      const tilt = Math.min(rotate * ramp, 82) * Math.sign(offset);
      const edge = Math.min(1, Math.max(0, count / 2 - distance));
      const opacity = Math.max(0, 1 - fade * distance) * edge;

      slide.style.transform =
        `translateX(calc(-50% + ${offset * pitch}px)) `
        + `translateZ(${-depth * cardWidth * ramp}px) rotateY(${-tilt}deg)`;
      slide.style.opacity = opacity.toFixed(3);
      slide.style.zIndex = String(100 - Math.round(distance * 10));
      const isSelected = index === indexAt(position);
      slide.classList.toggle("is-selected", isSelected);
      slide.setAttribute("aria-current", isSelected ? "true" : "false");
      const coverButton = slide.querySelector(".project-cover-button");
      if (coverButton) coverButton.tabIndex = isSelected ? 0 : -1;
    });
  };

  const settleCoverflow = (nextTarget) => {
    if (animationFrame) cancelAnimationFrame(animationFrame);
    target = nextTarget;

    if (prefersReducedMotion) {
      position = target;
      paintCoverflow();
      return;
    }

    const step = () => {
      const remaining = target - position;
      if (Math.abs(remaining) < 0.0004) {
        position = target;
        animationFrame = 0;
        paintCoverflow();
        return;
      }
      position += remaining * 0.16;
      paintCoverflow();
      animationFrame = requestAnimationFrame(step);
    };

    animationFrame = requestAnimationFrame(step);
  };

  const goToCoverflow = (index) => {
    const nextTarget = index + Math.round((target - index) / count) * count;
    settleCoverflow(nextTarget);
  };

  const nudgeCoverflow = (amount) => {
    settleCoverflow(Math.round(target) + amount);
  };

  const measureCoverflow = () => {
    cardWidth = slides[0]?.offsetWidth || 0;
    paintCoverflow();
    coverflowCarousel.classList.add("is-ready");
  };

  frame?.addEventListener("pointerdown", (event) => {
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
      animationFrame = 0;
    }
    frame.setPointerCapture(event.pointerId);
    target = position;
    suppressClick = false;
    drag = {
      id: event.pointerId,
      x: event.clientX,
      position,
      velocity: 0,
      time: performance.now(),
      moved: false,
      slide: event.target.closest?.(".coverflow-slide") || slideAtPoint(event.clientX, event.clientY)
    };
  });

  frame?.addEventListener("pointermove", (event) => {
    if (!drag || drag.id !== event.pointerId || !cardWidth) return;
    const now = performance.now();
    const previous = position;
    const pitch = cardWidth * (1 + gap);
    const deltaX = event.clientX - drag.x;
    position = drag.position - deltaX / pitch;
    drag.velocity = ((position - previous) / Math.max(now - drag.time, 1)) * 1000;
    drag.time = now;
    drag.moved ||= Math.abs(deltaX) > 5;
    paintCoverflow();
  });

  const endCoverflowDrag = (event) => {
    if (!drag || drag.id !== event.pointerId) return;
    const wasMoved = drag.moved;
    const pressedSlide = drag.slide;
    const clickedSlide = !wasMoved ? pressedSlide : null;
    suppressClick = wasMoved || Boolean(clickedSlide);
    const carried = Math.max(-2, Math.min(2, drag.velocity * 0.18));
    drag = null;
    settleCoverflow(Math.round(position + carried));

    if (clickedSlide?.matches("[data-open-freely]")) {
      openFreelyProject();
    } else if (clickedSlide?.matches("[data-open-report]")) {
      openPortfolioReport(clickedSlide);
    }
  };

  frame?.addEventListener("pointerup", endCoverflowDrag);
  frame?.addEventListener("pointercancel", endCoverflowDrag);
  frame?.addEventListener("wheel", (event) => {
    const horizontalDelta = Math.abs(event.deltaX);
    const verticalDelta = Math.abs(event.deltaY);
    if (!cardWidth || horizontalDelta < 2 || horizontalDelta <= verticalDelta) return;

    event.preventDefault();
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
      animationFrame = 0;
    }

    const deltaUnit = event.deltaMode === 1
      ? 16
      : event.deltaMode === 2
        ? window.innerWidth
        : 1;
    const pitch = cardWidth * (1 + gap);
    const normalizedDelta = event.deltaX * deltaUnit;
    position += normalizedDelta / pitch;
    target = position;
    paintCoverflow();

    window.clearTimeout(wheelSettleTimer);
    wheelSettleTimer = window.setTimeout(() => {
      settleCoverflow(Math.round(position));
    }, 110);
  }, { passive: false });

  frame?.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      nudgeCoverflow(-1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      nudgeCoverflow(1);
    }
  });

  frame?.addEventListener("click", (event) => {
    if (suppressClick) {
      suppressClick = false;
      return;
    }

    let slide = event.target.closest?.(".coverflow-slide");
    if (!slide && Number.isFinite(event.clientX) && Number.isFinite(event.clientY)) {
      slide = slideAtPoint(event.clientX, event.clientY);
    }
    if (!slide) return;

    if (slide.matches("[data-open-freely]")) {
      openFreelyProject();
      return;
    }
    if (slide.matches("[data-open-report]")) {
      openPortfolioReport(slide);
      return;
    }

    const index = slides.indexOf(slide);
    if (index >= 0) goToCoverflow(index);
  });

  if ("ResizeObserver" in window && frame) {
    const coverflowObserver = new ResizeObserver(measureCoverflow);
    coverflowObserver.observe(frame);
  } else {
    window.addEventListener("resize", measureCoverflow);
  }

  measureCoverflow();
}

if (heroVideo && heroCanvas) {
  const context = heroCanvas.getContext("2d", { willReadFrequently: true });
  let rafId = 0;
  let videoFrameId = 0;
  let hasStarted = false;
  let drawnFrameCount = 0;
  let completedPlays = 0;
  const totalPlays = 2;
  const pixelCount = heroCanvas.width * heroCanvas.height;
  const backgroundQueue = new Uint32Array(pixelCount);
  const backgroundVisited = new Uint8Array(pixelCount);
  const directVideoSrc = "./assets/hero-character.mov";
  const prefersDirectVideo = window.matchMedia("(pointer: coarse)").matches
    || /iPad|iPhone|iPod/.test(navigator.userAgent)
    || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

  heroVideo.loop = false;
  heroVideo.muted = true;
  heroVideo.playsInline = true;
  heroVideo.autoplay = true;
  heroVideo.preload = "auto";
  heroVideo.setAttribute("muted", "");
  heroVideo.setAttribute("playsinline", "");
  heroVideo.setAttribute("webkit-playsinline", "");
  heroVideo.setAttribute("autoplay", "");

  const useDirectVideo = () => {
    if (heroVideo.src.endsWith("hero-character.mov")) return;
    heroVideo.src = directVideoSrc;
    heroVideo.load();
  };

  const base64Video = window.HERO_CHARACTER_VIDEO_BASE64;
  if (base64Video && !prefersDirectVideo) {
    const chunkSize = 512 * 1024;
    const chunks = [];

    for (let offset = 0; offset < base64Video.length; offset += chunkSize) {
      const binary = window.atob(base64Video.slice(offset, offset + chunkSize));
      const bytes = new Uint8Array(binary.length);
      for (let index = 0; index < binary.length; index += 1) {
        bytes[index] = binary.charCodeAt(index);
      }
      chunks.push(bytes);
    }

    heroVideo.src = URL.createObjectURL(new Blob(chunks, { type: "video/quicktime" }));
    window.HERO_CHARACTER_VIDEO_BASE64 = "";
  } else {
    useDirectVideo();
  }

  const drawHeroFrame = () => {
    if (!context || !heroVideo.videoWidth || !heroVideo.videoHeight) return;

    const canvasWidth = heroCanvas.width;
    const canvasHeight = heroCanvas.height;
    const videoRatio = heroVideo.videoWidth / heroVideo.videoHeight;
    const canvasRatio = canvasWidth / canvasHeight;
    let drawWidth = canvasWidth;
    let drawHeight = canvasHeight;

    if (videoRatio > canvasRatio) {
      drawWidth = canvasWidth;
      drawHeight = canvasWidth / videoRatio;
    } else {
      drawHeight = canvasHeight;
      drawWidth = canvasHeight * videoRatio;
    }

    const drawX = (canvasWidth - drawWidth) / 2;
    const drawY = (canvasHeight - drawHeight) / 2;
    context.clearRect(0, 0, canvasWidth, canvasHeight);
    context.drawImage(heroVideo, drawX, drawY, drawWidth, drawHeight);

    let frame;
    try {
      frame = context.getImageData(0, 0, canvasWidth, canvasHeight);
    } catch (error) {
      document.documentElement.dataset.heroAnimation = "blocked";
      return;
    }

    const data = frame.data;
    const width = canvasWidth;
    const height = canvasHeight;
    let queueHead = 0;
    let queueTail = 0;
    backgroundVisited.fill(0);

    const enqueueBackground = (pixelIndex) => {
      if (backgroundVisited[pixelIndex]) return;
      const dataIndex = pixelIndex * 4;
      const alpha = data[dataIndex + 3];
      const maxChannel = Math.max(data[dataIndex], data[dataIndex + 1], data[dataIndex + 2]);

      if (alpha === 0 || maxChannel < 58) {
        backgroundVisited[pixelIndex] = 1;
        backgroundQueue[queueTail] = pixelIndex;
        queueTail += 1;
      }
    };

    for (let x = 0; x < width; x += 1) {
      enqueueBackground(x);
      enqueueBackground((height - 1) * width + x);
    }

    for (let y = 1; y < height - 1; y += 1) {
      enqueueBackground(y * width);
      enqueueBackground(y * width + width - 1);
    }

    while (queueHead < queueTail) {
      const pixelIndex = backgroundQueue[queueHead];
      queueHead += 1;
      data[pixelIndex * 4 + 3] = 0;

      const x = pixelIndex % width;
      if (x > 0) enqueueBackground(pixelIndex - 1);
      if (x < width - 1) enqueueBackground(pixelIndex + 1);
      if (pixelIndex >= width) enqueueBackground(pixelIndex - width);
      if (pixelIndex < pixelCount - width) enqueueBackground(pixelIndex + width);
    }

    context.putImageData(frame, 0, 0);
    drawnFrameCount += 1;
    document.documentElement.dataset.heroFrameCount = String(drawnFrameCount);
    document.documentElement.dataset.heroPlayCount = String(completedPlays);
    document.documentElement.dataset.heroAnimation = "drawing";
  };

  const cancelFrameLoop = () => {
    if (videoFrameId && "cancelVideoFrameCallback" in heroVideo) {
      heroVideo.cancelVideoFrameCallback(videoFrameId);
      videoFrameId = 0;
    }
    window.cancelAnimationFrame(rafId);
    rafId = 0;
  };

  const queueFrame = () => {
    if ("requestVideoFrameCallback" in heroVideo) {
      videoFrameId = heroVideo.requestVideoFrameCallback(() => {
        drawHeroFrame();
        if (!heroVideo.paused && !heroVideo.ended) queueFrame();
      });
      return;
    }

    const drawWithAnimationFrame = () => {
      drawHeroFrame();
      if (!heroVideo.paused && !heroVideo.ended) {
        rafId = window.requestAnimationFrame(drawWithAnimationFrame);
      }
    };
    rafId = window.requestAnimationFrame(drawWithAnimationFrame);
  };

  const playOnce = async () => {
    if (hasStarted) return;
    hasStarted = true;
    heroVideo.currentTime = 0;
    drawHeroFrame();

    try {
      await heroVideo.play();
      document.documentElement.dataset.heroAnimation = "playing";
    } catch (error) {
      hasStarted = false;
      document.documentElement.dataset.heroAnimation = "waiting";
      window.addEventListener("pointerdown", playOnce, { once: true });
      window.addEventListener("touchstart", playOnce, { once: true, passive: true });
    }
  };

  const primeHeroVideo = () => {
    drawHeroFrame();
    playOnce();
  };

  heroVideo.addEventListener("error", () => {
    document.documentElement.dataset.heroAnimation = "video-error";
    if (!heroVideo.src.endsWith("hero-character.mov")) {
      useDirectVideo();
    }
  });
  heroVideo.addEventListener("loadedmetadata", primeHeroVideo, { once: true });
  heroVideo.addEventListener("loadeddata", playOnce, { once: true });
  heroVideo.addEventListener("canplay", playOnce, { once: true });
  heroVideo.addEventListener("play", () => {
    cancelFrameLoop();
    queueFrame();
  });
  heroVideo.addEventListener("ended", () => {
    cancelFrameLoop();
    completedPlays += 1;
    document.documentElement.dataset.heroPlayCount = String(completedPlays);

    if (completedPlays < totalPlays) {
      document.documentElement.dataset.heroAnimation = "replaying";
      heroVideo.addEventListener("seeked", () => {
        heroVideo.play().catch(() => {
          document.documentElement.dataset.heroAnimation = "waiting";
        });
      }, { once: true });
      heroVideo.currentTime = 0;
      return;
    }

    const almostLastFrame = Math.max(0, heroVideo.duration - 1 / 30);
    heroVideo.addEventListener("seeked", () => {
      drawHeroFrame();
      document.documentElement.dataset.heroAnimation = "finished";
    }, { once: true });
    heroVideo.pause();
    heroVideo.currentTime = almostLastFrame;
  });
}

if (badge && lanyardRig && leftLanyardPath && rightLanyardPath) {
  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const anchors = {
    left: { x: 126, y: -130 },
    right: { x: 434, y: -130 }
  };
  const restingJoint = { x: 280, y: 164 };
  const createNode = (x, y) => ({ x, y, vx: 0, vy: 0 });
  const createRope = (anchor, end) => ({
    anchor,
    first: createNode(anchor.x + (end.x - anchor.x) / 3, anchor.y + (end.y - anchor.y) / 3),
    second: createNode(anchor.x + (end.x - anchor.x) * 2 / 3, anchor.y + (end.y - anchor.y) * 2 / 3),
    end
  });
  const ropes = {
    left: createRope(anchors.left, { x: restingJoint.x + 10, y: restingJoint.y - 5 }),
    right: createRope(anchors.right, { x: restingJoint.x - 10, y: restingJoint.y - 5 })
  };
  let grabOffsetX = 0;
  let grabOffsetY = 0;
  let x = 24;
  let y = 0;
  let vx = -18;
  let vy = 0;
  let targetX = x;
  let targetY = y;
  let rotationZ = 3;
  let rotationVelocity = 0;
  let tiltX = 0;
  let tiltY = 0;
  let dragging = false;
  let previousTime = performance.now();
  let previousPointerTime = previousTime;
  let previousPointerX = x;
  let previousPointerY = y;
  let entranceOffsetY = prefersReducedMotion ? 0 : -300;
  let entranceVelocity = 0;
  let entranceStartedAt = 0;
  let entranceStarted = prefersReducedMotion;
  let entranceComplete = prefersReducedMotion;
  const entranceKeyframes = [
    { time: 0, value: -300, easing: "in" },
    { time: 0.58, value: 0, easing: "out" },
    { time: 0.74, value: -48, easing: "in" },
    { time: 0.91, value: 0, easing: "out" },
    { time: 1.03, value: -18, easing: "in" },
    { time: 1.17, value: 0, easing: "out" }
  ];

  const startBadgeEntrance = () => {
    if (entranceStarted) return;
    entranceStarted = true;
    entranceStartedAt = performance.now();
    document.documentElement.dataset.badgeEntrance = "dropping";
  };

  const updateBadgeEntrance = (time, deltaTime) => {
    if (!entranceStarted || entranceComplete) return;
    const elapsed = (time - entranceStartedAt) / 1000;
    const previousOffset = entranceOffsetY;

    for (let index = 1; index < entranceKeyframes.length; index += 1) {
      const from = entranceKeyframes[index - 1];
      const to = entranceKeyframes[index];
      if (elapsed > to.time) continue;
      const progress = clamp((elapsed - from.time) / (to.time - from.time), 0, 1);
      const easedProgress = from.easing === "in"
        ? progress ** 3
        : 1 - (1 - progress) ** 3;
      entranceOffsetY = from.value + (to.value - from.value) * easedProgress;
      entranceVelocity = (entranceOffsetY - previousOffset) / Math.max(deltaTime, 0.001);
      return;
    }

    entranceOffsetY = 0;
    entranceVelocity = 0;
    entranceComplete = true;
    document.documentElement.dataset.badgeEntrance = "settled";
  };

  const cubicPoint = (rope, progress) => {
    const inverse = 1 - progress;
    return {
      x: inverse ** 3 * rope.anchor.x
        + 3 * inverse ** 2 * progress * rope.first.x
        + 3 * inverse * progress ** 2 * rope.second.x
        + progress ** 3 * rope.end.x,
      y: inverse ** 3 * rope.anchor.y
        + 3 * inverse ** 2 * progress * rope.first.y
        + 3 * inverse * progress ** 2 * rope.second.y
        + progress ** 3 * rope.end.y
    };
  };

  const cubicTangent = (rope, progress) => {
    const inverse = 1 - progress;
    return {
      x: 3 * inverse ** 2 * (rope.first.x - rope.anchor.x)
        + 6 * inverse * progress * (rope.second.x - rope.first.x)
        + 3 * progress ** 2 * (rope.end.x - rope.second.x),
      y: 3 * inverse ** 2 * (rope.first.y - rope.anchor.y)
        + 6 * inverse * progress * (rope.second.y - rope.first.y)
        + 3 * progress ** 2 * (rope.end.y - rope.second.y)
    };
  };

  const updateRope = (rope, end, deltaTime, sideDirection) => {
    rope.end.x = end.x;
    rope.end.y = end.y;

    [rope.first, rope.second].forEach((node, index) => {
      const progress = (index + 1) / 3;
      const sag = Math.sin(progress * Math.PI) * (12 + Math.abs(x) * 0.025);
      const targetNodeX = rope.anchor.x + (end.x - rope.anchor.x) * progress
        - vx * (0.055 + progress * 0.035)
        + sideDirection * Math.abs(vy) * 0.018;
      const targetNodeY = rope.anchor.y + (end.y - rope.anchor.y) * progress
        + sag
        - vy * (0.028 + progress * 0.02);
      const stiffness = 34 - index * 5;
      const damping = Math.exp(-(5.8 - index * 0.6) * deltaTime);

      node.vx = (node.vx + (targetNodeX - node.x) * stiffness * deltaTime) * damping;
      node.vy = (node.vy + (targetNodeY - node.y) * stiffness * deltaTime) * damping;
      node.x += node.vx * deltaTime;
      node.y += node.vy * deltaTime;
    });
  };

  const ropePath = (rope) => [
    `M${rope.anchor.x.toFixed(2)} ${rope.anchor.y.toFixed(2)}`,
    `C${rope.first.x.toFixed(2)} ${rope.first.y.toFixed(2)}`,
    `${rope.second.x.toFixed(2)} ${rope.second.y.toFixed(2)}`,
    `${rope.end.x.toFixed(2)} ${rope.end.y.toFixed(2)}`
  ].join(" ");

  const renderStrapBranding = () => {
    strapBrandMarks.forEach((mark) => {
      const side = mark.dataset.side;
      const progress = Number(mark.dataset.progress);
      const rope = ropes[side];
      const point = cubicPoint(rope, progress);
      const tangent = cubicTangent(rope, progress);
      let angle = Math.atan2(tangent.y, tangent.x) * 180 / Math.PI;
      if (angle > 90) angle -= 180;
      if (angle < -90) angle += 180;
      mark.setAttribute("transform", `translate(${point.x.toFixed(2)} ${point.y.toFixed(2)}) rotate(${angle.toFixed(2)})`);
    });
  };

  const renderLanyard = (deltaTime) => {
    const displayedY = y + entranceOffsetY;
    const center = { x: restingJoint.x + x, y: restingJoint.y + displayedY };
    const leftEnd = { x: center.x + 11, y: center.y - 5 };
    const rightEnd = { x: center.x - 11, y: center.y - 5 };
    updateRope(ropes.left, leftEnd, deltaTime, -1);
    updateRope(ropes.right, rightEnd, deltaTime, 1);

    const leftPath = ropePath(ropes.left);
    const rightPath = ropePath(ropes.right);
    leftLanyardPath.setAttribute("d", leftPath);
    rightLanyardPath.setAttribute("d", rightPath);
    leftLanyardShadow?.setAttribute("d", leftPath);
    rightLanyardShadow?.setAttribute("d", rightPath);
    renderStrapBranding();

    badge.style.setProperty("--badge-x", `${x.toFixed(2)}px`);
    badge.style.setProperty("--badge-y", `${displayedY.toFixed(2)}px`);
    badge.style.setProperty("--badge-rotate-x", `${tiltX.toFixed(2)}deg`);
    badge.style.setProperty("--badge-rotate-y", `${tiltY.toFixed(2)}deg`);
    badge.style.setProperty("--badge-rotate-z", `${rotationZ.toFixed(2)}deg`);
    document.documentElement.dataset.lanyardState = dragging ? "dragging" : "swinging";
  };

  const animateLanyard = (time) => {
    const deltaTime = Math.min((time - previousTime) / 1000, 0.034);
    previousTime = time;
    updateBadgeEntrance(time, deltaTime);

    if (!entranceComplete) {
      vx = 0;
      vy = 0;
    } else if (dragging) {
      const previousX = x;
      const previousY = y;
      const follow = 1 - Math.exp(-28 * deltaTime);
      x += (targetX - x) * follow;
      y += (targetY - y) * follow;
      vx = (x - previousX) / Math.max(deltaTime, 0.001);
      vy = (y - previousY) / Math.max(deltaTime, 0.001);
    } else {
      const pendulumLength = 245;
      const constrainedX = Math.min(Math.abs(x), pendulumLength - 8);
      const arcY = pendulumLength - Math.sqrt(pendulumLength ** 2 - constrainedX ** 2);
      vx += -x * 12.5 * deltaTime;
      vy += (arcY - y) * 18 * deltaTime;
      const damping = Math.exp(-3.25 * deltaTime);
      vx *= damping;
      vy *= damping;
      x += vx * deltaTime;
      y += vy * deltaTime;

      if (Math.abs(x) < 0.02 && Math.abs(y) < 0.02 && Math.abs(vx) < 0.04 && Math.abs(vy) < 0.04) {
        x = 0;
        y = 0;
        vx = 0;
        vy = 0;
      }
    }

    x = clamp(x, -205, 205);
    y = clamp(y, -82, 178);
    const desiredRotation = clamp(x / 13 + vx * 0.025, -24, 24);
    rotationVelocity += (desiredRotation - rotationZ) * 16 * deltaTime;
    rotationVelocity *= Math.exp(-5.2 * deltaTime);
    rotationZ += rotationVelocity * deltaTime;
    const desiredTiltX = clamp((vy + entranceVelocity) * -0.035, -10, 10);
    const desiredTiltY = clamp(vx * 0.035, -13, 13);
    const tiltFollow = 1 - Math.exp(-8 * deltaTime);
    tiltX += (desiredTiltX - tiltX) * tiltFollow;
    tiltY += (desiredTiltY - tiltY) * tiltFollow;

    renderLanyard(deltaTime);
    requestAnimationFrame(animateLanyard);
  };

  const releaseBadge = () => {
    if (!dragging) return;
    dragging = false;
    badge.classList.remove("is-dragging");
  };

  badge.addEventListener("pointerdown", (event) => {
    if (!entranceComplete) return;
    const rigRect = lanyardRig.getBoundingClientRect();
    dragging = true;
    grabOffsetX = event.clientX - (rigRect.left + rigRect.width / 2 + x);
    grabOffsetY = event.clientY - (rigRect.top + restingJoint.y + y);
    targetX = x;
    targetY = y;
    previousPointerX = x;
    previousPointerY = y;
    previousPointerTime = performance.now();
    badge.classList.add("is-dragging");
    badge.setPointerCapture(event.pointerId);
  });

  badge.addEventListener("pointermove", (event) => {
    if (!dragging) return;
    const rigRect = lanyardRig.getBoundingClientRect();
    const nextX = clamp(event.clientX - grabOffsetX - (rigRect.left + rigRect.width / 2), -205, 205);
    const nextY = clamp(event.clientY - grabOffsetY - (rigRect.top + restingJoint.y), -82, 178);
    const pointerTime = performance.now();
    const pointerDelta = Math.max((pointerTime - previousPointerTime) / 1000, 0.008);
    vx = (nextX - previousPointerX) / pointerDelta;
    vy = (nextY - previousPointerY) / pointerDelta;
    targetX = nextX;
    targetY = nextY;
    previousPointerX = nextX;
    previousPointerY = nextY;
    previousPointerTime = pointerTime;
  });

  badge.addEventListener("pointerup", releaseBadge);
  badge.addEventListener("pointercancel", releaseBadge);
  badge.addEventListener("lostpointercapture", () => {
    if (dragging) releaseBadge();
  });

  badge.addEventListener("keydown", (event) => {
    if (!entranceComplete) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      vx += 175;
      vy -= 24;
      rotationVelocity += 38;
    }
  });

  if (!prefersReducedMotion && "IntersectionObserver" in window) {
    const entranceObserver = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      startBadgeEntrance();
      entranceObserver.disconnect();
    }, { threshold: 0.08 });
    entranceObserver.observe(lanyardRig);
    document.documentElement.dataset.badgeEntrance = "waiting";
  } else if (!prefersReducedMotion) {
    startBadgeEntrance();
  } else {
    document.documentElement.dataset.badgeEntrance = "settled";
  }

  renderLanyard(1 / 60);
  requestAnimationFrame(animateLanyard);
}
