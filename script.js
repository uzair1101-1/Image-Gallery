const $ = (id) => document.getElementById(id);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const load = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } };
const save = (key, val) => { try { localStorage.setItem(key, JSON.stringify(val)); return true; } catch { return false; } };

const REQUIRED_IDS = [
  "grid", "categoryBar", "count", "empty", "search",
  "lightbox", "lbImg", "lbCounter", "lbTitle", "lbCat", "lbDesc", "lbFav", "lbDel", "lbPrev", "lbNext", "lbClose", "imgFilters",
  "uploadModal", "uploadForm", "upFile", "upPreview", "upHint", "upClose", "upTitle", "upCategory", "upDesc",
  "openUpload", "toast", "themeToggle"
];
const missing = REQUIRED_IDS.filter((id) => !document.getElementById(id));
function boot() {
  if (missing.length) {
    const box = document.createElement("div");
    box.className = "fatal";
    box.innerHTML =
      "<b>Setup problem:</b> <code>index.html</code> aur <code>script.js</code> match nahi kar rahe.<br>" +
      "index.html mein ye elements nahi mile: <code>" + missing.join(", ") + "</code>.<br>" +
      "Hal: naya <code>index.html</code>, <code>style.css</code> aur <code>script.js</code> teeno ek saath ek hi folder mein paste karein.";
    (document.querySelector("main") || document.body).prepend(box);
    return;
  }
  startApp();
}

function startApp() {
const ICONS = {
  all:       '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  cars:      '<path d="M3 13l2-6h14l2 6v5H3z"/><circle cx="7.5" cy="17" r="1.5"/><circle cx="16.5" cy="17" r="1.5"/>',
  animals:   '<circle cx="6" cy="10" r="1.8"/><circle cx="10" cy="6" r="1.8"/><circle cx="14" cy="6" r="1.8"/><circle cx="18" cy="10" r="1.8"/><path d="M12 12c-3 0-5 3-5 5.5 0 1.5 1.3 2.5 3 2 1-.3 1.5-.5 2-.5s1 .2 2 .5c1.7.5 3-.5 3-2 0-2.5-2-5.5-5-5.5z"/>',
  cities:    '<rect x="5" y="3" width="9" height="18" rx="1"/><path d="M14 9h5v12h-5M8 7h3M8 11h3M8 15h3"/>',
  favorites: '<path d="M12 21s-8-5.2-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.8-8 11-8 11z"/>'
};
const icon = (name) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ICONS.all}</svg>`;
const categories = ["all", "cars", "animals", "cities", "favorites"];

const samples = [
  
  { id: "c1", pid: "1555215695-3004980ad54e", title: "Luxury Car",    category: "cars"},
  { id: "c2", pid: "1503376780353-7e6692767b70", title: "Sports Car",    category: "cars"},
  { id: "c3", pid: "1492144534655-ae79c964c9d7", title: "Classic Ride",  category: "cars" },
  { id: "c4", pid: "1494976388531-d1058494cdd8", title: "Muscle Car",    category: "cars" },
  { id: "a1", pid: "1474511320723-9a56873867b5", title: "Red Fox",       category: "animals" },
  { id: "a2", pid: "1546182990-dffeafbe841d",    title: "Lion",          category: "animals"},
  { id: "a3", pid: "1517849845537-4d257902454a", title: "Happy Pup",     category: "animals"},
  { id: "a4", pid: "1514888286974-6c03e2ca1dba", title: "Curious Cat",   category: "animals"},
  { id: "t1", pid: "1477959858617-67f85cf4f1df", title: "City Life",     category: "cities" },
  { id: "t2", pid: "1514565131-fce0801e5785",    title: "City at Dusk",  category: "cities"},
  { id: "t3", pid: "1480714378408-67cf0d13bc1b", title: "Night Streets", category: "cities"},
  { id: "t4", pid: "1449824913935-59a10b8d2000", title: "Downtown",      category: "cities" },
  
];
const unsplash = (pid, w) => `https://images.unsplash.com/photo-${pid}?auto=format&fit=crop&w=${w}&q=75`;

const PALETTE = {
  cars:    ["#0f1276", "#14b8a6"],
  animals: ["#b45309", "#2b1f0b"],
  cities:  ["#4338ca", "#818cf8"]
};

function placeholder(item) {
  const [c1, c2] = PALETTE[item.category] || ["#334155", "#64748b"];
  const glyph = ICONS[item.category] || ICONS.all;
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 560" preserveAspectRatio="xMidYMid slice">` +
    `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs>` +
    `<rect width="800" height="560" fill="url(#g)"/>` +
    `<g transform="translate(400 220) scale(9) translate(-12 -12)" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">${glyph}</g>` +
    `</svg>`;
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}
function localCandidates(path) {
  const m = path.match(/^(.*?)(\.[a-z0-9]+)?$/i);
  const base = m[1], ext = m[2] || "";
  const exts = [ext, ".jpg", ".jpeg", ".png", ".webp", ".JPG", ".JPEG", ".PNG", ".WEBP"].filter(Boolean);
  return [...new Set(exts.map((e) => encodeURI(base + e)))];
}

function setSrc(el, item, w) {
  if (item.src) { el.src = item.src; return; }

  const queue = item.local ? localCandidates(item.local) : [];
  const tried = [];
  let onlineTried = false;
  let done = false;
  const toPlaceholder = () => {
    if (done) return;
    done = true;
    clearTimeout(timer);
    el.onerror = null;
    el.onload = null;
    if (item.local) console.warn(`PixelGallery: photo nahi mili "${item.title}". Ye paths try hue:`, tried);
    el.src = placeholder(item);
  };
  const tryNext = () => {
    if (queue.length) { const s = queue.shift(); tried.push(s); el.src = s; return true; }
    if (item.pid && !onlineTried) { onlineTried = true; el.src = unsplash(item.pid, w); return true; }
    return false;
  };
  const timer = setTimeout(() => {
    if (!el.complete || el.naturalWidth === 0) toPlaceholder();
  }, 7000);
  el.onload = () => { done = true; clearTimeout(timer); };
  el.onerror = () => { if (!tryNext()) toPlaceholder(); };

  if (!tryNext()) toPlaceholder();
}
let uploads = load("pg-uploads", []);
if (!Array.isArray(uploads)) uploads = [];
let favs = new Set(load("pg-favs", []));
const state = { category: "all", query: "" };
let list = [];
let current = 0;
let filterCss = "none";
let fadeTimer, toastTimer, dirty = false;

const allItems = () => [...uploads, ...samples];
const saveFavs = () => save("pg-favs", [...favs]);
const grid = $("grid"), categoryBar = $("categoryBar"), countEl = $("count"), emptyEl = $("empty");
const searchInput = $("search");
const lightbox = $("lightbox"), lbImg = $("lbImg"), lbCounter = $("lbCounter");
const lbTitle = $("lbTitle"), lbCat = $("lbCat"), lbDesc = $("lbDesc");
const lbFav = $("lbFav"), lbDel = $("lbDel"), imgFilters = $("imgFilters");
const uploadModal = $("uploadModal"), uploadForm = $("uploadForm");
const upFile = $("upFile"), upPreview = $("upPreview"), upHint = $("upHint");
function toast(msg) {
  const t = $("toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 2600);
}
function buildChips() {
  categoryBar.innerHTML = "";
  categories.forEach((cat) => {
    const b = document.createElement("button");
    b.className = "chip" + (cat === state.category ? " active" : "");
    b.dataset.category = cat;
    b.setAttribute("role", "tab");
    const label = cat === "favorites" ? `Favorites (${favs.size})` : cap(cat);
    b.innerHTML = `${icon(cat)}<span>${label}</span>`;
    categoryBar.appendChild(b);
  });
}
categoryBar.addEventListener("click", (e) => {
  const btn = e.target.closest(".chip");
  if (!btn) return;
  state.category = btn.dataset.category;
  buildChips();
  render();
});

function updateFavCount() {
  const chip = categoryBar.querySelector('[data-category="favorites"] span');
  if (chip) chip.textContent = `Favorites (${favs.size})`;
}

function getList() {
  const q = state.query.trim().toLowerCase();
  return allItems().filter((it) => {
    const inCat =
      state.category === "all" ? true :
      state.category === "favorites" ? favs.has(it.id) :
      it.category === state.category;
    const inSearch = !q ||
      String(it.title).toLowerCase().includes(q) ||
      String(it.category).toLowerCase().includes(q) ||
      (it.description || "").toLowerCase().includes(q);
    return inCat && inSearch;
  });
}

searchInput.addEventListener("input", () => { state.query = searchInput.value; render(); });

function render() {
  list = getList();
  grid.innerHTML = "";

  list.forEach((it, i) => {
    const card = document.createElement("article");
    card.className = "card";
    card.tabIndex = 0;
    card.dataset.id = it.id;
    card.style.animationDelay = `${Math.min(i, 12) * 35}ms`;
    card.innerHTML = `
      <img alt="${esc(it.title)}" />
      <span class="badge">${icon(it.category)}${esc(cap(it.category))}</span>
      <button class="heart${favs.has(it.id) ? " liked" : ""}" aria-label="Favorite ${esc(it.title)}" aria-pressed="${favs.has(it.id)}">${icon("favorites")}</button>
      <div class="info"><h3>${esc(it.title)}</h3><p>${esc(it.description || "")}</p></div>`;
    setSrc(card.querySelector("img"), it, 700);
    grid.appendChild(card);
  });

  emptyEl.hidden = list.length > 0;
  emptyEl.textContent = state.category === "favorites" && !state.query
    ? "No favorites yet. Tap the heart on any image to save it."
    : "No images found. Try another search or category.";
  countEl.textContent = list.length ? `Showing ${list.length} image${list.length !== 1 ? "s" : ""}` : "";
}

function toggleFav(id) {
  favs.has(id) ? favs.delete(id) : favs.add(id);
  saveFavs();
  const on = favs.has(id);

  const card = grid.querySelector(`[data-id="${id}"]`);
  if (card) {
    const h = card.querySelector(".heart");
    h.classList.toggle("liked", on);
    h.setAttribute("aria-pressed", on);
  }
  updateFavCount();
  if (state.category === "favorites") dirty = true;
  return on;
}

grid.addEventListener("click", (e) => {
  const card = e.target.closest(".card");
  if (!card) return;
  if (e.target.closest(".heart")) {
    const on = toggleFav(card.dataset.id);
    if (state.category === "favorites") render();
    toast(on ? "Added to favorites" : "Removed from favorites");
    return;
  }
  openLightbox(card.dataset.id);
});
grid.addEventListener("keydown", (e) => {
  if ((e.key === "Enter" || e.key === " ") && e.target.classList.contains("card")) {
    e.preventDefault();
    openLightbox(e.target.dataset.id);
  }
});
function updateFavBtn(id) {
  const on = favs.has(id);
  lbFav.classList.toggle("liked", on);
  lbFav.setAttribute("aria-pressed", on);
  lbFav.innerHTML = `${icon("favorites")}<span>${on ? "Saved" : "Add to favorites"}</span>`;
}
function show(index, animate = true) {
  if (!list.length) return;
  current = (index + list.length) % list.length;
  const it = list[current];
  const apply = () => {
    setSrc(lbImg, it, 1400);
    lbImg.alt = it.title;
    lbImg.style.filter = filterCss;
    lbTitle.textContent = it.title;
    lbCat.textContent = it.category;
    lbDesc.textContent = it.description || "No description added.";
    lbCounter.textContent = `${current + 1} / ${list.length}`;
    lbDel.hidden = !it.custom;
    updateFavBtn(it.id);
    lbImg.classList.remove("fade");
  };

  clearTimeout(fadeTimer);
  if (animate) { lbImg.classList.add("fade"); fadeTimer = setTimeout(apply, 180); }
  else apply();
}

function openLightbox(id) {
  const i = list.findIndex((x) => x.id === id);
  if (i < 0) return;
  dirty = false;
  show(i, false);
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  if (dirty) { dirty = false; render(); }
}
const next = () => show(current + 1);
const prev = () => show(current - 1);
$("lbNext").addEventListener("click", next);
$("lbPrev").addEventListener("click", prev);
$("lbClose").addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });

lbFav.addEventListener("click", () => {
  const it = list[current];
  const on = toggleFav(it.id);
  updateFavBtn(it.id);
  toast(on ? "Added to favorites" : "Removed from favorites");
});

lbDel.addEventListener("click", () => {
  const it = list[current];
  if (!it || !it.custom) return;
  if (!confirm(`Delete "${it.title}"?`)) return;
  uploads = uploads.filter((u) => u.id !== it.id);
  favs.delete(it.id);
  save("pg-uploads", uploads);
  saveFavs();
  closeLightbox();
  dirty = false;
  updateFavCount();
  render();
  toast("Image deleted");
});

let touchX = 0;
lightbox.addEventListener("touchstart", (e) => { touchX = e.changedTouches[0].clientX; }, { passive: true });
lightbox.addEventListener("touchend", (e) => {
  const dx = e.changedTouches[0].clientX - touchX;
  if (Math.abs(dx) > 50) dx < 0 ? next() : prev();
});

imgFilters.addEventListener("click", (e) => {
  const btn = e.target.closest(".mini");
  if (!btn) return;
  imgFilters.querySelectorAll(".mini").forEach((c) => c.classList.remove("active"));
  btn.classList.add("active");
  filterCss = btn.dataset.filter;
  lbImg.style.filter = filterCss;
});

function openUpload() {
  uploadModal.classList.add("open");
  uploadModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}
function closeUpload() {
  uploadModal.classList.remove("open");
  uploadModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  uploadForm.reset();
  upPreview.hidden = true;
  upPreview.removeAttribute("src");
  upHint.hidden = false;
}

$("openUpload").addEventListener("click", openUpload);
$("upClose").addEventListener("click", closeUpload);
uploadModal.addEventListener("click", (e) => { if (e.target === uploadModal) closeUpload(); });

upFile.addEventListener("change", () => {
  const file = upFile.files[0];
  if (!file) return;
  if (!file.type.startsWith("image/")) { toast("Please choose an image file"); upFile.value = ""; return; }
  upPreview.src = URL.createObjectURL(file);
  upPreview.hidden = false;
  upHint.hidden = true;
});

function fileToDataUrl(file, maxSide = 1200, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
        const c = document.createElement("canvas");
        c.width = Math.round(img.width * scale);
        c.height = Math.round(img.height * scale);
        const ctx = c.getContext("2d");
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, c.width, c.height);
        ctx.drawImage(img, 0, 0, c.width, c.height);
        resolve(c.toDataURL("image/jpeg", quality));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

uploadForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const file = upFile.files[0];
  if (!file) { toast("Please choose an image first"); return; }

  const title = $("upTitle").value.trim();
  if (!title) { toast("Please enter a title"); return; }

  try {
    const src = await fileToDataUrl(file);
    const item = {
      id: "u" + Date.now(),
      custom: true,
      src,
      title,
      category: $("upCategory").value,
      description: $("upDesc").value.trim()
    };

    uploads.unshift(item);
    if (!save("pg-uploads", uploads)) {
      uploads.shift();
      toast("Storage full. Delete some uploaded images first.");
      return;
    }

    closeUpload();
    state.category = "all";
    state.query = "";
    searchInput.value = "";
    buildChips();
    render();
    toast("Image added to gallery");
  } catch {
    toast("Could not read this image. Try another file.");
  }
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    if (uploadModal.classList.contains("open")) return closeUpload();
    if (lightbox.classList.contains("open")) return closeLightbox();
  }
  if (!lightbox.classList.contains("open")) return;
  if (e.key === "ArrowRight") next();
  if (e.key === "ArrowLeft")  prev();
});
const root = document.documentElement;
try {
  const saved = localStorage.getItem("pg-theme");
  if (saved) root.dataset.theme = saved;
} catch {}
$("themeToggle").addEventListener("click", () => {
  root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
  try { localStorage.setItem("pg-theme", root.dataset.theme); } catch {}
});

const navLinks = document.querySelectorAll(".nav-links a");
const spy = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (en.isIntersecting) {
      navLinks.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + en.target.id));
    }
  });
}, { rootMargin: "-45% 0px -50% 0px" });
["home", "gallery", "about"].forEach((id) => { const el = $(id); if (el) spy.observe(el); });

buildChips();
render();
} 
boot(); 