/* ═══════════════════════════════════════════════════════════
   ANAYA — navegación compartida (home, hub y páginas de perfil)
   Maneja el menú desplegable "Para quién es" y el menú móvil.
   ═══════════════════════════════════════════════════════════ */
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* ── Desplegable "Para quién es" ───────────────────────── */
  const toggle = $(".nav__toggle");
  const sub = $("#submenu");

  if (toggle && sub) {
    const abrir = (v) => {
      toggle.setAttribute("aria-expanded", String(v));
      sub.hidden = !v;
    };
    abrir(false);

    toggle.addEventListener("click", (e) => {
      e.stopPropagation();
      abrir(toggle.getAttribute("aria-expanded") !== "true");
    });


    document.addEventListener("click", (e) => {
      if (!sub.contains(e.target) && e.target !== toggle) abrir(false);
    });
    addEventListener("keydown", (e) => {
      if (e.key === "Escape") { abrir(false); toggle.focus(); }
    });
    $$("a", sub).forEach((a) => a.addEventListener("click", () => abrir(false)));
  }

  /* ── Menú móvil ────────────────────────────────────────── */
  const burger = $(".burger");
  const mnav = $("#mnav");

  if (burger && mnav) {
    const abrir = (v) => {
      burger.setAttribute("aria-expanded", String(v));
      mnav.hidden = !v;
      burger.setAttribute("aria-label", v ? "Cerrar menú" : "Abrir menú");
    };
    burger.addEventListener("click", () =>
      abrir(burger.getAttribute("aria-expanded") !== "true")
    );
    $$("a", mnav).forEach((a) => a.addEventListener("click", () => abrir(false)));
    addEventListener("keydown", (e) => e.key === "Escape" && abrir(false));
  }
})();
