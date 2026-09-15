const videos = [
  { user: "@chile_y_lima", cap: "Tacos al pastor a las 2am en la Roma. ¿Quién se apunta? #CDMX #tacos #parati", loc: "Ciudad de México", img: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800", likes: 12400, comments: ["¿A qué taquería?", "Se me antojó feo", "Roma best colonia"] },
  { user: "@guadalajara.nights", cap: "El centro de GDL de noche pega diferente. #Guadalajara #Jalisco", loc: "Guadalajara", img: "https://images.unsplash.com/photo-1518659526054-190340b32735?w=800", likes: 8100, comments: ["Jalisco es México", "¿En qué calle?"] },
  { user: "@norteño.mx", cap: "Monterrey, cerro de la Silla siempre presente. #MTY #NuevoLeon", loc: "Monterrey", img: "https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?w=800", likes: 6700, comments: ["Orgullo regiomontano"] },
  { user: "@yucatan.sabor", cap: "Cochinita que sí sabe a casa. #Merida #Yucatan #parati", loc: "Mérida", img: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=800", likes: 9900, comments: ["Con cebolla morada o nada"] },
];

const tags = ["#parati", "#CDMX", "#tacos", "#Guadalajara", "#Monterrey", "#musica", "#futbol", "#playa"];
let i = 0;
let tab = "foryou";
const main = document.getElementById("main");
const userKey = "ojea-user";

function fmt(n) {
  return n >= 1000 ? (n / 1000).toFixed(1).replace(/\.0$/, "") + "k" : String(n);
}
function me() {
  return JSON.parse(localStorage.getItem(userKey) || "null");
}
function setUser(u) {
  if (u) localStorage.setItem(userKey, JSON.stringify(u));
  else localStorage.removeItem(userKey);
  syncAuth();
}
function syncAuth() {
  const u = me();
  const btn = document.getElementById("loginBtn");
  btn.textContent = u ? "Cerrar sesión" : "Iniciar sesión";
}

function renderFeed() {
  const list = tab === "following" ? videos.filter((_, idx) => idx % 2 === 1) : videos;
  const v = list[i % list.length];
  main.innerHTML = `
    <div class="phone" id="phone">
      <div class="top"><b data-tab="foryou">Para ti</b><span data-tab="following">Siguiendo</span></div>
      <img class="poster" src="${v.img}" alt="${v.loc}" />
      <div class="meta">
        <div class="user">${v.user} · <em class="follow">Seguir</em></div>
        <div class="cap">${v.cap}</div>
        <div class="loc">📍 ${v.loc}</div>
      </div>
      <div class="acts">
        <div class="act"><div class="dot like">♥</div><span class="lc">${fmt(v.likes)}</span></div>
        <div class="act"><div class="dot comments">💬</div>${v.comments.length}</div>
        <div class="act"><div class="dot share">↗</div>Compartir</div>
        <div class="act"><div class="dot save">🔖</div>Guardar</div>
        <div class="act"><div class="dot next">↓</div>Siguiente</div>
      </div>
      <div class="sheet hidden" id="sheet">
        <h3>Comentarios</h3>
        ${v.comments.map((c) => `<p>${c}</p>`).join("")}
        <input id="cmt" placeholder="Escribe un comentario..." />
      </div>
    </div>`;
  main.querySelector("[data-tab='foryou']").classList.toggle("on", tab === "foryou");
  main.querySelector("[data-tab='following']").classList.toggle("on", tab === "following");
  main.querySelectorAll("[data-tab]").forEach((el) => {
    el.onclick = () => { tab = el.dataset.tab; i = 0; renderFeed(); };
  });
  main.querySelector(".next").onclick = () => { i = (i + 1) % list.length; renderFeed(); };
  main.querySelector(".like").onclick = (e) => {
    e.currentTarget.classList.toggle("liked");
    v.likes += e.currentTarget.classList.contains("liked") ? 1 : -1;
    main.querySelector(".lc").textContent = fmt(v.likes);
  };
  main.querySelector(".comments").onclick = () => main.querySelector("#sheet").classList.toggle("hidden");
  main.querySelector(".follow").onclick = (e) => {
    e.currentTarget.textContent = e.currentTarget.textContent === "Seguir" ? "Siguiendo" : "Seguir";
  };
  main.querySelector(".share").onclick = async () => {
    const text = v.cap + " — Ojea";
    if (navigator.clipboard) navigator.clipboard.writeText(text);
  };
  main.querySelector(".save").onclick = (e) => e.currentTarget.classList.toggle("liked");
  const cmt = main.querySelector("#cmt");
  if (cmt) cmt.onkeydown = (e) => {
    if (e.key === "Enter" && cmt.value.trim()) {
      v.comments.push(cmt.value.trim());
      renderFeed();
    }
  };
  const phone = main.querySelector("#phone");
  let startY = 0;
  phone.ontouchstart = (e) => { startY = e.touches[0].clientY; };
  phone.ontouchend = (e) => {
    const dy = startY - e.changedTouches[0].clientY;
    if (dy > 40) { i = (i + 1) % list.length; renderFeed(); }
    if (dy < -40) { i = (i - 1 + list.length) % list.length; renderFeed(); }
  };
}

function renderExplore() {
  main.innerHTML = `
    <div class="explore">
      <h1>Explorar México</h1>
      <div class="tags">${tags.map((t) => `<button>${t}</button>`).join("")}</div>
      <div class="grid">${videos.map((v, idx) => `<img src="${v.img}" alt="${v.loc}" data-i="${idx}" />`).join("")}</div>
    </div>`;
  main.querySelectorAll(".grid img").forEach((img) => {
    img.onclick = () => { i = Number(img.dataset.i); tab = "foryou"; setNav("feed"); renderFeed(); };
  });
}

function renderCreate() {
  main.innerHTML = `
    <div class="panel">
      <h1>Subir video</h1>
      <p>Elige una foto o video. Se guarda solo en este navegador.</p>
      <input type="file" id="file" accept="image/*,video/*" />
      <input id="caption" placeholder="Descripción y hashtags" />
      <button class="cta slim" id="pub">Publicar</button>
      <div id="preview"></div>
    </div>`;
  document.getElementById("file").onchange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    document.getElementById("preview").innerHTML = f.type.startsWith("video")
      ? `<video src="${url}" controls></video>`
      : `<img src="${url}" alt="preview" />`;
  };
  document.getElementById("pub").onclick = () => {
    const cap = document.getElementById("caption").value || "Nuevo post en Ojea #parati";
    const imgEl = document.querySelector("#preview img, #preview video");
    videos.unshift({
      user: me() ? "@" + me().name : "@invitado",
      cap,
      loc: "Ciudad de México",
      img: imgEl && imgEl.tagName === "IMG" ? imgEl.src : videos[0].img,
      likes: 0,
      comments: [],
    });
    i = 0;
    setNav("feed");
    renderFeed();
  };
}

function renderProfile() {
  const u = me();
  main.innerHTML = `
    <div class="panel">
      <h1>${u ? "@" + u.name : "Perfil"}</h1>
      <p>${u ? "Sesión local. Aún no hay backend de México." : "Inicia sesión para ver tus videos."}</p>
      <p class="muted">${videos.length} clips en el feed demo</p>
    </div>`;
}

function renderPage(id) {
  const pages = {
    about: ["Acerca de", "Ojea es la app de videos cortos hecha en México, para México. Misma idea que Zyeuté en Québec: cultura local, no algoritmo californiano."],
    contact: ["Contacto", "Escríbenos a hola@ojea.mx (placeholder). Repo: brandonlacoste9-tech/MexicanV5."],
    terms: ["Términos", "Demo. No hay cuentas reales ni cobros. El contenido de ejemplo es ilustrativo."],
    privacy: ["Privacidad", "El login se guarda en localStorage de tu navegador. No se envía a un servidor."],
  };
  const [title, body] = pages[id];
  main.innerHTML = `<div class="panel"><h1>${title}</h1><p>${body}</p></div>`;
}

function setNav(view) {
  document.querySelectorAll("nav button").forEach((x) => x.classList.toggle("active", x.dataset.view === view));
}

document.querySelectorAll("nav button").forEach((b) => {
  b.onclick = () => {
    setNav(b.dataset.view);
    ({ feed: renderFeed, explore: renderExplore, create: renderCreate, profile: renderProfile }[b.dataset.view]());
  };
});

document.querySelectorAll("footer [data-page]").forEach((a) => {
  a.onclick = (e) => {
    e.preventDefault();
    renderPage(a.dataset.page);
  };
});

document.getElementById("loginBtn").onclick = () => {
  if (me()) { setUser(null); renderProfile(); return; }
  document.getElementById("modal").classList.remove("hidden");
};
document.getElementById("closeModal").onclick = () => document.getElementById("modal").classList.add("hidden");
document.getElementById("doLogin").onclick = () => {
  const name = document.getElementById("email").value.split("@")[0] || "usuario";
  setUser({ name });
  document.getElementById("modal").classList.add("hidden");
  renderProfile();
};

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowDown") { i += 1; renderFeed(); }
  if (e.key === "ArrowUp") { i = Math.max(0, i - 1); renderFeed(); }
});

syncAuth();
renderFeed();
