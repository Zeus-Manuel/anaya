# ANAYA — sitio web

**En línea: https://zeus-manuel.github.io/anaya/**

> WhatsApp configurado: **+593 96 318 1898**. Para cambiarlo, edita `CONFIG.whatsapp`
> en `assets/app.js` (línea 10).

Sitio de una sola página para **ANAYA · El desayuno sorpresa que sabe a casa**
(Manta, Ecuador). HTML, CSS y JavaScript puros. Sin build, sin dependencias,
sin backend.

El sitio está armado sobre el posicionamiento acordado: la bandera pública es
**el regalo**, el mecanismo es **"cocinamos a tu medida"**, y las dos
restricciones del negocio (2 días de anticipación y cupos limitados) se
cuentan como **prueba de frescura**, nunca como disculpa.

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

## Al cambiar el diseño o los textos

Si tocas `assets/*.css`, `assets/*.js` o las páginas por perfil, corre esto
antes de publicar:

```bash
python3 build-icp.py   # regenera las 9 páginas de /para/
python3 stamp.py       # sella los assets con un hash de contenido
```

> **Por qué el sello es obligatorio.** GitHub Pages sirve todo con
> `cache-control: max-age=600`, y el HTML y el CSS se guardan en caché por
> separado. Sin el sello, quien ya visitó el sitio puede recibir el HTML
> nuevo con el CSS viejo durante 10 minutos y ver la página rota. Con el
> hash en la URL (`styles.css?v=613f66bf`), el HTML nuevo apunta a una URL
> nueva y el navegador está obligado a bajar el CSS nuevo.

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
| Opciones "a su medida" (keto, baja en azúcar…) | `assets/app.js` → `MEDIDA` |
| Jugos de la Semana Viva | `assets/app.js` → `JUGOS` |
| Combos sugeridos ("Dulce y suave"…) | `assets/app.js` → `PRESETS` |
| Ocasiones (cumpleaños, oficina…) | `assets/app.js` → `OCASIONES` |
| Bandejas, empanadas, oficina, bienvenida | textos directos en `index.html`, sección `#compartir` |
| Días de anticipación (hoy: 2) | `assets/app.js` → `CONFIG.anticipacionDias` |
| Textos, titulares, preguntas frecuentes | `index.html` |
| Colores y tipografías | `assets/styles.css` → bloque `:root` |

El menú vive en **un solo lugar** (`MENU`): al editarlo se actualizan a la vez
el armador de box y los datos que lee Google. Lo mismo con `JUGOS` para la
Semana Viva.

### Reglas de lenguaje que NO se deben romper

- Nunca escribir **"para diabéticos"** ni ninguna promesa médica. Se dice
  **"baja en azúcar" / "sin azúcar añadida" / "apta si cuidas el azúcar"**.
- Los **2 días de anticipación** siempre se cuentan como frescura ("nada
  guardado"), nunca como disculpa.
- Los **cupos** son reales: si un día se llena, se dice de frente.
- No inventar testimonios ni reseñas. Cuando existan clientes reales que den
  permiso, ahí se publican con nombre.

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

Tres líneas de producto, cada una con su propio camino de pedido:

- **Box Sorpresa a Tu Medida** (la bandera) — el visitante elige 1–2 platos
  principales, bebida, complemento y postre; marca adaptaciones ("a su
  medida": keto, baja en azúcar, fit, sin lácteos); añade cantidad, fecha
  (mínimo 2 días, validado solo), nombre, entrega, tarjeta escrita a mano y
  notas. Al enviar se abre WhatsApp con el pedido ya escrito:

  ```
  Hola ANAYA 👋 Quiero mi Box Sorpresa:

  🍽 Platos principales:
     • Pancakes de banana con avena
     • Waffles con miel y fruta
  🥤 Bebida: Chocolate caliente artesanal
  🧺 Complemento: Frutas frescas
  🍰 Postre: Tres leches
  ⚖️ A su medida: Baja en azúcar

  📦 Cantidad: 1 box
  📅 Fecha deseada: jueves, 20 de agosto de 2026
  🚚 Entrega: Domicilio en Manta
  🎁 Es sorpresa — tarjeta:
     "Feliz cumple, ñaña 🤍"
  🙋 Mi nombre: María Vélez
  ```

  Así se acaban los diez mensajes de ida y vuelta por pedido.

- **Semana Viva** — el combo semanal de 5 jugos con su propio selector: se
  suman botellas (se pueden repetir sabores), tope de 5, y sale su mensaje
  aparte con el reparto lunes 3 / jueves 2.
- **Desde lejos** — para ecuatorianos fuera del país que quieren mandarle algo
  a su familia en Manta. Es el segmento de mayor valor y tiene sección propia.
- **Para compartir** — Mesa Manabita (bandejas), empanadas por docena, Box
  Oficina y Amanecer Manabita (bienvenida para anfitriones Airbnb). Cada una
  abre un WhatsApp distinto, ya redactado.
- **Combos sugeridos** y **ocasiones** — un toque arma la box o abre el
  mensaje según el momento (cumpleaños, gracias, oficina, recién nacido…).
- SEO: título y descripción, Open Graph con imagen PNG, y datos estructurados
  (`FoodEstablishment` + menú completo + `FAQPage`).
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
