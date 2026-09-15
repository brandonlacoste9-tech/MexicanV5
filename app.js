const videos = [
  {
    user: "@chile_y_lima",
    cap: "Tacos al pastor a las 2am en la Roma. ¿Quién se apunta? #CDMX #tacos #parati",
    loc: "Ciudad de México",
    img: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800",
    likes: "12.4k",
    comments: "318",
  },
  {
    user: "@guadalajara.nights",
    cap: "El centro de GDL de noche pega diferente. #Guadalajara #Jalisco",
    loc: "Guadalajara",
    img: "https://images.unsplash.com/photo-1518659526054-190340b32735?w=800",
    likes: "8.1k",
    comments: "204",
  },
  {
    user: "@norteño.mx",
    cap: "Monterrey, cerro de la Silla siempre presente. #MTY #NuevoLeon",
    loc: "Monterrey",
    img: "https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?w=800",
    likes: "6.7k",
    comments: "155",
  },
  {
    user: "@yucatan.sabor",
    cap: "Cochinita que sí sabe a casa. #Merida #Yucatan #parati",
    loc: "Mérida",
    img: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=800",
    likes: "9.9k",
    comments: "412",
  },
];

const tags = ["#parati", "#CDMX", "#tacos", "#Guadalajara", "#Monterrey", "#musica", "#futbol", "#playa"];
let i = 0;
const main = document.getElementById("main");

function renderFeed() {
  const v = videos[i];
  main.innerHTML = `
    <div class="phone">
      <div class="top"><b>Para ti</b><span>Siguiendo</span></div>
      <img class="poster" src="${v.img}" alt="${v.loc}" />
      <div class="meta">
        <div class="user">${v.user} · Seguir</div>
        <div class="cap">${v.cap}</div>
        <div class="loc">📍 ${v.loc}</div>
      </div>
      <div class="acts">
        <div class="act"><div class="dot like">♥</div>${v.likes}</div>
        <div class="act"><div class="dot">💬</div>${v.comments}</div>
        <div class="act"><div class="dot">↗</div>Compartir</div>
        <div class="act"><div class="dot">🔖</div>Guardar</div>
        <div class="act"><div class="dot next">↓</div>Siguiente</div>
      </div>
    </div>`;
  main.querySelector(".next").onclick = () => { i = (i + 1) % videos.length; renderFeed(); };
  main.querySelector(".like").onclick = (e) => e.currentTarget.classList.toggle("liked");
}

function renderExplore() {
  main.innerHTML = `
    <div class="explore">
      <h1>Explorar México</h1>
      <div class="tags">${tags.map((t) => `<button>${t}</button>`).join("")}</div>
      <div class="grid">${videos.map((v) => `<img src="${v.img}" alt="${v.loc}" />`).join("")}</div>
    </div>`;
}

function renderCreate() {
  main.innerHTML = `<div class="panel"><h1>Subir video</h1><p>Pronto: carga, recorte y publicación en es-MX.</p><button class="cta" style="margin-top:16px;max-width:220px">Seleccionar archivo</button></div>`;
}

function renderProfile() {
  main.innerHTML = `<div class="panel"><h1>Perfil</h1><p>Inicia sesión para ver tus videos, likes y seguidores.</p></div>`;
}

document.querySelectorAll("nav button").forEach((b) => {
  b.onclick = () => {
    document.querySelectorAll("nav button").forEach((x) => x.classList.remove("active"));
    b.classList.add("active");
    const view = b.dataset.view;
    if (view === "feed") renderFeed();
    if (view === "explore") renderExplore();
    if (view === "create") renderCreate();
    if (view === "profile") renderProfile();
  };
});

document.getElementById("loginBtn").onclick = () => document.getElementById("modal").classList.remove("hidden");
document.getElementById("closeModal").onclick = () => document.getElementById("modal").classList.add("hidden");

renderFeed();
