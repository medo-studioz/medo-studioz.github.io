/* صانع البانرات التلقائي: أي صورة تنرفع تتحول لبانر عريض ١٦٠٠×٨٠٠ بنفس ستايل البانرات */
window.PSBanner = (function () {
  const W = 1600, H = 800, CX = 400;
  const rgb = (hex) => { const m = String(hex || "#e7b84f").replace("#", ""); const n = parseInt(m.length === 3 ? m.replace(/./g, "$&$&") : m, 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
  const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
  function rnd(seed) { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
  function load(src) { return new Promise((res, rej) => { const im = new Image(); im.crossOrigin = "anonymous"; im.onload = () => res(im); im.onerror = () => rej(new Error("الملف مو صورة")); im.src = src; }); }

  // يقص المنتج من خلفية فاتحة (بيضاء)
  function cutLight(im) {
    const sc = Math.min(1, 1400 / Math.max(im.naturalWidth, im.naturalHeight));
    const w = Math.round(im.naturalWidth * sc), h = Math.round(im.naturalHeight * sc);
    const c = document.createElement("canvas"); c.width = w; c.height = h; const x = c.getContext("2d"); x.drawImage(im, 0, 0, w, h);
    const d = x.getImageData(0, 0, w, h), a = d.data, T = 225;
    const bg = (i) => a[i + 3] < 30 || (a[i] > T && a[i + 1] > T && a[i + 2] > T && Math.max(a[i], a[i + 1], a[i + 2]) - Math.min(a[i], a[i + 1], a[i + 2]) < 20);
    const seen = new Uint8Array(w * h), st = [];
    for (let i = 0; i < w; i++) st.push(i, (h - 1) * w + i);
    for (let j = 0; j < h; j++) st.push(j * w, j * w + w - 1);
    while (st.length) { const p = st.pop(); if (seen[p] || !bg(p * 4)) continue; seen[p] = 1; const px = p % w, py = (p / w) | 0;
      if (px > 0) st.push(p - 1); if (px < w - 1) st.push(p + 1); if (py > 0) st.push(p - w); if (py < h - 1) st.push(p + w); }
    let x0 = w, y0 = h, x1 = 0, y1 = 0;
    for (let p = 0; p < w * h; p++) { const i = p * 4; if (seen[p]) { a[i + 3] = 0; continue; }
      const px = p % w, py = (p / w) | 0;
      const nb = (px > 0 && seen[p - 1]) || (px < w - 1 && seen[p + 1]) || (py > 0 && seen[p - w]) || (py < h - 1 && seen[p + w]);
      if (nb) { const m = Math.min(a[i], a[i + 1], a[i + 2]); if (m > 200) a[i + 3] = Math.round(255 * (1 - (m - 200) / 80)); }
      if (px < x0) x0 = px; if (px > x1) x1 = px; if (py < y0) y0 = py; if (py > y1) y1 = py; }
    if (x1 <= x0 || y1 <= y0) return null;
    x.putImageData(d, 0, 0);
    const o = document.createElement("canvas"); o.width = x1 - x0 + 1; o.height = y1 - y0 + 1;
    o.getContext("2d").drawImage(c, x0, y0, o.width, o.height, 0, 0, o.width, o.height); return o;
  }

  // يرسم الخلفية: إضاءة بلون البانر، جزيئات، خطوط ضوء، ومنصة
  function scene(g, col, seed, pedestal) {
    const R = rnd(seed);
    g.fillStyle = "#060607"; g.fillRect(0, 0, W, H);
    let gr = g.createRadialGradient(CX, 380, 30, CX, 420, 760); gr.addColorStop(0, rgba(col, .42)); gr.addColorStop(.35, rgba(col, .12)); gr.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = gr; g.fillRect(0, 0, W, H);
    gr = g.createRadialGradient(1350, 120, 10, 1350, 120, 700); gr.addColorStop(0, rgba(col, .10)); gr.addColorStop(1, "rgba(0,0,0,0)"); g.fillStyle = gr; g.fillRect(0, 0, W, H);
    g.save(); g.globalCompositeOperation = "screen";
    for (let k = 0; k < 4; k++) { const y = 120 + R() * 520, ang = -0.25 + R() * 0.15; g.save(); g.translate(CX + 60, y); g.rotate(ang);
      const lg = g.createLinearGradient(-700, 0, 900, 0); lg.addColorStop(0, "rgba(0,0,0,0)"); lg.addColorStop(.45, rgba(col, .16 + R() * .12)); lg.addColorStop(1, "rgba(0,0,0,0)");
      g.fillStyle = lg; g.fillRect(-700, -1.5 - R() * 2, 1600, 3 + R() * 4); g.restore(); }
    for (let k = 0; k < 26; k++) { const r = 10 + R() * 34, x = CX + (R() - .5) * 760, y = 80 + R() * 600; g.globalAlpha = .05 + R() * .12;
      const bg = g.createRadialGradient(x, y, 0, x, y, r); bg.addColorStop(0, rgba(col, 1)); bg.addColorStop(1, rgba(col, 0)); g.fillStyle = bg; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); }
    for (let k = 0; k < 170; k++) { const ang = R() * 6.283, dist = 120 + Math.pow(R(), .7) * 420, x = CX + Math.cos(ang) * dist * 1.25, y = 400 + Math.sin(ang) * dist * .8;
      if (x > 900) continue; g.globalAlpha = .25 + R() * .7; g.fillStyle = R() > .8 ? "#fff6dc" : rgba(col, 1); g.beginPath(); g.arc(x, y, .8 + R() * 2.8, 0, 7); g.fill(); }
    g.restore(); g.globalAlpha = 1;
    if (pedestal) {
      const top = 612, rx = 250, ry = 46;
      const body = g.createLinearGradient(CX - rx, 0, CX + rx, 0); body.addColorStop(0, "#050506"); body.addColorStop(.35, "#1d1d22"); body.addColorStop(.55, "#2a2a30"); body.addColorStop(1, "#060607");
      g.fillStyle = body; g.beginPath(); g.moveTo(CX - rx, top); g.lineTo(CX - rx, H); g.lineTo(CX + rx, H); g.lineTo(CX + rx, top); g.fill();
      g.fillStyle = "#121215"; g.beginPath(); g.ellipse(CX, top, rx, ry, 0, 0, 7); g.fill();
      g.strokeStyle = rgba(col, .75); g.lineWidth = 2.5; g.beginPath(); g.ellipse(CX, top, rx, ry, 0, Math.PI * 0.02, Math.PI * 0.98); g.stroke();
      g.strokeStyle = rgba(col, .35); g.lineWidth = 1.5; g.beginPath(); g.ellipse(CX, top, rx, ry, 0, Math.PI, Math.PI * 2); g.stroke();
    }
  }

  async function make(src, color, seed) {
    const im = typeof src === "string" ? await load(src) : src;
    const col = rgb(color), c = document.createElement("canvas"); c.width = W; c.height = H; const g = c.getContext("2d");
    const iw = im.naturalWidth || im.width, ih = im.naturalHeight || im.height;
    if (iw / ih >= 1.55) { // صورة عريضة جاهزة: بس نقصها على المقاس
      const s = Math.max(W / iw, H / ih), w = iw * s, h = ih * s; g.drawImage(im, (W - w) / 2, (H - h) / 2, w, h); return c;
    }
    // نعرف لون خلفية الصورة من الأطراف
    const t = document.createElement("canvas"), tw = 120, th = Math.max(1, Math.round(ih * tw / iw)); t.width = tw; t.height = th;
    const tx = t.getContext("2d"); tx.drawImage(im, 0, 0, tw, th); const dd = tx.getImageData(0, 0, tw, th).data; let sum = 0, n = 0, clear = 0;
    const px = (i, j) => { const k = (j * tw + i) * 4; if (dd[k + 3] < 40) { clear++; return; } sum += (dd[k] + dd[k + 1] + dd[k + 2]) / 3; n++; };
    for (let i = 0; i < tw; i++) { px(i, 0); px(i, th - 1); } for (let j = 0; j < th; j++) { px(0, j); px(tw - 1, j); }
    const light = clear > n || (n && sum / n > 190);
    const cut = light ? cutLight(im) : null;
    scene(g, col, seed || 7, !!cut);
    if (cut) {
      const h = 520, w = cut.width * h / cut.height, base = 626, dw = Math.min(w, 560), dh = dw === w ? h : cut.height * dw / cut.width;
      g.save(); g.translate(CX, base); g.scale(1, .13); const sh = g.createRadialGradient(0, 0, 0, 0, 0, dw * .62); sh.addColorStop(0, "rgba(0,0,0,.85)"); sh.addColorStop(1, "rgba(0,0,0,0)");
      g.fillStyle = sh; g.beginPath(); g.arc(0, 0, dw * .62, 0, 7); g.fill(); g.restore();
      g.drawImage(cut, CX - dw / 2, base - dh, dw, dh);
    } else { // صورة خلفيتها غامقة: ندمجها بحواف ناعمة
      const S = 860, s = Math.max(S / iw, S / ih), w = iw * s, h = ih * s;
      const m = document.createElement("canvas"); m.width = S; m.height = S; const mg = m.getContext("2d");
      mg.drawImage(im, (S - w) / 2, (S - h) / 2, w, h);
      mg.globalCompositeOperation = "destination-in";
      const rg = mg.createRadialGradient(S / 2, S / 2, S * .30, S / 2, S / 2, S * .5); rg.addColorStop(0, "#000"); rg.addColorStop(1, "rgba(0,0,0,0)");
      mg.fillStyle = rg; mg.fillRect(0, 0, S, S);
      g.drawImage(m, CX - S / 2, 420 - S / 2);
      g.save(); g.globalCompositeOperation = "screen"; const R = rnd((seed || 7) + 3);
      for (let k = 0; k < 60; k++) { const a = R() * 6.283, d = 300 + R() * 160, x = CX + Math.cos(a) * d, y = 410 + Math.sin(a) * d * .85; g.globalAlpha = .3 + R() * .6; g.fillStyle = R() > .7 ? "#fff6dc" : rgba(col, 1); g.beginPath(); g.arc(x, y, 1 + R() * 2.4, 0, 7); g.fill(); }
      g.restore(); g.globalAlpha = 1;
    }
    const v = g.createRadialGradient(W / 2, H / 2, H * .45, W / 2, H / 2, W * .62); v.addColorStop(0, "rgba(0,0,0,0)"); v.addColorStop(1, "rgba(0,0,0,.5)"); g.fillStyle = v; g.fillRect(0, 0, W, H);
    return c;
  }
  function blob(canvas) { return new Promise((res, rej) => canvas.toBlob((b) => (b ? res(b) : rej(new Error("الصورة ما اشتغلت"))), "image/webp", .82)); }
  return { make, blob };
})();
