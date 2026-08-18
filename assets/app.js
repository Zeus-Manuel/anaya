/* ═══════════════════════════════════════════════════════════
   ANAYA — lógica del sitio
   ▸ CONFIG: lo único que hay que editar para poner el sitio en línea.
   ═══════════════════════════════════════════════════════════ */

const CONFIG = {
  // Número de WhatsApp en formato internacional, SIN "+", espacios ni guiones.
  // Ecuador = 593 + el número sin el 0 inicial.
  // Ej.: 0991234567  →  "593991234567"
  whatsapp: "593963181898",           // Manta, Ecuador
  instagram: "anaya.ec",
  ciudad: "Manta",
  anticipacionDias: 2,
};

/* ── Menú (fuente única: builder + datos estructurados) ───── */
const MENU = {
  principales: [
    "Ceviche",
    "Torta de pescado",
    "Torta de choclo",
    "Torrejas de verde",
    "Torrejas de choclo",
    "Sánduche de pollo",
    "Sánduche de embutidos",
    "Avena Bircher",
    "Pancakes de guineo con avena",
    "Waffles con miel y fruta",
  ],
  bebida: [
    "Jugo de naranjilla",
    "Jugo de naranja natural",
    "Jugo de zanahoria y naranja",
    "Jamaica",
    "Colada de avena",
    "Chocolate caliente artesanal",
  ],
  complemento: ["Frutas frescas", "Frutos secos", "Queso"],
  postre: [
    "Torta de guineo fit",
    "Torta de zanahoria",
    "Tres leches",
    "Queso de leche",
    "Pie de limón",
  ],
};

/* A su medida — adaptación sin recargo (nunca lenguaje médico) */
const MEDIDA = ["Keto", "Baja en azúcar", "Fit", "Sin lácteos"];

/* Semana Viva — jugos del combo semanal */
const JUGOS = [
  "Jugo de naranjilla",
  "Jugo de naranja natural",
  "Jugo de zanahoria y naranja",
  "Jamaica",
  "Colada de avena",
];

/* Combos sugeridos (armados con platos del menú de arriba) */
const PRESETS = [
  {
    nombre: "Dulce y suave",
    detalle: "Pancakes, waffles y chocolate caliente",
    principales: ["Pancakes de guineo con avena", "Waffles con miel y fruta"],
    bebida: "Chocolate caliente artesanal",
    complemento: "Frutas frescas",
    postre: "Tres leches",
  },
  {
    nombre: "Salado de casa",
    detalle: "Sánduche de pollo y torrejas de verde",
    principales: ["Sánduche de pollo", "Torrejas de verde"],
    bebida: "Jugo de naranja natural",
    complemento: "Queso",
    postre: "Torta de zanahoria",
  },
  {
    nombre: "Fresco manaba",
    detalle: "Ceviche y torta de pescado",
    principales: ["Ceviche", "Torta de pescado"],
    bebida: "Jugo de naranjilla",
    complemento: "Frutas frescas",
    postre: "Pie de limón",
  },
  {
    nombre: "Ligero",
    detalle: "Avena Bircher y frutos secos",
    principales: ["Avena Bircher"],
    bebida: "Jugo de zanahoria y naranja",
    complemento: "Frutos secos",
    postre: "Torta de guineo fit",
  },
];

/* Ocasiones (cada una abre un mensaje distinto) */
const OCASIONES = [
  ["Cumpleaños", "🎂", "Es un cumpleaños"],
  ["Un gracias", "🤍", "Quiero agradecerle a alguien"],
  ["Aniversario", "🥂", "Es un aniversario"],
  ["Oficina o equipo", "💼", "Es para mi oficina o mi equipo"],
  ["Mamá o papá", "🌷", "Es para mi mamá o mi papá"],
  ["Recién nacido", "🍼", "Es para una familia con un recién nacido"],
  ["Porque sí", "✨", "Es solo porque quiero consentir a alguien"],
];

/* Sin emoji en los mensajes: WhatsApp los recibe como "?" en algunos
   equipos porque son caracteres de 4 bytes. Los acentos sí viajan bien. */
const LABELS = {
  principales: { titulo: "Platos principales" },
  bebida:      { titulo: "Bebida" },
  complemento: { titulo: "Complemento" },
  postre:      { titulo: "Postre" },
  medida:      { titulo: "A su medida" },
};

const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

/* ── Enlace de contacto ───────────────────────────────────── */
/* Si aún no hay número de WhatsApp configurado, caemos al DM de
   Instagram para que el sitio nunca lleve a un enlace roto.      */
function contactURL(text) {
  const num = String(CONFIG.whatsapp || "").replace(/\D/g, "");
  if (num) return `https://wa.me/${num}?text=${encodeURIComponent(text)}`;
  return `https://ig.me/m/${CONFIG.instagram}`;
}

function wireContactLinks() {
  if (!String(CONFIG.whatsapp || "").replace(/\D/g, "")) {
    console.warn(
      "[ANAYA] Falta CONFIG.whatsapp en assets/app.js — los botones abren el DM de Instagram mientras tanto."
    );
  }
  $$("[data-wa]").forEach((el) => {
    el.setAttribute("href", contactURL(el.dataset.wa));
    el.setAttribute("target", "_blank");
    el.setAttribute("rel", "noopener");
  });
}

/* ── Navegación móvil ─────────────────────────────────────── */
function wireNav() {
  const burger = $(".burger");
  const mnav = $("#mnav");
  if (!burger || !mnav) return;

  const setOpen = (open) => {
    burger.setAttribute("aria-expanded", String(open));
    mnav.hidden = !open;
    burger.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
  };
  burger.addEventListener("click", () =>
    setOpen(burger.getAttribute("aria-expanded") !== "true")
  );
  $$("a", mnav).forEach((a) => a.addEventListener("click", () => setOpen(false)));
  addEventListener("keydown", (e) => e.key === "Escape" && setOpen(false));
}

/* ── Render: builder, medida, presets, ocasiones, jugos ───── */
function renderMenu() {
  Object.entries(MENU).forEach(([group, items]) => {
    const host = $(`[data-opts="${group}"]`);
    if (!host) return;
    const multi = group === "principales";
    host.innerHTML = items
      .map((item, i) => {
        const id = `${group}-${i}`;
        return `<label class="opt">
          <input type="${multi ? "checkbox" : "radio"}" name="${group}" id="${id}" value="${item}">
          <span>${item}</span>
        </label>`;
      })
      .join("");
  });

  const medidaHost = $('[data-opts="medida"]');
  if (medidaHost) {
    medidaHost.innerHTML = MEDIDA.map(
      (m, i) => `<label class="opt">
        <input type="checkbox" name="medida" id="medida-${i}" value="${m}">
        <span>${m}</span>
      </label>`
    ).join("");
  }

  const presets = $("#presetRow");
  if (presets) {
    presets.innerHTML = PRESETS.map(
      (p, i) => `<button type="button" class="preset" data-preset="${i}">
        <span class="preset__name">${p.nombre}</span>
        <span class="preset__detalle">${p.detalle}</span>
        <span class="preset__go">Usar este <span aria-hidden="true">→</span></span>
      </button>`
    ).join("");
  }

  const occ = $("#occRow");
  if (occ) {
    occ.innerHTML = OCASIONES.map(
      ([nombre, emoji, frase]) =>
        `<a class="occ__chip" data-wa="Hola ANAYA! ${frase}. ¿Me ayudan a armar una box para esa persona?">
          <span aria-hidden="true">${emoji}</span> ${nombre}
        </a>`
    ).join("");
  }

  const juices = $("#juiceList");
  if (juices) {
    juices.innerHTML = JUGOS.map(
      (j, i) => `<div class="juice" data-juice="${i}">
        <span class="juice__name">${j}</span>
        <div class="juice__ctrl">
          <button type="button" class="juice__btn" data-dir="-1" aria-label="Quitar ${j}">−</button>
          <span class="juice__n" id="jn-${i}">0</span>
          <button type="button" class="juice__btn" data-dir="1" aria-label="Sumar ${j}">+</button>
        </div>
      </div>`
    ).join("");
  }
}

/* Aplica un combo sugerido al armador */
function applyPreset(i) {
  const p = PRESETS[i];
  if (!p) return;

  $$('input[name="principales"]').forEach((el) => {
    el.disabled = false;
    el.checked = p.principales.includes(el.value);
  });
  ["bebida", "complemento", "postre"].forEach((g) => {
    $$(`input[name="${g}"]`).forEach((el) => (el.checked = el.value === p[g]));
  });

  update();
  $$(".preset").forEach((b) =>
    b.classList.toggle("is-on", Number(b.dataset.preset) === i)
  );
  $(".summary__card").scrollIntoView({ behavior: "smooth", block: "center" });
}

/* ── Fecha mínima (hoy + días de anticipación) ────────────── */
function isoLocal(d) {
  return new Date(d.getTime() - d.getTimezoneOffset() * 6e4)
    .toISOString()
    .slice(0, 10);
}
function wireDate() {
  const f = $("#fDate");
  if (!f) return;
  const min = new Date();
  min.setDate(min.getDate() + CONFIG.anticipacionDias);
  f.min = isoLocal(min);
  f.value = isoLocal(min);
}
function prettyDate(iso) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("es-EC", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/* ── Estado del pedido (Box Sorpresa) ─────────────────────── */
function readOrder() {
  const pick = (g) => $$(`input[name="${g}"]:checked`).map((i) => i.value);

  return {
    principales: pick("principales"),
    bebida: pick("bebida"),
    complemento: pick("complemento"),
    postre: pick("postre"),
    medida: pick("medida"),
    qty: Math.max(1, parseInt($("#fQty").value, 10) || 1),
    date: $("#fDate").value,
    name: $("#fName").value.trim(),
    delivery: $("#fDelivery").value,
    gift: $("#fGift").checked,
    giftMsg: $("#fGiftMsg").value.trim(),
    notes: $("#fNotes").value.trim(),
  };
}

function orderText(o) {
  const L = ["Hola ANAYA! Quiero mi Box Sorpresa:", ""];

  for (const g of ["principales", "bebida", "complemento", "postre"]) {
    if (!o[g].length) continue;
    const { titulo } = LABELS[g];
    if (g === "principales") {
      L.push(`${titulo}:`);
      o[g].forEach((x) => L.push(`   • ${x}`));
    } else {
      L.push(`${titulo}: ${o[g][0]}`);
    }
  }
  if (o.medida.length) L.push(`A su medida: ${o.medida.join(", ")}`);

  L.push("");
  L.push(`Cantidad: ${o.qty} ${o.qty === 1 ? "box" : "boxes"}`);
  if (o.date) L.push(`Fecha deseada: ${prettyDate(o.date)}`);
  L.push(`Entrega: ${o.delivery}`);
  if (o.gift) {
    L.push(`Es sorpresa${o.giftMsg ? " — tarjeta:" : " (con tarjeta a mano)"}`);
    if (o.giftMsg) L.push(`   "${o.giftMsg}"`);
  }
  if (o.notes) L.push(`Notas: ${o.notes}`);
  if (o.name) L.push(`Mi nombre: ${o.name}`);

  return L.join("\n");
}

/* ── Validación + resumen ─────────────────────────────────── */
function isComplete(o) {
  return (
    o.principales.length >= 1 &&
    o.principales.length <= 2 &&
    o.bebida.length === 1 &&
    o.complemento.length === 1 &&
    o.postre.length === 1
  );
}

function missingText(o) {
  const falta = [];
  if (!o.principales.length) falta.push("un plato principal");
  if (!o.bebida.length) falta.push("una bebida");
  if (!o.complemento.length) falta.push("un complemento");
  if (!o.postre.length) falta.push("un postre");
  if (falta.length === 1) return `Falta elegir ${falta[0]}`;
  return `Falta elegir ${falta.slice(0, -1).join(", ")} y ${falta.at(-1)}`;
}

function limitPrincipales() {
  const boxes = $$('input[name="principales"]');
  const n = boxes.filter((b) => b.checked).length;
  boxes.forEach((b) => (b.disabled = !b.checked && n >= 2));
}

function update() {
  limitPrincipales();
  const o = readOrder();

  // lista del resumen (la categoría se rotula solo en el primero del grupo)
  const list = $("#sumList");
  const rows = [];
  for (const g of ["principales", "bebida", "complemento", "postre"]) {
    o[g].forEach((v, i) =>
      rows.push(
        `<li><div>${
          i === 0 ? `<span class="summary__cat">${LABELS[g].titulo}</span>` : ""
        }${v}</div></li>`
      )
    );
  }
  if (o.medida.length)
    rows.push(
      `<li><div><span class="summary__cat">A su medida</span>${o.medida.join(" · ")}</div></li>`
    );
  list.innerHTML = rows.length
    ? rows.join("")
    : `<li class="summary__empty">Empieza eligiendo los platos principales.</li>`;

  // metadatos
  const meta = [];
  meta.push(`${o.qty} ${o.qty === 1 ? "box" : "boxes"}`);
  if (o.date) meta.push(prettyDate(o.date));
  meta.push(o.delivery);
  if (o.gift) meta.push("Con tarjeta escrita a mano");
  $("#sumMeta").innerHTML = meta.map((m) => `<div>${m}</div>`).join("");

  // estado del botón
  const ok = isComplete(o);
  $("#sendBtn").disabled = !ok;
  $("#missingMsg").textContent = ok ? "" : missingText(o);

  // barra fija en móvil
  const count = rows.length;
  document.body.classList.toggle("has-sticky", count > 0);
  const sb = $("#stickybar");
  sb.hidden = count === 0;
  $("#sbCount").textContent = count;
  $("#sbWord").textContent = count === 1 ? "selección" : "selecciones";
  $("#sbSend").disabled = !ok;
  $("#sbSend").textContent = ok ? "Enviar pedido" : "Completa tu box";
}

/* ── Envío (Box Sorpresa) ─────────────────────────────────── */
function send() {
  const o = readOrder();
  if (!isComplete(o)) {
    const first = ["principales", "bebida", "complemento", "postre"].find(
      (g) => !o[g].length
    );
    const fs = $(`[data-group="${first}"]`);
    if (fs) {
      fs.classList.add("is-invalid");
      fs.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => fs.classList.remove("is-invalid"), 2200);
    }
    return;
  }
  window.open(contactURL(orderText(o)), "_blank", "noopener");
}

function wireBuilder() {
  const form = $("#boxForm");
  if (!form) return;

  form.addEventListener("change", (e) => {
    if (e.target.id === "fGift") $("#giftWrap").hidden = !e.target.checked;
    // al tocar el menú a mano, deja de estar "activo" un combo sugerido
    if (e.target.name) $$(".preset").forEach((b) => b.classList.remove("is-on"));
    update();
  });
  form.addEventListener("input", update);
  form.addEventListener("submit", (e) => e.preventDefault());

  $("#sendBtn").addEventListener("click", send);
  $("#sbSend").addEventListener("click", send);

  const row = $("#presetRow");
  if (row)
    row.addEventListener("click", (e) => {
      const b = e.target.closest(".preset");
      if (b) applyPreset(Number(b.dataset.preset));
    });

  $("#copyBtn").addEventListener("click", async () => {
    const txt = orderText(readOrder());
    const status = $("#copyStatus");
    try {
      await navigator.clipboard.writeText(txt);
      status.textContent = "Pedido copiado ✓";
    } catch {
      const ta = document.createElement("textarea");
      ta.value = txt;
      ta.style.cssText = "position:fixed;opacity:0";
      document.body.append(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
      status.textContent = "Pedido copiado ✓";
    }
    setTimeout(() => (status.textContent = ""), 2600);
  });

  update();
}

/* ── Semana Viva (5 jugos, con repetición) ────────────────── */
const juiceState = JUGOS.map(() => 0);
const juiceTotal = () => juiceState.reduce((a, b) => a + b, 0);

function juiceText() {
  const L = ["Hola ANAYA! Quiero mi Semana Viva (combo semanal de jugos):", ""];
  JUGOS.forEach((j, i) => {
    if (juiceState[i] > 0) L.push(`${juiceState[i]}× ${j}`);
  });
  L.push("");
  L.push("5 botellas: 3 el lunes y 2 el jueves");
  return L.join("\n");
}

function updateJuices() {
  const total = juiceTotal();
  JUGOS.forEach((_, i) => {
    const n = $(`#jn-${i}`);
    if (n) n.textContent = juiceState[i];
    const card = $(`[data-juice="${i}"]`);
    if (card) card.classList.toggle("is-on", juiceState[i] > 0);
    const plus = $(`[data-juice="${i}"] [data-dir="1"]`);
    if (plus) plus.disabled = total >= 5;
    const minus = $(`[data-juice="${i}"] [data-dir="-1"]`);
    if (minus) minus.disabled = juiceState[i] === 0;
  });

  $("#juiceCount").textContent = `${total} de 5 botellas`;

  const sum = $("#juiceSum");
  const items = [];
  JUGOS.forEach((j, i) => {
    if (juiceState[i] > 0) items.push(`<li><div>${juiceState[i]}× ${j}</div></li>`);
  });
  sum.innerHTML = items.length
    ? items.join("")
    : `<li class="summary__empty">Elige tus 5 botellas.</li>`;

  const ok = total === 5;
  $("#juiceSend").disabled = !ok;
  $("#juiceLabel").textContent = ok
    ? "Pedir mi semana"
    : 5 - total === 1
      ? "Te falta 1 botella"
      : `Te faltan ${5 - total} botellas`;
}

function wireJuices() {
  const host = $("#juiceList");
  if (!host) return;
  host.addEventListener("click", (e) => {
    const btn = e.target.closest(".juice__btn");
    if (!btn) return;
    const card = btn.closest("[data-juice]");
    const i = Number(card.dataset.juice);
    const dir = Number(btn.dataset.dir);
    const next = juiceState[i] + dir;
    if (next < 0) return;
    if (dir > 0 && juiceTotal() >= 5) return;
    juiceState[i] = next;
    updateJuices();
  });
  $("#juiceSend").addEventListener("click", () => {
    if (juiceTotal() !== 5) return;
    window.open(contactURL(juiceText()), "_blank", "noopener");
  });
  updateJuices();
}

/* ── Datos estructurados (SEO) ────────────────────────────── */
function injectJSONLD() {
  const menuSection = (name, items) => ({
    "@type": "MenuSection",
    name,
    hasMenuItem: items.map((n) => ({ "@type": "MenuItem", name: n })),
  });

  const data = {
    "@context": "https://schema.org",
    "@type": "FoodEstablishment",
    name: "ANAYA",
    alternateName: "ANAYA · El desayuno sorpresa que sabe a casa",
    description:
      "Cocina de casa por encargo en Manta, Ecuador. Box sorpresa personalizada con tarjeta escrita a mano, combo semanal de jugos naturales, bandejas manabas y empanadas por docena. Todo se cocina la misma mañana de la entrega.",
    slogan: "Llevamos la cocina de casa hasta tu mesa",
    servesCuisine: ["Ecuatoriana", "Manabita", "Desayunos", "Casera"],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Manta",
      addressRegion: "Manabí",
      addressCountry: "EC",
    },
    areaServed: { "@type": "City", name: "Manta" },
    sameAs: [`https://instagram.com/${CONFIG.instagram}`],
    hasMenu: {
      "@type": "Menu",
      name: "Arma tu box",
      hasMenuSection: [
        menuSection("Platos principales", MENU.principales),
        menuSection("Bebidas", MENU.bebida),
        menuSection("Complementos", MENU.complemento),
        menuSection("Postres", MENU.postre),
        menuSection("Semana Viva — jugos", JUGOS),
        menuSection("Para compartir", [
          "La Mesa Manabita (bandeja familiar)",
          "Empanadas de verde por docena",
          "Empanadas de maíz por docena",
          "Box Oficina",
          "Amanecer Manabita (box de bienvenida)",
        ]),
      ],
    },
  };

  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: $$("#acc details").map((d) => ({
      "@type": "Question",
      name: $("summary", d).textContent.trim(),
      acceptedAnswer: {
        "@type": "Answer",
        text: $("p", d).textContent.trim(),
      },
    })),
  };

  [data, faq].forEach((obj) => {
    const s = document.createElement("script");
    s.type = "application/ld+json";
    s.textContent = JSON.stringify(obj);
    document.head.append(s);
  });
}

/* ── Init ─────────────────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", () => {
  renderMenu();
  wireContactLinks();
  wireNav();
  wireDate();
  wireBuilder();
  wireJuices();
  injectJSONLD();
  const y = $("#year");
  if (y) y.textContent = new Date().getFullYear();
});
