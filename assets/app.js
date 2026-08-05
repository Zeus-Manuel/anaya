/* ═══════════════════════════════════════════════════════════
   ANAYA — lógica del sitio
   ▸ CONFIG: lo único que hay que editar para poner el sitio en línea.
   ═══════════════════════════════════════════════════════════ */

const CONFIG = {
  // Número de WhatsApp en formato internacional, SIN "+", espacios ni guiones.
  // Ecuador = 593 + el número sin el 0 inicial.
  // Ej.: 0991234567  →  "593991234567"
  whatsapp: "",                       // ← PENDIENTE: poner el número real
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
    "Pancakes de banana con avena",
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
    "Torta de banana fit",
    "Torta de zanahoria",
    "Tres leches",
    "Queso de leche",
    "Pie de limón",
  ],
};

const BANDEJAS = [
  "Ceviche de pescado",
  "Lasagña de carne o pollo",
  "Arroz con pollo",
  "Avena Bircher",
  "Torta de pescado",
  "Bandeja de empanadas de verde",
];

/* ── Combos sugeridos (armados con platos del menú de arriba) ─ */
const PRESETS = [
  {
    nombre: "Dulce y suave",
    detalle: "Pancakes, waffles y chocolate caliente",
    principales: ["Pancakes de banana con avena", "Waffles con miel y fruta"],
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
    nombre: "Fresco manabita",
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
    postre: "Torta de banana fit",
  },
];

/* ── Ocasiones (cada una abre un mensaje distinto) ─────────── */
const OCASIONES = [
  ["Cumpleaños", "🎂", "Es un cumpleaños"],
  ["Un gracias", "🤍", "Quiero agradecerle a alguien"],
  ["Aniversario", "🥂", "Es un aniversario"],
  ["Oficina o equipo", "💼", "Es para mi oficina / equipo"],
  ["Mamá o papá", "🌷", "Es para mi mamá / papá"],
  ["Recién nacido", "🍼", "Es para una familia con un recién nacido"],
  ["Porque sí", "✨", "Es solo porque quiero consentir a alguien"],
];

const LABELS = {
  principales: { titulo: "Platos principales", emoji: "🍽" },
  bebida:      { titulo: "Bebida",             emoji: "🥤" },
  complemento: { titulo: "Complemento",        emoji: "🧺" },
  postre:      { titulo: "Postre",             emoji: "🍰" },
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

/* ── Render: opciones del builder + bandejas ──────────────── */
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

  const trays = $("#trayList");
  if (trays) trays.innerHTML = BANDEJAS.map((t) => `<li>${t}</li>`).join("");

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
        `<a class="occ__chip" data-wa="Hola ANAYA 👋 ${frase}. ¿Me ayudan a armar una box para esa persona?">
          <span aria-hidden="true">${emoji}</span> ${nombre}
        </a>`
    ).join("");
  }
}

/* Aplica un combo sugerido al armador */
function applyPreset(i) {
  const p = PRESETS[i];
  if (!p) return;

  $$('input[name="principales"]').forEach((el) => (el.checked = false));
  $$('input[name="principales"]').forEach((el) => (el.disabled = false));
  $$('input[name="principales"]').forEach((el) => {
    if (p.principales.includes(el.value)) el.checked = true;
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

/* ── Estado del pedido ────────────────────────────────────── */
function readOrder() {
  const pick = (g) =>
    $$(`input[name="${g}"]:checked`).map((i) => i.value);

  return {
    principales: pick("principales"),
    bebida: pick("bebida"),
    complemento: pick("complemento"),
    postre: pick("postre"),
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
  const L = ["Hola ANAYA 👋 Quiero armar mi box:", ""];

  for (const g of ["principales", "bebida", "complemento", "postre"]) {
    if (!o[g].length) continue;
    const { titulo, emoji } = LABELS[g];
    if (g === "principales") {
      L.push(`${emoji} ${titulo}:`);
      o[g].forEach((x) => L.push(`   • ${x}`));
    } else {
      L.push(`${emoji} ${titulo}: ${o[g][0]}`);
    }
  }

  L.push("");
  L.push(`📦 Cantidad: ${o.qty} ${o.qty === 1 ? "box" : "boxes"}`);
  if (o.date) L.push(`📅 Fecha deseada: ${prettyDate(o.date)}`);
  L.push(`🚚 Entrega: ${o.delivery}`);
  if (o.gift) {
    L.push(`🎁 Es un regalo${o.giftMsg ? " — tarjeta:" : " (con tarjeta)"}`);
    if (o.giftMsg) L.push(`   "${o.giftMsg}"`);
  }
  if (o.notes) L.push(`📝 Notas: ${o.notes}`);
  if (o.name) L.push(`🙋 Mi nombre: ${o.name}`);

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

  // lista del resumen
  const list = $("#sumList");
  const rows = [];
  for (const g of ["principales", "bebida", "complemento", "postre"]) {
    // la categoría se rotula solo en el primero del grupo
    o[g].forEach((v, i) =>
      rows.push(
        `<li><div>${
          i === 0 ? `<span class="summary__cat">${LABELS[g].titulo}</span>` : ""
        }${v}</div></li>`
      )
    );
  }
  list.innerHTML = rows.length
    ? rows.join("")
    : `<li class="summary__empty">Empieza eligiendo tus platos principales.</li>`;

  // metadatos
  const meta = [];
  meta.push(`${o.qty} ${o.qty === 1 ? "box" : "boxes"}`);
  if (o.date) meta.push(prettyDate(o.date));
  meta.push(o.delivery);
  if (o.gift) meta.push("Con tarjeta de regalo");
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

/* ── Envío ────────────────────────────────────────────────── */
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
    alternateName: "ANAYA · Brunch box & más",
    description:
      "Comida casera a domicilio en Manta, Ecuador. Brunch boxes personalizables, bandejas para reuniones y cajas de regalo.",
    slogan: "Llevamos la cocina de casa hasta tu mesa",
    servesCuisine: ["Ecuatoriana", "Brunch", "Casera"],
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
        menuSection("Bandejas para reuniones", BANDEJAS),
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
  injectJSONLD();
  const y = $("#year");
  if (y) y.textContent = new Date().getFullYear();
});
