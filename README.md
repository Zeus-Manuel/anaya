# ANAYA — sitio web

**En línea: https://zeus-manuel.github.io/anaya/**

Sitio de una sola página para **ANAYA · Brunch box & más** (Manta, Ecuador).
HTML, CSS y JavaScript puros. Sin build, sin dependencias, sin backend.

Publicado con GitHub Pages desde la rama `main`: cada `git push` actualiza el
sitio en un par de minutos.

```
anaya-web/
├── index.html          ← todo el contenido
├── README.md
└── assets/
    ├── styles.css      ← diseño (colores en :root, arriba del todo)
    ├── app.js          ← CONFIG + menú + armador de box
    ├── favicon.svg
    ├── og-image.png    ← imagen al compartir el enlace (WhatsApp, Instagram)
    └── og-image.svg    ← el original editable de esa imagen
```

> Si cambias `og-image.svg`, exporta de nuevo el **PNG**: WhatsApp y Facebook
> no muestran vistas previas en SVG.

---

## 1. Lo único obligatorio antes de publicar

Abre `assets/app.js` y pon el número de WhatsApp en la **línea 10**:

```js
const CONFIG = {
  whatsapp: "593991234567",   // Ecuador: 593 + número sin el 0 inicial
  ...
};
```

> Mientras esté vacío, **todos los botones abren el DM de Instagram**
> (`ig.me/m/anaya.ec`) en vez de WhatsApp. El sitio funciona igual, pero
> conviene poner el número: el pedido pre-armado solo se envía por WhatsApp.

## 2. Ver el sitio en tu computadora

Doble clic en `index.html` funciona. Para que todo se comporte igual que en
producción:

```bash
cd anaya-web
python3 -m http.server 8000
# abre http://localhost:8000
```

## 3. Publicarlo

Es un sitio estático: sirve cualquier hosting gratuito. Arrastra la carpeta a
[Netlify Drop](https://app.netlify.com/drop), o usa Vercel / GitHub Pages /
Cloudflare Pages. No necesita servidor ni base de datos.

Después de publicar, pon el enlace en la bio de Instagram (reemplazando el
`canva.link/menuanaya` actual).

---

## Cómo editar el contenido

| Qué quieres cambiar | Dónde |
|---|---|
| Platos, bebidas, complementos, postres | `assets/app.js` → `MENU` |
| Bandejas para reuniones | `assets/app.js` → `BANDEJAS` |
| Combos sugeridos ("Dulce y suave"…) | `assets/app.js` → `PRESETS` |
| Ocasiones (cumpleaños, oficina…) | `assets/app.js` → `OCASIONES` |
| Días de anticipación (hoy: 2) | `assets/app.js` → `CONFIG.anticipacionDias` |
| Textos, titulares, preguntas frecuentes | `index.html` |
| Colores y tipografías | `assets/styles.css` → bloque `:root` |

El menú vive en **un solo lugar** (`MENU`): al editarlo se actualizan a la vez
el armador de box y los datos que lee Google.

### Poner fotos reales

Ahora mismo el brunch box del inicio es una **ilustración**, no una foto. En
cuanto tengas buenas fotos de producto, cámbialas — las fotos reales de comida
venden mucho más que cualquier dibujo:

1. Guarda la foto en `assets/` (por ejemplo `box.jpg`, máx. ~300 KB).
2. En `index.html`, dentro de `<figure class="hero__art">`, reemplaza el bloque
   `<div class="plate">…</div>` por:
   ```html
   <img src="assets/box.jpg" alt="Brunch box de ANAYA lista para abrir"
        width="800" height="800" style="border-radius:50%">
   ```

Lo mismo vale para las secciones de bandejas y regalos.

---

## Qué hace el sitio

- **Arma tu box** — el visitante elige 1–2 platos principales, bebida,
  complemento y postre; añade cantidad, fecha (mínimo 2 días, validado
  automáticamente), nombre, forma de entrega, tarjeta de regalo y notas. Al
  enviar, se abre WhatsApp con el pedido ya escrito:

  ```
  Hola ANAYA 👋 Quiero armar mi box:

  🍽 Platos principales:
     • Ceviche
     • Waffles con miel y fruta
  🥤 Bebida: Chocolate caliente artesanal
  🧺 Complemento: Frutos secos
  🍰 Postre: Pie de limón

  📦 Cantidad: 3 boxes
  📅 Fecha deseada: viernes, 7 de agosto de 2026
  🚚 Entrega: Domicilio en Manta
  🎁 Es un regalo — tarjeta: "Feliz cumple, Dani 🤍"
  📝 Notas: Una box sin lactosa
  🙋 Mi nombre: María Vélez
  ```

  Así se acaban los diez mensajes de ida y vuelta por pedido.

- **Combos sugeridos** — cuatro cajas ya armadas ("Dulce y suave", "Salado de
  casa", "Fresco manabita", "Ligero"). Un toque las carga en el armador y se
  pueden cambiar. Sirven para quien no quiere decidir entre diez platos.
- **Ocasiones** — cumpleaños, agradecer, oficina, recién nacido… cada una abre
  un mensaje distinto, para vender la box como regalo y no solo como comida.
- **Bandejas**, **cajas de regalo**, **cómo pedir** y **preguntas frecuentes**
  con el contenido que ya estaba en el menú de Canva.
- SEO: título y descripción, Open Graph al compartir, y datos estructurados
  (`FoodEstablishment` + menú completo + `FAQPage`) que Google entiende.
- Accesible: navegación por teclado, foco visible, textos alternativos,
  respeta `prefers-reduced-motion`.
- Móvil primero: barra fija de pedido al armar la box desde el teléfono.

## Pendientes para la dueña del negocio

- [ ] Número de WhatsApp en `CONFIG.whatsapp`
- [ ] Fotos reales de producto (ver arriba)
- [ ] Decidir si mostrar precios — hoy el sitio dice que el valor se confirma
      por WhatsApp. Mostrarlos suele aumentar los pedidos y reducir preguntas;
      si los defines, se pueden añadir junto a cada opción.
- [ ] Confirmar zona de entrega y horarios de atención para la sección final
- [ ] Testimonios de clientas reales (no se inventaron; hay espacio para
      añadir una sección cuando los tengas)
