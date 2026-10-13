/* Heat Recovery HVAC — project site behaviour */
(function () {
  "use strict";

  var CANON = "https://kariemm11.github.io/Sustainble-Heat-Recovery-Air-Pump-In-HVAC-Systems-On-Pharmaceutical-Facilities/";
  var SIM_NAMES = { "heat-recovery": "Heat recovery unit", "ahu": "Air handling unit", "heat-pump-ahu": "AHU + air pump", "clean-room": "Clean-room test rig" };
  // simulators that live in another repository (served from their own GitHub Pages site)
  var EXT_SIMS = { "clean-room": "https://kariemm11.github.io/Cleanroom-Heat-Recovery-Air-Pump/" };
  var root = document.documentElement, body = document.body;
  var reduced = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = window.matchMedia && matchMedia("(hover: hover) and (pointer: fine)").matches;
  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function fmt(n, d) { return n.toLocaleString("en-US", { minimumFractionDigits: d || 0, maximumFractionDigits: d || 0 }).replace(/,/g, " ").replace("-", "−"); }

  /* ------------------------------------------------------------- URLs */
  function siteBase() {
    var local = !/^https?:$/.test(location.protocol) || /^(localhost|127\.|0\.0\.0\.0|\[::1\])/.test(location.hostname);
    return local ? CANON : location.origin + location.pathname.replace(/[^/]*$/, "");
  }
  function simURL(key, qs) { return (EXT_SIMS[key] || siteBase() + "simulators/" + key + ".html") + (qs ? "?" + qs : ""); }
  function simPath(key) { return EXT_SIMS[key] || "simulators/" + key + ".html"; }
  function theme() {
    var t = root.getAttribute("data-theme");
    if (t) return t;
    return matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  /* ---------------------------------------------------------- preloader */
  body.classList.add("loading");
  var plBar = $("#plBar"), plP = 0;
  var plTimer = setInterval(function () { plP = Math.min(90, plP + Math.random() * 18); plBar.style.width = plP + "%"; }, 120);
  function finishLoad() {
    clearInterval(plTimer); plBar.style.width = "100%";
    setTimeout(function () {
      $("#preloader").classList.add("done");
      body.classList.remove("loading"); body.classList.add("ready");
      $$(".hero .reveal").forEach(function (el) { el.classList.add("in"); });
    }, reduced ? 0 : 350);
  }
  if (document.readyState === "complete") finishLoad(); else window.addEventListener("load", finishLoad);
  setTimeout(finishLoad, 4000); // never hold the page on a slow font

  /* -------------------------------------------------------- split title */
  $$("#heroTitle .line>span").forEach(function (s, i) { s.style.setProperty("--i", i); });

  /* -------------------------------------------------------------- theme */
  var themeListeners = [];
  $("#themeBtn").addEventListener("click", function () {
    var next = theme() === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("hr-theme", next); } catch (e) {}
    themeListeners.forEach(function (f) { f(next); });
  });

  /* ------------------------------------------------------ nav + progress */
  var nav = $("#nav"), prog = $("#progress"), lastY = 0;
  var burger = $("#burger"), links = $("#links");
  burger.addEventListener("click", function () {
    var o = burger.getAttribute("aria-expanded") !== "true";
    burger.setAttribute("aria-expanded", String(o)); links.classList.toggle("open", o);
  });
  $$("a", links).forEach(function (a) { a.addEventListener("click", function () { burger.setAttribute("aria-expanded", "false"); links.classList.remove("open"); }); });
  function onScroll() {
    var y = window.scrollY, h = document.documentElement.scrollHeight - innerHeight;
    prog.style.transform = "scaleX(" + (h > 0 ? y / h : 0) + ")";
    if (!links.classList.contains("open")) nav.classList.toggle("hide", y > lastY && y > 400);
    lastY = y;
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  var navLinks = $$("a", links);
  var secObs = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      navLinks.forEach(function (a) { a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id); });
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  ["challenge", "system", "simulators", "calculator", "access", "team"].forEach(function (id) { var el = document.getElementById(id); if (el) secObs.observe(el); });

  /* -------------------------------------------------------------- reveal */
  var revObs = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add("in"); revObs.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
  $$(".reveal").forEach(function (el) { if (!el.closest(".hero")) revObs.observe(el); });

  /* ------------------------------------------------------------ counters */
  var cntObs = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      cntObs.unobserve(e.target);
      var el = e.target, to = +el.dataset.count, t0 = performance.now(), dur = reduced ? 1 : 1800;
      (function tick(now) {
        var k = clamp((now - t0) / dur, 0, 1), v = to * (1 - Math.pow(1 - k, 4));
        el.textContent = fmt(Math.round(v));
        if (k < 1) requestAnimationFrame(tick);
      })(t0);
    });
  }, { threshold: 0.6 });
  $$("[data-count]").forEach(function (el) { cntObs.observe(el); });

  /* ---------------------------------------------- cursor glow, tilt, magnet */
  if (fine && !reduced) {
    var glow = $("#cursorGlow"), gx = 0, gy = 0, tx = 0, ty = 0;
    window.addEventListener("pointermove", function (e) { tx = e.clientX; ty = e.clientY; glow.classList.add("on"); }, { passive: true });
    (function loop() { gx += (tx - gx) * 0.12; gy += (ty - gy) * 0.12; glow.style.transform = "translate(" + gx + "px," + gy + "px)"; requestAnimationFrame(loop); })();

    $$(".tilt").forEach(function (el) {
      el.addEventListener("pointermove", function (e) {
        var r = el.getBoundingClientRect(), px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        el.classList.add("hovering");
        el.style.setProperty("--ry", ((px - 0.5) * 10).toFixed(2) + "deg");
        el.style.setProperty("--rx", ((0.5 - py) * 8).toFixed(2) + "deg");
        el.style.setProperty("--mx", px * 100 + "%"); el.style.setProperty("--my", py * 100 + "%");
      });
      el.addEventListener("pointerleave", function () {
        el.classList.remove("hovering"); el.style.setProperty("--rx", "0deg"); el.style.setProperty("--ry", "0deg");
      });
    });
    $$(".card").forEach(function (el) {
      el.addEventListener("pointermove", function (e) {
        var r = el.getBoundingClientRect();
        el.style.setProperty("--mx", (e.clientX - r.left) + "px"); el.style.setProperty("--my", (e.clientY - r.top) + "px");
      });
    });
    $$(".magnetic").forEach(function (el) {
      el.addEventListener("pointermove", function (e) {
        var r = el.getBoundingClientRect();
        el.style.setProperty("--bx", ((e.clientX - r.left - r.width / 2) * 0.25).toFixed(1) + "px");
        el.style.setProperty("--by", ((e.clientY - r.top - r.height / 2) * 0.35).toFixed(1) + "px");
      });
      el.addEventListener("pointerleave", function () { el.style.setProperty("--bx", "0px"); el.style.setProperty("--by", "0px"); });
    });
  }

  /* ------------------------------------------------------ page transition */
  document.addEventListener("click", function (e) {
    var a = e.target.closest("a[data-transition]");
    if (!a || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0 || reduced) return;
    e.preventDefault();
    var w = $("#wipe");
    w.style.setProperty("--x", e.clientX + "px"); w.style.setProperty("--y", e.clientY + "px");
    w.classList.add("go");
    setTimeout(function () { location.href = a.href; }, 650);
  });
  window.addEventListener("pageshow", function () { $("#wipe").classList.remove("go"); });

  /* =========================================================== 3D HERO */
  (function hero() {
    if (!window.THREE) return;
    var canvas = $("#heroCanvas"), heroEl = $("#hero");
    var renderer;
    try { renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true }); }
    catch (e) { return; }
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    renderer.setClearColor(0x000000, 0);
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(38, 1, 0.1, 200);
    camera.position.set(0, 3.2, 15);

    var css = getComputedStyle(root);
    function C(n) { return new THREE.Color(css.getPropertyValue(n).trim()); }
    var col = {};
    function readCols() {
      css = getComputedStyle(root);
      col.fresh = C("--fresh"); col.exh = C("--exhaust"); col.ref = C("--refrig"); col.ink = C("--ink"); col.dim = C("--ink-faint");
      col.dark = theme() === "dark";
    }
    readCols();

    scene.add(new THREE.HemisphereLight(0xffffff, 0x223344, 0.9));
    var key = new THREE.DirectionalLight(0xffffff, 0.8); key.position.set(6, 10, 8); scene.add(key);
    var rim = new THREE.PointLight(0x49aeff, 1.2, 30); rim.position.set(-6, 2, -4); scene.add(rim);
    var warm = new THREE.PointLight(0xff9143, 1.0, 30); warm.position.set(6, -2, 4); scene.add(warm);

    var rig = new THREE.Group(); scene.add(rig);
    var core = new THREE.Group(); rig.add(core);

    /* crossflow plates — channel edges alternate fresh / exhaust */
    var NP = 15, S = 2.6, plates = [], plateMat = new THREE.MeshStandardMaterial({
      color: 0x9fb3c6, metalness: 0.6, roughness: 0.3, transparent: true, opacity: 0.22, side: THREE.DoubleSide, depthWrite: false });
    var edgeF = new THREE.LineBasicMaterial({ color: col.fresh, transparent: true, opacity: 0.9 });
    var edgeE = new THREE.LineBasicMaterial({ color: col.exh, transparent: true, opacity: 0.9 });
    var pg = new THREE.BoxGeometry(S, 0.02, S), eg = new THREE.EdgesGeometry(pg);
    for (var i = 0; i < NP; i++) {
      var g = new THREE.Group();
      g.add(new THREE.Mesh(pg, plateMat));
      g.add(new THREE.LineSegments(eg, i % 2 ? edgeE : edgeF));
      g.userData.base = -1.4 + i * (2.8 / (NP - 1));
      g.position.y = g.userData.base; core.add(g); plates.push(g);
    }
    // corner posts
    var postMat = new THREE.MeshStandardMaterial({ color: 0x55687a, metalness: 0.8, roughness: 0.3 });
    [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(function (c) {
      var p = new THREE.Mesh(new THREE.BoxGeometry(0.09, 3.1, 0.09), postMat);
      p.position.set(c[0] * S / 2, 0, c[1] * S / 2); core.add(p);
    });
    core.rotation.y = Math.PI / 4;

    /* duct outlines along both axes (in the core frame) */
    var ductMat = new THREE.LineBasicMaterial({ color: col.dim, transparent: true, opacity: 0.35 });
    function duct(x, z, w, d) {
      var l = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(w, 3.0, d)), ductMat);
      l.position.set(x, 0, z); core.add(l);
    }
    duct(4.6, 0, 6.4, S); duct(-4.6, 0, 6.4, S); duct(0, 4.6, S, 6.4); duct(0, -4.6, S, 6.4);

    /* particle streams: fresh along x (even gaps), exhaust along z (odd gaps) */
    function dotTex() {
      var c = document.createElement("canvas"); c.width = c.height = 64;
      var x = c.getContext("2d"), gr = x.createRadialGradient(32, 32, 0, 32, 32, 32);
      gr.addColorStop(0, "rgba(255,255,255,1)"); gr.addColorStop(0.3, "rgba(255,255,255,.8)"); gr.addColorStop(1, "rgba(255,255,255,0)");
      x.fillStyle = gr; x.fillRect(0, 0, 64, 64); return new THREE.CanvasTexture(c);
    }
    var tex = dotTex(), small = innerWidth < 760;
    var N = small ? 900 : 1800, L = 7.8;
    function stream(axis, parity) {
      var geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(N * 3), 3));
      geo.setAttribute("color", new THREE.BufferAttribute(new Float32Array(N * 3), 3));
      var mat = new THREE.PointsMaterial({ size: 0.11, map: tex, vertexColors: true, transparent: true, depthWrite: false,
        blending: col.dark ? THREE.AdditiveBlending : THREE.NormalBlending });
      var pts = new THREE.Points(geo, mat); core.add(pts);
      var P = [];
      for (var i = 0; i < N; i++) {
        var gap = Math.floor(Math.random() * 7) * 2 + parity;      // channel between plates
        P.push({ s: Math.random() * 2 * L - L, lat: (Math.random() * 2 - 1) * (S / 2 - 0.08),
          y: -1.4 + (gap + 0.5) * (2.8 / (NP - 1)), j: (Math.random() - 0.5) * 0.08, v: 0.8 + Math.random() * 0.5, ph: Math.random() * 6.28 });
      }
      return { axis: axis, P: P, geo: geo, mat: mat, sign: axis === "x" ? -1 : 1 };
    }
    var sF = stream("x", 0), sE = stream("z", 1);
    var tmpA = new THREE.Color(), tmpB = new THREE.Color();
    function updStream(st, dt, spread, from, to) {
      var pos = st.geo.attributes.position.array, cc = st.geo.attributes.color.array;
      for (var i = 0; i < N; i++) {
        var q = st.P[i];
        q.s += dt * q.v * 2.2;
        if (q.s > L) q.s -= 2 * L;
        var along = q.s * st.sign;                       // fresh runs +x → −x
        var inCore = Math.abs(q.s) < S / 2;
        // outside the core, flow widens slightly and wobbles
        var w = inCore ? 0 : Math.sin(time * 1.6 + q.ph) * 0.06;
        var y = q.y * spread + q.j + w;
        if (st.axis === "x") { pos[i * 3] = along; pos[i * 3 + 1] = y; pos[i * 3 + 2] = q.lat; }
        else { pos[i * 3] = q.lat; pos[i * 3 + 1] = y; pos[i * 3 + 2] = along; }
        // heat moves across the plates: colour blends as the air crosses the core
        var k = clamp((q.s + S / 2) / S, 0, 1) * 0.62;
        tmpA.copy(from).lerp(to, k);
        var fade = clamp((L - Math.abs(q.s)) / 1.6, 0, 1);
        cc[i * 3] = tmpA.r * fade; cc[i * 3 + 1] = tmpA.g * fade; cc[i * 3 + 2] = tmpA.b * fade;
      }
      st.geo.attributes.position.needsUpdate = true; st.geo.attributes.color.needsUpdate = true;
    }

    /* refrigerant loop beneath the core */
    var loopCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(3.2, -1.9, 0), new THREE.Vector3(2.2, -2.6, 2.2), new THREE.Vector3(0, -2.9, 3.0),
      new THREE.Vector3(-2.2, -2.6, 2.2), new THREE.Vector3(-3.2, -1.9, 0), new THREE.Vector3(-2.2, -2.3, -2.2),
      new THREE.Vector3(0, -2.5, -3.0), new THREE.Vector3(2.2, -2.3, -2.2)], true);
    var refMat = new THREE.MeshStandardMaterial({ color: col.ref, metalness: 0.5, roughness: 0.3, emissive: col.ref, emissiveIntensity: 0.25 });
    rig.add(new THREE.Mesh(new THREE.TubeGeometry(loopCurve, 160, 0.045, 8, true), refMat));
    var RN = 60, rGeo = new THREE.BufferGeometry();
    rGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(RN * 3), 3));
    var rMat = new THREE.PointsMaterial({ size: 0.2, map: tex, color: col.ref, transparent: true, depthWrite: false,
      blending: col.dark ? THREE.AdditiveBlending : THREE.NormalBlending });
    rig.add(new THREE.Points(rGeo, rMat));
    var comp = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.8, 32), postMat);
    comp.position.set(0, -2.9, 3.0); rig.add(comp);

    /* ground rings */
    var ringMat = new THREE.LineBasicMaterial({ color: col.dim, transparent: true, opacity: 0.25 });
    var rings = new THREE.Group(); rig.add(rings);
    [3.6, 5.0, 6.6].forEach(function (r, i) {
      var pts = []; for (var a = 0; a <= 128; a++) { var t = a / 128 * Math.PI * 2; pts.push(new THREE.Vector3(Math.cos(t) * r, 0, Math.sin(t) * r)); }
      var l = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(pts), ringMat);
      l.position.y = -3.4; l.userData.k = i; rings.add(l);
    });

    /* ambient dust */
    var DN = small ? 250 : 500, dGeo = new THREE.BufferGeometry(), dArr = new Float32Array(DN * 3);
    for (var d = 0; d < DN; d++) { dArr[d * 3] = (Math.random() - 0.5) * 40; dArr[d * 3 + 1] = (Math.random() - 0.5) * 20; dArr[d * 3 + 2] = (Math.random() - 0.5) * 30 - 5; }
    dGeo.setAttribute("position", new THREE.BufferAttribute(dArr, 3));
    var dMat = new THREE.PointsMaterial({ size: 0.06, map: tex, color: col.dim, transparent: true, opacity: 0.7, depthWrite: false });
    var dust = new THREE.Points(dGeo, dMat); scene.add(dust);

    function retheme() {
      readCols();
      edgeF.color = col.fresh; edgeE.color = col.exh; ductMat.color = col.dim; ringMat.color = col.dim; dMat.color = col.dim;
      refMat.color = col.ref; refMat.emissive = col.ref; rMat.color = col.ref;
      var bl = col.dark ? THREE.AdditiveBlending : THREE.NormalBlending;
      [sF.mat, sE.mat, rMat].forEach(function (m) { m.blending = bl; m.needsUpdate = true; });
      plateMat.opacity = col.dark ? 0.22 : 0.35;
    }
    themeListeners.push(retheme);
    if (window.matchMedia) { var mq = matchMedia("(prefers-color-scheme: dark)"); if (mq.addEventListener) mq.addEventListener("change", retheme); }
    retheme();

    /* layout + input */
    var layout = { x: 3.4, y: 0, s: 1 };
    function resize() {
      var w = heroEl.clientWidth, h = heroEl.clientHeight;
      renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
      if (w < 760) layout = { x: 0, y: 2.2, s: 0.62 };
      else if (w < 1100) layout = { x: 2.6, y: 0.4, s: 0.85 };
      else layout = { x: 4.3, y: -0.3, s: 0.95 };
    }
    window.addEventListener("resize", resize); resize();
    var mx = 0, my = 0, smx = 0, smy = 0;
    window.addEventListener("pointermove", function (e) { mx = e.clientX / innerWidth - 0.5; my = e.clientY / innerHeight - 0.5; }, { passive: true });
    var drag = null, spinV = 0, spinOff = 0;
    canvas.addEventListener("pointerdown", function (e) { drag = e.clientX; canvas.setPointerCapture(e.pointerId); });
    canvas.addEventListener("pointermove", function (e) { if (drag !== null) { spinV = (e.clientX - drag) * 0.004; spinOff += spinV; drag = e.clientX; } });
    ["pointerup", "pointercancel"].forEach(function (ev) { canvas.addEventListener(ev, function () { drag = null; }); });

    var visible = true;
    new IntersectionObserver(function (es) { visible = es[0].isIntersecting; }).observe(heroEl);

    var clock = new THREE.Clock(), time = 0, refT = 0;
    function frame() {
      requestAnimationFrame(frame);
      if (!visible) { clock.getDelta(); return; }
      var dt = Math.min(clock.getDelta(), 0.05); if (reduced) dt *= 0.15;
      time += dt;
      var sp = clamp(window.scrollY / Math.max(1, heroEl.clientHeight), 0, 1);  // scroll progress through hero
      smx += (mx - smx) * 0.05; smy += (my - smy) * 0.05;
      if (drag === null) spinV *= 0.94; spinOff += drag === null ? spinV : 0;

      // explode plates as the visitor scrolls
      var spread = 1 + sp * 0.9;
      for (var i = 0; i < plates.length; i++) plates[i].position.y = plates[i].userData.base * spread;

      rig.position.set(layout.x - sp * 1.2, layout.y + sp * 1.6 + Math.sin(time * 0.6) * 0.08, -sp * 2);
      rig.scale.setScalar(layout.s);
      rig.rotation.y = -0.5 + time * 0.08 + smx * 0.6 + spinOff + sp * 1.2;
      rig.rotation.x = 0.32 + smy * 0.18 + sp * 0.3;

      updStream(sF, dt, spread, col.fresh, col.exh);
      updStream(sE, dt, spread, col.exh, col.fresh);

      refT = (refT + dt * 0.05) % 1;
      var ra = rGeo.attributes.position.array, v = new THREE.Vector3();
      for (var r = 0; r < RN; r++) { loopCurve.getPointAt((r / RN + refT) % 1, v); ra[r * 3] = v.x; ra[r * 3 + 1] = v.y; ra[r * 3 + 2] = v.z; }
      rGeo.attributes.position.needsUpdate = true;

      rings.children.forEach(function (l) { var k = 1 + Math.sin(time * 1.2 - l.userData.k) * 0.03; l.scale.set(k, 1, k); });
      dust.rotation.y = time * 0.01; dust.position.y = Math.sin(time * 0.2) * 0.3;
      camera.position.x = smx * 1.2; camera.position.y = 3.2 - smy * 0.8; camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    }
    frame();
  })();

  /* ====================================================== system stepper */
  (function system() {
    var sys = $(".sys"); if (!sys) return;
    var season = "winter", cur = 1;
    var T = {
      winter: { tq: ["−2 °C", "12.4 °C", "22 °C", "22 °C", "7.6 °C", "−2.4 °C"],
        steps: [
          "Cold outdoor air (−2 °C design) enters through the outdoor-air damper and a coarse panel filter that protects the core.",
          "In the crossflow plate core the warm exhaust gives up heat through thin aluminium plates. At 60 % effectiveness the fresh air is warmed to about 12 °C — with no air contact, so no cross-contamination.",
          "The R32 air pump's evaporator sits in the exhaust downstream of the core and harvests the heat still left in it, cooling the exhaust a further ~10 K before it leaves.",
          "The compressor lifts that heat to a useful temperature and the condenser coil in the AHU releases it into the supply, bringing the fresh air up to the 22 °C set point.",
          "Final H13 HEPA filters clean the conditioned air before it enters the GMP area. Room exhaust returns to the unit and the cycle repeats."
        ] },
      summer: { tq: ["35 °C", "28.4 °C", "16 °C", "24 °C", "30.6 °C", "42.6 °C"],
        steps: [
          "Hot outdoor air (35 °C design) enters through the outdoor-air damper and the panel filter.",
          "The cooler room exhaust pre-cools the incoming air through the plates: at 60 % effectiveness it drops to about 28 °C before any mechanical cooling is used.",
          "The reversing valve swaps the coils: the exhaust-side coil now acts as the condenser, rejecting the air pump's heat into the already-cool exhaust instead of hot outdoor air.",
          "The AHU-side coil becomes the evaporator and cools (and dehumidifies) the supply air to the 16 °C supply set point.",
          "H13 HEPA filters deliver clean, cool air into the cleanroom while the pressure cascade is maintained."
        ] }
    };
    var lis = $$("#steps li"), badges = $$(".badge", sys);
    lis.forEach(function (li) { var p = $("p", li); p.innerHTML = "<span></span>"; });
    function render() {
      sys.classList.toggle("summer", season === "summer");
      T[season].tq.forEach(function (t, i) { $("#tq" + (i + 1)).textContent = t; });
      lis.forEach(function (li, i) {
        $("p span", li).textContent = T[season].steps[i];
        li.classList.toggle("on", +li.dataset.step === cur);
      });
      badges.forEach(function (b) { b.classList.toggle("on", +b.dataset.step === cur); });
      $$("[data-step]:not(li):not(.badge)", sys).forEach(function (el) { el.classList.toggle("hl", +el.dataset.step === cur); });
    }
    function go(n) { cur = n; render(); }
    lis.forEach(function (li) { $("button", li).addEventListener("click", function () { go(+li.dataset.step); }); });
    badges.forEach(function (b) { b.addEventListener("click", function () { go(+b.dataset.step); }); });
    $$("[data-step]:not(li):not(.badge)", sys).forEach(function (el) { el.style.cursor = "pointer"; el.addEventListener("click", function () { go(+el.dataset.step); }); });
    $$("#sysSeason button").forEach(function (b) {
      b.addEventListener("click", function () {
        $$("#sysSeason button").forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
        season = b.dataset.v; render();
      });
    });
    render();
  })();

  /* ============================================================== QR */
  function drawQR(canvas, text) {
    var qr = window.qrcode(0, "M"); qr.addData(text); qr.make();
    var n = qr.getModuleCount(), quiet = 3, cell = Math.max(4, Math.floor(720 / (n + quiet * 2))), size = cell * (n + quiet * 2);
    canvas.width = canvas.height = size;
    var c = canvas.getContext("2d");
    c.fillStyle = "#ffffff"; c.fillRect(0, 0, size, size);
    c.fillStyle = "#0b1622";
    function finder(r, k) { return (r < 7 && k < 7) || (r < 7 && k >= n - 7) || (r >= n - 7 && k < 7); }
    for (var r = 0; r < n; r++) for (var k = 0; k < n; k++) {
      if (!qr.isDark(r, k) || finder(r, k)) continue;
      c.fillRect((k + quiet) * cell, (r + quiet) * cell, cell, cell);
    }
    // rounded finder patterns in the project colours
    [[0, 0, "#1273cc"], [0, n - 7, "#7c5cf0"], [n - 7, 0, "#dd6a14"]].forEach(function (f) {
      var x = (f[1] + quiet) * cell, y = (f[0] + quiet) * cell;
      c.fillStyle = f[2]; roundRect(c, x, y, 7 * cell, 7 * cell, cell * 1.6); c.fill();
      c.fillStyle = "#ffffff"; roundRect(c, x + cell, y + cell, 5 * cell, 5 * cell, cell * 1.1); c.fill();
      c.fillStyle = "#0b1622"; roundRect(c, x + 2 * cell, y + 2 * cell, 3 * cell, 3 * cell, cell * 0.8); c.fill();
    });
  }
  function roundRect(c, x, y, w, h, r) {
    c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r);
    c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath();
  }
  function copy(text, btn) {
    var orig = btn.textContent;
    (navigator.clipboard ? navigator.clipboard.writeText(text) : Promise.reject()).then(function () {
      btn.textContent = "Copied ✓"; setTimeout(function () { btn.textContent = orig; }, 1600);
    }, function () { window.prompt("Copy this link:", text); });
  }
  function download(canvas, name) {
    var a = document.createElement("a"); a.download = name; a.href = canvas.toDataURL("image/png"); a.click();
  }

  (function access() {
    var cv = $("#qrCanvas"), urlEl = $("#qrUrl"), nameEl = $("#qrName"), current = "";
    function set(t, label, animate) {
      current = t ? simURL(t) : siteBase();
      urlEl.textContent = current; nameEl.textContent = label;
      if (animate && !reduced) {
        cv.classList.add("swap");
        setTimeout(function () { drawQR(cv, current); cv.classList.remove("swap"); }, 300);
      } else drawQR(cv, current);
    }
    $$("#qrTabs button").forEach(function (b) {
      b.addEventListener("click", function () {
        $$("#qrTabs button").forEach(function (x) { x.setAttribute("aria-selected", String(x === b)); });
        set(b.dataset.t, b.textContent, true);
      });
    });
    $("#qrCopy").addEventListener("click", function () { copy(current, this); });
    $("#qrDl").addEventListener("click", function () {
      var sel = $('#qrTabs [aria-selected="true"]').dataset.t || "website";
      download(cv, "qr-" + sel + ".png");
    });
    set("", "Project website", false);
  })();

  var qm = $("#qmodal"), qmCanvas = $("#qmCanvas"), qmURL = "", qmName = "";
  function openQR(url, title, sub) {
    qmURL = url; qmName = title;
    $("#qmTitle").textContent = title; $("#qmSub").textContent = sub || "Scan with a phone camera to open it there.";
    $("#qmUrl").textContent = url; drawQR(qmCanvas, url);
    qm.hidden = false; requestAnimationFrame(function () { qm.classList.add("open"); });
    $("#qmCopy").focus();
  }
  function closeQR() { qm.classList.remove("open"); setTimeout(function () { qm.hidden = true; }, 300); }
  $("#qmClose").addEventListener("click", closeQR);
  qm.addEventListener("click", function (e) { if (e.target === qm) closeQR(); });
  $("#qmCopy").addEventListener("click", function () { copy(qmURL, this); });
  $("#qmDl").addEventListener("click", function () { download(qmCanvas, "qr-" + qmName.toLowerCase().replace(/[^a-z0-9]+/g, "-") + ".png"); });
  $$("[data-qr]").forEach(function (b) {
    b.addEventListener("click", function () { openQR(simURL(b.dataset.qr), SIM_NAMES[b.dataset.qr], "Opens this simulator on a phone — tap Controls there to adjust the variables."); });
  });

  /* ============================================================ viewer */
  (function viewer() {
    var v = $("#viewer"), frame = $("#vIframe"), load = $("#vLoad"), open = $("#vOpen"), cur = null, lastFocus = null;
    function show(key) {
      cur = key;
      $$("#vTabs button").forEach(function (b) { b.setAttribute("aria-selected", String(b.dataset.v === key)); });
      frame.classList.remove("ready"); load.style.display = "";
      frame.src = simPath(key) + "?theme=" + theme();
      open.href = simPath(key);
    }
    frame.addEventListener("load", function () {
      if (!frame.src || frame.src === "about:blank") return;
      setTimeout(function () { frame.classList.add("ready"); load.style.display = "none"; }, 250);
    });
    function launch(key, e) {
      lastFocus = document.activeElement;
      if (e && e.clientX) { v.style.setProperty("--ox", e.clientX + "px"); v.style.setProperty("--oy", e.clientY + "px"); }
      v.hidden = false; body.style.overflow = "hidden";
      show(key);
      requestAnimationFrame(function () { requestAnimationFrame(function () { v.classList.add("open"); }); });
      $("#vClose").focus();
    }
    function close() {
      v.classList.remove("open"); body.style.overflow = "";
      setTimeout(function () { v.hidden = true; frame.src = "about:blank"; frame.classList.remove("ready"); }, reduced ? 0 : 800);
      if (lastFocus) lastFocus.focus();
    }
    $$("[data-launch]").forEach(function (b) { b.addEventListener("click", function (e) { launch(b.dataset.launch, e); }); });
    $$(".sim-media").forEach(function (m) {
      m.setAttribute("role", "button"); m.setAttribute("tabindex", "0");
      m.setAttribute("aria-label", "Launch " + SIM_NAMES[m.closest(".sim").dataset.sim]);
      m.addEventListener("click", function (e) { launch(m.closest(".sim").dataset.sim, e); });
      m.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); launch(m.closest(".sim").dataset.sim); } });
    });
    $$("#vTabs button").forEach(function (b) { b.addEventListener("click", function () { if (b.dataset.v !== cur) show(b.dataset.v); }); });
    $("#vClose").addEventListener("click", close);
    $("#vShare").addEventListener("click", function () {
      var url = simURL(cur);
      try { if (frame.contentWindow.SimBridge) url = frame.contentWindow.SimBridge.shareURL(); } catch (e) {}
      openQR(url, SIM_NAMES[cur], "Opens this simulator with your current settings.");
    });
    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape") return;
      if (qm.classList.contains("open")) closeQR(); else if (!v.hidden) close();
    });
    themeListeners.push(function (t) { try { frame.contentWindow.postMessage({ type: "hr-theme", value: t }, "*"); } catch (e) {} });
  })();

  /* ========================================================= calculator */
  (function calc() {
    var f = { flow: $("#cFlow"), eff: $("#cEff"), oat: $("#cOat"), room: $("#cRoom"), hours: $("#cHours") };
    var def = {}; Object.keys(f).forEach(function (k) { def[k] = f[k].value; });
    var shownQ = 0, anim = null, out = $(".calc-out");
    function fill(el) { el.style.setProperty("--p", ((el.value - el.min) / (el.max - el.min) * 100) + "%"); }
    function tcol(t) { var k = clamp((t + 10) / 50, 0, 1); return "color-mix(in srgb, var(--exhaust) " + Math.round(k * 100) + "%, var(--fresh))"; }
    function deg(t) { return fmt(t, 1) + " °C"; }
    function update() {
      var V = +f.flow.value, e = f.eff.value / 100, To = +f.oat.value, Tr = +f.room.value, h = +f.hours.value;
      Object.keys(f).forEach(function (k) { fill(f[k]); });
      $("#oFlow").textContent = fmt(V) + " m³/h"; $("#oEff").textContent = f.eff.value + " %";
      $("#oOat").textContent = deg(To); $("#oRoom").textContent = deg(Tr); $("#oHours").textContent = fmt(h) + " h";
      var cap = V * 1.2 * 1.006 / 3600, T1 = To + e * (Tr - To), Q = Math.abs(cap * (T1 - To));
      var heating = Tr >= To;
      out.classList.toggle("cool", !heating);
      $("#rMode").textContent = Tr === To ? "No temperature difference — nothing to recover" : heating ? "Winter mode · heat recovered from exhaust" : "Summer mode · free pre-cooling";
      [[To, "#b1", "#r1"], [T1, "#b2", "#r2"], [Tr, "#b3", "#r3"]].forEach(function (r) {
        var bar = $(r[1]); bar.style.width = clamp((r[0] + 30) / 85 * 100, 2, 100) + "%"; bar.style.background = tcol(r[0]);
        $(r[2]).textContent = deg(r[0]);
      });
      var lift = T1 - To;
      $("#rLift").textContent = (lift >= 0 ? "+" : "−") + fmt(Math.abs(lift), 1) + " K";
      var E = Q * h / 1000;
      $("#rE").textContent = (E >= 100 ? fmt(E) : fmt(E, 1)) + " MWh";
      // gauge: log scale up to 1 MW so small and large plants both read well
      var frac = Math.log10(1 + Q) / Math.log10(1001);
      $("#gFill").style.strokeDashoffset = (252 * (1 - clamp(frac, 0, 1))).toFixed(1);
      var from = shownQ, t0 = performance.now();
      cancelAnimationFrame(anim);
      (function tick(now) {
        var k = clamp((now - t0) / 500, 0, 1); shownQ = from + (Q - from) * (1 - Math.pow(1 - k, 3));
        $("#rQ").textContent = fmt(shownQ, shownQ >= 100 ? 0 : 1);
        if (k < 1) anim = requestAnimationFrame(tick);
      })(t0);
      var q = new URLSearchParams({ season: heating ? "winter" : "summer", flow: V, eff: f.eff.value, oat: To, room: Tr });
      $("#calcOpen").href = "simulators/heat-recovery.html?" + q.toString();
    }
    Object.keys(f).forEach(function (k) { f[k].addEventListener("input", update); });
    $("#calcReset").addEventListener("click", function () { Object.keys(f).forEach(function (k) { f[k].value = def[k]; }); update(); });
    update();
  })();

  /* ------------------------------------------------------------- misc */
  $("#year").textContent = new Date().getFullYear();
})();
