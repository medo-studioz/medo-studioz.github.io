import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const S = window.SITE;
const $ = (q, r = document) => r.querySelector(q);
const img = (p) => (!p ? '' : p.startsWith('http') ? p : 'https://cdn.salla.sa/' + p);
const url = (u) => (u.startsWith('http') ? u : S.base + u);
const ar = (n) => Number(n).toLocaleString('ar-SA');
const WA = 'https://wa.me/' + S.wa;

/* ---------- theme ---------- */
const r = document.documentElement.style;
Object.entries(S.theme).forEach(([k, v]) => r.setProperty('--' + k, v));
document.body.classList.add('L-' + (S.layout || 'split'));
document.title = S.title || S.name;

/* ---------- markup ---------- */
const items = S.items.map((x) => ({ n: x[0], p: x[1], o: x[2], i: img(x[3]), u: url(x[4]) }));
const feat = (S.featured || [0, 1]).map((i) => items[i]).filter(Boolean);
const price = (x) => `<span class="pr"><b>${ar(x.p)} <span class="sar">ر.س</span></b>${x.o ? `<s>${ar(x.o)}</s>` : ''}</span>`;
const h1 = S.h1.map((l, i) => `<span class="ln"><span class="${i === S.h1grad ? 'grad' : ''}">${l}</span></span>`).join('');
const mq = (S.marquee || []).map((m) => `<span>${m}</span>`).join('');

document.body.insertAdjacentHTML('afterbegin', `
<div class="loader"><b>${S.name}</b><i></i></div>
<div class="cursor"></div>
${S.promo ? `<div class="promo">${S.promo}</div>` : ''}
<header id="hdr">
  <a class="brand" href="#top">${S.logo ? `<img src="${S.logo}" alt="${S.name}">` : ''}<span>${S.logoText || ''}</span></a>
  <nav><a href="#feat">${S.featTitle ? S.featTitle.replace(/<[^>]+>/g, '') : 'المميز'}</a><a href="#all">${S.gridTitle ? S.gridTitle.replace(/<[^>]+>/g, '') : 'المنتجات'}</a><a href="#story">عنّا</a></nav>
  <a class="btn g" href="${S.store}" target="_blank" rel="noopener">المتجر</a>
</header>
<main id="top">
<section class="hero">
  <canvas class="three"></canvas>
  <div class="in">
    <div class="kick">${S.kicker}</div>
    <h1>${h1}</h1>
    <p class="lead">${S.lead}</p>
    <div class="ctas"><a class="btn p mag" href="#all">${S.cta1 || 'تسوّق الآن'}</a><a class="btn g" href="${WA}" target="_blank" rel="noopener">اطلب بالواتساب</a></div>
  </div>
  ${S.heroImg ? `<div class="pic"><img src="${S.heroImg}" alt="${S.name}"></div>` : ''}
</section>
${mq ? `<div class="mq"><div class="t">${mq}${mq}</div></div>` : ''}
<section class="sec" id="feat">
  <div class="head"><div><div class="kick rv">${S.featKicker || 'الأكثر طلبًا'}</div><h2 class="h2 rv">${S.featTitle || 'اختياراتنا'}</h2></div></div>
  <div class="feat">${feat.map((x) => `<a class="fcard rv" href="${x.u}" target="_blank" rel="noopener"><div class="ph"><img src="${x.i}" alt="${x.n}" loading="lazy"></div><div class="cap"><b>${x.n}</b>${price(x)}</div></a>`).join('')}</div>
</section>
${S.lookbook ? `<section class="sec hs" id="look" style="padding-inline:0"><div class="head" style="padding:0 5vw"><div><div class="kick">${S.lookKicker || 'التشكيلة'}</div><h2 class="h2">${S.lookTitle || 'تشكيلتنا'}</h2></div></div><div class="track">${items.map((x) => `<a class="it" href="${x.u}" target="_blank" rel="noopener"><div class="ph"><img src="${x.i}" alt="${x.n}" loading="lazy"></div><div class="m"><span>${x.n}</span>${price(x)}</div></a>`).join('')}</div></section>` : ''}
<section class="sec" id="all">
  <div class="head"><div><div class="kick rv">${S.gridKicker || 'المتجر'}</div><h2 class="h2 rv">${S.gridTitle || 'كل المنتجات'}</h2></div><a class="btn g" href="${S.store}" target="_blank" rel="noopener">عرض الكل في المتجر</a></div>
  <div class="grid">${items.map((x) => `<a class="card" href="${x.u}" target="_blank" rel="noopener"><div class="ph"><img src="${x.i}" alt="${x.n}" loading="lazy"></div><div class="m"><h3>${x.n}</h3><div class="row">${price(x)}<span class="plus">+</span></div></div></a>`).join('')}</div>
</section>
<section class="sec story" id="story">
  <div class="ph rv"><img src="${S.story.img || items[2]?.i || items[0].i}" alt="${S.name}" loading="lazy"></div>
  <div>
    <div class="kick rv">${S.story.kicker || 'قصتنا'}</div>
    <h2 class="h2 rv">${S.story.title}</h2>
    <p class="rv">${S.story.text}</p>
    ${S.story.nums ? `<div class="nums">${S.story.nums.map(([n, l, suf]) => `<div class="rv"><b data-n="${n}">0</b>${suf ? `<small>${suf}</small>` : ''}<span>${l}</span></div>`).join('')}</div>` : ''}
    ${S.story.perks ? `<div class="perks">${S.story.perks.map(([i, t]) => `<div class="perk rv"><i>${i}</i>${t}</div>`).join('')}</div>` : ''}
  </div>
</section>
<section class="sec cta">
  <div class="kick rv">${S.ctaKicker || 'جاهزين لك'}</div>
  <h2 class="h2 rv">${S.ctaTitle}</h2>
  <p class="rv">${S.ctaText}</p>
  <div class="ctas rv"><a class="btn p mag" href="${S.store}" target="_blank" rel="noopener">اطلب من المتجر</a><a class="btn g" href="${WA}" target="_blank" rel="noopener">واتساب ${S.waText || ''}</a></div>
</section>
</main>
<footer><div>© ${S.name}${S.footNote ? ' · ' + S.footNote : ''}</div><a href="https://medo-studioz.github.io/" target="_blank" rel="noopener">تصميم مقترح من ميدو ستوديو</a></footer>
<a class="wa" href="${WA}" target="_blank" rel="noopener" aria-label="واتساب"><svg width="28" height="28" viewBox="0 0 24 24" fill="#fff"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.1-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.9 0-1.4.7-2 1-2.3.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 1.9c.1.2.1.3 0 .5l-.3.5-.4.4c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.3 2.4 1.5.3.1.5.1.6-.1l.9-1c.2-.3.4-.2.6-.1l1.8.9c.3.1.5.2.5.3.1.1.1.6-.1 1.2z"/></svg></a>
`);

/* ---------- motion ---------- */
const g = window.gsap;
const hdr = $('#hdr');
addEventListener('scroll', () => hdr.classList.toggle('s', scrollY > 10), { passive: true });
const cur = $('.cursor');
addEventListener('pointermove', (e) => { if (g) g.to(cur, { x: e.clientX, y: e.clientY, duration: 0.25 }); });
document.querySelectorAll('a,.card').forEach((el) => { el.addEventListener('pointerenter', () => cur.classList.add('big')); el.addEventListener('pointerleave', () => cur.classList.remove('big')); });

if (g) {
  g.registerPlugin(window.ScrollTrigger);
  try { const l = new window.Lenis({ lerp: 0.09 }); l.on('scroll', window.ScrollTrigger.update); g.ticker.add((t) => l.raf(t * 1000)); g.ticker.lagSmoothing(0); } catch (e) {}
  const tl = g.timeline();
  tl.to('.loader i', { width: '100%', duration: 0.9, ease: 'power2.inOut' })
    .to('.loader', { yPercent: -100, duration: 0.9, ease: 'power4.inOut' })
    .from('.hero h1 .ln>span', { yPercent: 110, duration: 1.1, stagger: 0.1, ease: 'power4.out' }, '-=.4')
    .from('.hero .kick,.hero .lead,.hero .ctas', { y: 24, opacity: 0, duration: 0.9, stagger: 0.08, ease: 'power3.out' }, '-=.8')
    .from('.hero .pic', { clipPath: 'inset(100% 0 0 0)', duration: 1.3, ease: 'power4.inOut' }, '-=1.2');
  if ($('.hero .pic img')) g.to('.hero .pic img', { yPercent: -12, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  g.utils.toArray('.rv').forEach((el) => g.to(el, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%' } }));
  g.from('.card', { y: 50, opacity: 0, duration: 0.8, stagger: 0.06, ease: 'power3.out', scrollTrigger: { trigger: '.grid', start: 'top 85%' } });
  const tr = $('.hs .track');
  if (tr) {
    const dist = () => Math.max(0, tr.scrollWidth - innerWidth + innerWidth * 0.1);
    g.to(tr, { x: () => dist(), ease: 'none', scrollTrigger: { trigger: '.hs', start: 'top top', end: () => '+=' + dist(), scrub: 1, pin: true, invalidateOnRefresh: true } });
  }
  document.querySelectorAll('[data-n]').forEach((el) => { const o = { v: 0 }; g.to(o, { v: +el.dataset.n, duration: 2, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 92%' }, onUpdate: () => (el.textContent = Math.round(o.v).toLocaleString('ar-SA')) }); });
  document.querySelectorAll('.card').forEach((c) => {
    c.addEventListener('pointermove', (e) => { const b = c.getBoundingClientRect(); g.to(c, { rotateY: ((e.clientX - b.left) / b.width - 0.5) * 9, rotateX: -((e.clientY - b.top) / b.height - 0.5) * 9, duration: 0.4 }); });
    c.addEventListener('pointerleave', () => g.to(c, { rotateX: 0, rotateY: 0, duration: 0.6 }));
  });
  document.querySelectorAll('.mag').forEach((m) => {
    m.addEventListener('pointermove', (e) => { const b = m.getBoundingClientRect(); g.to(m, { x: (e.clientX - b.left - b.width / 2) * 0.3, y: (e.clientY - b.top - b.height / 2) * 0.3, duration: 0.3 }); });
    m.addEventListener('pointerleave', () => g.to(m, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1,.4)' }));
  });
} else {
  document.querySelectorAll('.rv').forEach((e) => { e.style.opacity = 1; e.style.transform = 'none'; });
  $('.loader').remove();
}

/* ---------- 3D ---------- */
const cv = $('canvas.three');
const hero = $('.hero');
const R = new THREE.WebGLRenderer({ canvas: cv, antialias: true, alpha: true });
R.setPixelRatio(Math.min(devicePixelRatio, 1.6));
R.outputColorSpace = THREE.SRGBColorSpace;
R.toneMapping = THREE.ACESFilmicToneMapping;
const scene = new THREE.Scene();
const cam = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
cam.position.set(0, 0, 9);
const pm = new THREE.PMREMGenerator(R);
scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture;
scene.add(new THREE.AmbientLight(0xffffff, 0.4));
const key = new THREE.DirectionalLight(0xffffff, 2.2); key.position.set(-4, 5, 6); scene.add(key);
const rim = new THREE.DirectionalLight(new THREE.Color(S.scene.rim || '#ffffff'), 1.5); rim.position.set(5, -2, -4); scene.add(rim);

const C = (c) => new THREE.Color(c);
const sc = S.scene;
const root = new THREE.Group();
scene.add(root);
const tick = [];
const mobile = innerWidth < 900;
// place object to the visual side (left in RTL layouts)
const side = sc.center || S.layout === 'center' ? 0 : mobile ? 0 : -2.6;
root.position.x = side;
const OBJ = ['giftbox','snowbox','bottle','pearls','ring','beans','smoke'].includes(sc.type);
if (mobile && OBJ) { root.position.y = S.heroImg ? -2.2 : -1.45; root.scale.setScalar(0.42); }

function particles(n, color, size, spread, fall) {
  const geo = new THREE.BufferGeometry();
  const p = new Float32Array(n * 3);
  for (let i = 0; i < n * 3; i++) p[i] = (Math.random() - 0.5) * spread;
  geo.setAttribute('position', new THREE.BufferAttribute(p, 3));
  const m = new THREE.PointsMaterial({ color: C(color), size, transparent: true, opacity: 0.85, depthWrite: false, sizeAttenuation: true });
  const pts = new THREE.Points(geo, m);
  scene.add(pts);
  tick.push((t) => {
    const a = geo.attributes.position.array;
    for (let i = 1; i < a.length; i += 3) { a[i] += fall; if (fall < 0 && a[i] < -spread / 2) a[i] = spread / 2; if (fall > 0 && a[i] > spread / 2) a[i] = -spread / 2; a[i - 1] += Math.sin(t + i) * 0.002; }
    geo.attributes.position.needsUpdate = true;
  });
  return pts;
}

function giftBox(box, ribbon) {
  const g = new THREE.Group();
  const bm = new THREE.MeshPhysicalMaterial({ color: C(box), roughness: 0.35, clearcoat: 0.6, clearcoatRoughness: 0.3 });
  const rm = new THREE.MeshPhysicalMaterial({ color: C(ribbon), roughness: 0.25, metalness: 0.3, sheen: 1, sheenColor: C(ribbon) });
  const body = new THREE.Mesh(new THREE.BoxGeometry(2, 1.6, 2), bm); body.position.y = -0.3; g.add(body);
  const lid = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.45, 2.2), bm); lid.position.y = 0.7; g.add(lid);
  const r1 = new THREE.Mesh(new THREE.BoxGeometry(0.32, 2.12, 2.24), rm); r1.position.y = 0.05; g.add(r1);
  const r2 = new THREE.Mesh(new THREE.BoxGeometry(2.24, 2.12, 0.32), rm); r2.position.y = 0.05; g.add(r2);
  const bowG = new THREE.TorusGeometry(0.42, 0.13, 20, 48);
  const b1 = new THREE.Mesh(bowG, rm); b1.position.set(-0.38, 1.12, 0); b1.rotation.set(0, Math.PI / 2, 0.5); b1.scale.set(1, 0.6, 1); g.add(b1);
  const b2 = b1.clone(); b2.position.x = 0.38; b2.rotation.z = -0.5; g.add(b2);
  const knot = new THREE.Mesh(new THREE.SphereGeometry(0.2, 24, 24), rm); knot.position.y = 1.05; g.add(knot);
  g.userData.lid = lid;
  return g;
}

function heart(color) {
  const s = new THREE.Shape();
  s.moveTo(0, 0.25); s.bezierCurveTo(0, 0.5, -0.5, 0.5, -0.5, 0.1); s.bezierCurveTo(-0.5, -0.2, 0, -0.35, 0, -0.6); s.bezierCurveTo(0, -0.35, 0.5, -0.2, 0.5, 0.1); s.bezierCurveTo(0.5, 0.5, 0, 0.5, 0, 0.25);
  const geo = new THREE.ExtrudeGeometry(s, { depth: 0.15, bevelEnabled: true, bevelSize: 0.06, bevelThickness: 0.06, bevelSegments: 6 });
  geo.center();
  return new THREE.Mesh(geo, new THREE.MeshPhysicalMaterial({ color: C(color), roughness: 0.2, clearcoat: 1 }));
}

const T = sc.type;
if (T === 'giftbox' || T === 'snowbox') {
  const box = giftBox(sc.c1, sc.c2); box.rotation.set(0.35, -0.6, 0); root.add(box);
  tick.push((t) => { box.rotation.y += 0.004; box.position.y = Math.sin(t) * 0.15; box.userData.lid.position.y = 0.7 + Math.max(0, Math.sin(t * 0.7)) * 0.25; });
  if (T === 'giftbox') {
    for (let i = 0; i < 9; i++) {
      const h = heart(i % 2 ? sc.c2 : sc.c3 || sc.c1); const s = 0.25 + Math.random() * 0.35; h.scale.setScalar(s);
      const a = (i / 9) * Math.PI * 2, rr = 2.4 + Math.random() * 0.8; h.position.set(Math.cos(a) * rr, Math.sin(a) * rr * 0.6, Math.sin(a) * 1.2); root.add(h);
      const ph = Math.random() * 6; tick.push((t) => { h.rotation.y = t + ph; h.position.y += Math.sin(t * 1.3 + ph) * 0.003; });
    }
  } else particles(mobile ? 500 : 900, sc.c3 || '#ffffff', 0.06, 16, -0.012);
} else if (T === 'fabric') {
  const geo = new THREE.PlaneGeometry(7, 9, 90, 110);
  const m = new THREE.MeshPhysicalMaterial({ color: C(sc.c1), roughness: 0.55, sheen: 1, sheenColor: C(sc.c2), sheenRoughness: 0.4, side: THREE.DoubleSide });
  const cloth = new THREE.Mesh(geo, m); cloth.rotation.set(-0.25, 0.5, 0.1); root.add(cloth);
  const base = geo.attributes.position.array.slice();
  tick.push((t) => {
    const a = geo.attributes.position.array;
    for (let i = 0; i < a.length; i += 3) { const x = base[i], y = base[i + 1]; a[i + 2] = Math.sin(x * 0.9 + t * 1.2) * 0.35 + Math.sin(y * 0.6 + t * 0.8) * 0.45 + Math.sin((x + y) * 1.4 + t * 1.7) * 0.08; }
    geo.attributes.position.needsUpdate = true; geo.computeVertexNormals();
  });
  if (sc.c3) particles(200, sc.c3, 0.04, 14, 0.004);
} else if (T === 'bottle') {
  const pts = [];
  [[0, -1.6], [0.95, -1.6], [1.05, -1.45], [1.08, 0.6], [0.95, 0.95], [0.4, 1.1], [0.32, 1.35], [0, 1.35]].forEach(([x, y]) => pts.push(new THREE.Vector2(x, y)));
  const glass = new THREE.Mesh(new THREE.LatheGeometry(pts, 64), new THREE.MeshPhysicalMaterial({ color: C(sc.c1), transmission: 0.9, roughness: 0.04, thickness: 1.2, ior: 1.45, attenuationColor: C(sc.c1), attenuationDistance: 1.4, clearcoat: 1 }));
  const juice = new THREE.Mesh(new THREE.CylinderGeometry(0.92, 0.88, 1.7, 48), new THREE.MeshPhysicalMaterial({ color: C(sc.c3 || sc.c1), roughness: 0.2, transmission: 0.5, thickness: 1 }));
  juice.position.y = -0.65;
  const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.9, 6), new THREE.MeshStandardMaterial({ color: C(sc.c2), metalness: 1, roughness: 0.18 }));
  cap.position.y = 1.75;
  const b = new THREE.Group(); b.add(glass, juice, cap); b.rotation.z = -0.12; root.add(b);
  tick.push((t) => { b.rotation.y = t * 0.4; b.position.y = Math.sin(t * 0.9) * 0.12; });
  const mist = particles(mobile ? 250 : 500, sc.c2, 0.05, 10, 0.01); mist.position.x = side;
} else if (T === 'stars') {
  particles(mobile ? 900 : 1800, sc.c2 || '#ffffff', 0.035, 26, 0);
  const moon = new THREE.Mesh(new THREE.SphereGeometry(1.7, 64, 64), new THREE.MeshStandardMaterial({ color: C(sc.c1), roughness: 0.9, emissive: C(sc.c1), emissiveIntensity: 0.08 }));
  root.add(moon);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(2.6, 0.012, 8, 160), new THREE.MeshBasicMaterial({ color: C(sc.c2 || '#fff'), transparent: true, opacity: 0.5 }));
  ring.rotation.x = 1.25; root.add(ring);
  key.position.set(6, 1, 2);
  tick.push((t) => { moon.rotation.y = t * 0.08; ring.rotation.z = t * 0.15; root.rotation.y = Math.sin(t * 0.2) * 0.2; });
} else if (T === 'petals') {
  const s = new THREE.Shape(); s.moveTo(0, 0); s.bezierCurveTo(0.35, 0.2, 0.3, 0.75, 0, 1); s.bezierCurveTo(-0.3, 0.75, -0.35, 0.2, 0, 0);
  const geo = new THREE.ShapeGeometry(s, 12);
  const pa = geo.attributes.position.array; for (let i = 0; i < pa.length; i += 3) pa[i + 2] = Math.pow(pa[i], 2) * 0.9;
  geo.computeVertexNormals();
  const n = mobile ? 70 : 140;
  const mesh = new THREE.InstancedMesh(geo, new THREE.MeshPhysicalMaterial({ color: C(sc.c1), side: THREE.DoubleSide, roughness: 0.5, sheen: 1, sheenColor: C(sc.c2) }), n);
  const d = new THREE.Object3D(); const st = [];
  for (let i = 0; i < n; i++) st.push({ x: (Math.random() - 0.5) * 16, y: Math.random() * 12 - 6, z: (Math.random() - 0.5) * 6, r: Math.random() * 6, s: 0.25 + Math.random() * 0.4, v: 0.006 + Math.random() * 0.012 });
  scene.add(mesh);
  tick.push((t) => { st.forEach((p, i) => { p.y -= p.v; if (p.y < -6.5) p.y = 6.5; d.position.set(p.x + Math.sin(t + p.r) * 0.4, p.y, p.z); d.rotation.set(t * 0.6 + p.r, t * 0.4 + p.r, p.r); d.scale.setScalar(p.s); d.updateMatrix(); mesh.setMatrixAt(i, d.matrix); }); mesh.instanceMatrix.needsUpdate = true; });
  if (sc.c3) { const h = heart(sc.c3); h.scale.setScalar(1.6); root.add(h); tick.push((t) => { h.rotation.y = Math.sin(t * 0.8) * 0.6; h.position.y = Math.sin(t) * 0.15; }); }
} else if (T === 'pearls') {
  const n = 46;
  const mesh = new THREE.InstancedMesh(new THREE.SphereGeometry(0.22, 32, 32), new THREE.MeshPhysicalMaterial({ color: C(sc.c1), roughness: 0.15, clearcoat: 1, sheen: 1, sheenColor: C(sc.c2), iridescence: 0.6 }), n);
  const d = new THREE.Object3D(); root.add(mesh);
  const big = new THREE.Mesh(new THREE.SphereGeometry(1.1, 64, 64), new THREE.MeshPhysicalMaterial({ color: C(sc.c3 || sc.c1), roughness: 0.08, clearcoat: 1, iridescence: 1, iridescenceIOR: 1.5 }));
  root.add(big);
  tick.push((t) => { for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2 + t * 0.3; d.position.set(Math.cos(a) * 2.6, Math.sin(a * 2 + t) * 0.25, Math.sin(a) * 2.6); d.scale.setScalar(0.8 + Math.sin(i) * 0.3); d.updateMatrix(); mesh.setMatrixAt(i, d.matrix); } mesh.instanceMatrix.needsUpdate = true; root.rotation.x = 0.35 + Math.sin(t * 0.3) * 0.1; big.position.y = Math.sin(t) * 0.1; });
} else if (T === 'beans') {
  const geo = new THREE.SphereGeometry(0.5, 32, 24); geo.scale(1, 0.72, 0.62);
  const pa = geo.attributes.position; for (let i = 0; i < pa.count; i++) { const x = pa.getX(i), z = pa.getZ(i); if (z > 0) pa.setZ(i, z - Math.exp(-x * x * 60) * 0.12); } geo.computeVertexNormals();
  const n = mobile ? 40 : 70;
  const mesh = new THREE.InstancedMesh(geo, new THREE.MeshPhysicalMaterial({ color: C(sc.c1), roughness: 0.35, clearcoat: 0.6 }), n);
  const d = new THREE.Object3D(); const st = [];
  for (let i = 0; i < n; i++) { const a = Math.random() * Math.PI * 2, rr = Math.random() * 2.4; st.push({ x: Math.cos(a) * rr, y: (Math.random() - 0.5) * 4.5, z: Math.sin(a) * rr, r: Math.random() * 6, s: 0.45 + Math.random() * 0.35 }); }
  root.add(mesh);
  const cup = new THREE.Mesh(new THREE.CylinderGeometry(1.05, 0.8, 1.3, 64, 1, true), new THREE.MeshPhysicalMaterial({ color: C(sc.c2), roughness: 0.2, clearcoat: 1, side: THREE.DoubleSide }));
  cup.position.y = -2.6; root.add(cup);
  tick.push((t) => { st.forEach((p, i) => { d.position.set(p.x * Math.cos(t * 0.2) - p.z * Math.sin(t * 0.2), p.y + Math.sin(t + p.r) * 0.25, p.x * Math.sin(t * 0.2) + p.z * Math.cos(t * 0.2)); d.rotation.set(t * 0.5 + p.r, t * 0.3 + p.r, p.r); d.scale.setScalar(p.s); d.updateMatrix(); mesh.setMatrixAt(i, d.matrix); }); mesh.instanceMatrix.needsUpdate = true; });
  const steam = particles(mobile ? 150 : 300, sc.c3 || '#ffffff', 0.08, 8, 0.012); steam.position.x = side;
} else if (T === 'orbs') {
  const cols = [sc.c1, sc.c2, sc.c3 || sc.c1];
  const orbs = [];
  for (let i = 0; i < (mobile ? 6 : 9); i++) {
    const o = new THREE.Mesh(new THREE.SphereGeometry(0.3 + Math.random() * 0.45, 48, 48), new THREE.MeshPhysicalMaterial({ color: C(cols[i % 3]), roughness: 0.15, iridescence: 0.8, clearcoat: 1, transparent: true, opacity: 0.6 }));
    o.position.set((Math.random() - 0.5) * 14, (Math.random() - 0.5) * 7, -2 - Math.random() * 3);
    o.userData = { p: Math.random() * 6, b: o.position.clone() }; scene.add(o); orbs.push(o);
  }
  tick.push((t) => orbs.forEach((o) => { o.position.y = o.userData.b.y + Math.sin(t * 0.6 + o.userData.p) * 0.5; o.position.x = o.userData.b.x + Math.cos(t * 0.4 + o.userData.p) * 0.4; }));
} else if (T === 'smoke') {
  const prof = [[0,-1.6],[0.9,-1.6],[0.95,-1.4],[0.55,-1.2],[0.45,-0.2],[0.6,0],[1.2,0.35],[1.25,0.55],[1.1,0.6],[0.6,0.4],[0,0.4]].map(([x,y]) => new THREE.Vector2(x, y));
  const burner = new THREE.Mesh(new THREE.LatheGeometry(prof, 8), new THREE.MeshStandardMaterial({ color: C(sc.c1), metalness: 0.85, roughness: 0.3, flatShading: true }));
  const coal = new THREE.Mesh(new THREE.SphereGeometry(0.35, 16, 12), new THREE.MeshStandardMaterial({ color: C('#2a1208'), emissive: C(sc.c3 || '#ff6a1a'), emissiveIntensity: 1.4 }));
  coal.position.y = 0.55; const b = new THREE.Group(); b.add(burner, coal); b.position.y = -0.6; root.add(b);
  tick.push((t) => { b.rotation.y = t * 0.35; coal.material.emissiveIntensity = 1.1 + Math.sin(t * 3) * 0.4; });
  const n = mobile ? 220 : 420; const geo = new THREE.BufferGeometry(); const p = new Float32Array(n * 3); const life = new Float32Array(n);
  for (let i = 0; i < n; i++) { life[i] = Math.random(); }
  geo.setAttribute('position', new THREE.BufferAttribute(p, 3));
  const sm = new THREE.Points(geo, new THREE.PointsMaterial({ color: C(sc.c2), size: 0.35, transparent: true, opacity: 0.28, depthWrite: false }));
  root.add(sm);
  tick.push((t) => { for (let i = 0; i < n; i++) { life[i] += 0.004; if (life[i] > 1) life[i] = 0; const L = life[i]; p[i*3] = Math.sin(L * 8 + i) * L * 1.2; p[i*3+1] = L * 5.5; p[i*3+2] = Math.cos(L * 6 + i) * L * 0.8; } geo.attributes.position.needsUpdate = true; });
} else if (T === 'ring') {
  const ring = new THREE.Mesh(new THREE.TorusGeometry(1.6, 0.42, 64, 160), new THREE.MeshStandardMaterial({ color: C(sc.c1), metalness: 1, roughness: 0.12 }));
  const gem = new THREE.Mesh(new THREE.OctahedronGeometry(0.6, 0), new THREE.MeshPhysicalMaterial({ color: C(sc.c2), transmission: 0.6, roughness: 0, ior: 2.4, thickness: 1, clearcoat: 1 }));
  gem.position.y = 2.05; const g2 = new THREE.Group(); g2.add(ring, gem); root.add(g2);
  tick.push((t) => { g2.rotation.y = t * 0.5; g2.rotation.x = 0.4 + Math.sin(t * 0.6) * 0.15; });
}

/* mouse parallax */
const mouse = { x: 0, y: 0 };
addEventListener('pointermove', (e) => { mouse.x = e.clientX / innerWidth - 0.5; mouse.y = e.clientY / innerHeight - 0.5; });
let scrollP = 0;
addEventListener('scroll', () => { scrollP = Math.min(1, scrollY / innerHeight); }, { passive: true });

function size() { const w = hero.clientWidth, h = hero.clientHeight; R.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); }
addEventListener('resize', size); size();
const clock = new THREE.Clock();
let visible = true;
new IntersectionObserver(([e]) => (visible = e.isIntersecting)).observe(hero);
(function loop() {
  requestAnimationFrame(loop);
  if (!visible) return;
  const t = clock.getElapsedTime();
  tick.forEach((f) => f(t));
  cam.position.x += (mouse.x * 1.2 - cam.position.x) * 0.04;
  cam.position.y += (-mouse.y * 0.8 - cam.position.y) * 0.04;
  cam.lookAt(0, 0, 0);
  root.rotation.z = scrollP * 0.3;
  cam.position.z = 9 + scrollP * 3;
  R.render(scene, cam);
})();
