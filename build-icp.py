#!/usr/bin/env python3
"""Genera las páginas de aterrizaje por ICP en /para/<slug>/index.html
a partir de /tmp/icp-paginas.json (salida del workflow).

Reusa el mismo sistema de diseño del sitio: assets/styles.css + assets/icp.css
"""
import json, html, os, re, pathlib

RAIZ = pathlib.Path(__file__).parent
SITIO = "https://zeus-manuel.github.io/anaya"
WA = "593963181898"

def esc(t):
    return html.escape(str(t), quote=True)

def wa_url(texto):
    from urllib.parse import quote
    return f"https://wa.me/{WA}?text={quote(texto)}"

ICO_WA = ('<svg class="ico-wa" viewBox="0 0 24 24" aria-hidden="true"><path d="M12.04 2A9.9 9.9 0 0 0 2.1 11.9c0 1.75.46 3.46 1.34 4.97L2 22l5.28-1.38a9.9 9.9 0 0 0 4.76 1.21h.01a9.9 9.9 0 0 0 9.94-9.9A9.9 9.9 0 0 0 12.04 2Zm5.8 14.06c-.25.69-1.45 1.32-2 1.36-.51.04-1.16.06-1.87-.12a16.9 16.9 0 0 1-1.7-.63c-2.99-1.29-4.94-4.3-5.09-4.5-.15-.2-1.22-1.62-1.22-3.1 0-1.47.77-2.2 1.05-2.5.27-.3.6-.37.8-.37h.57c.19 0 .43-.03.67.51.25.6.85 2.07.92 2.22.08.15.13.33.03.53-.1.2-.15.32-.3.5s-.31.39-.44.53c-.15.15-.3.31-.13.6.17.3.76 1.25 1.63 2.03 1.12 1 2.06 1.3 2.36 1.45.3.15.47.13.64-.08.17-.2.73-.85.93-1.15.2-.3.39-.25.66-.15.27.1 1.72.81 2.02.96.3.15.5.22.57.35.07.13.07.74-.18 1.43Z"/></svg>')

def pagina_html(slug, p, otras):
    t = lambda k: p[k]
    prod = p["producto"]
    cierre = p["cierre"]

    incluye = "\n".join(
        f'          <li>{esc(x)}</li>' for x in prod["incluye"])
    puntos = "\n".join(
        f'''        <article class="mec__item">
          <h3>{esc(pt["titulo"])}</h3>
          <p>{esc(pt["texto"])}</p>
        </article>''' for pt in p["mecanismo"]["puntos"])
    dolor = "\n".join(
        f'        <p>{esc(x)}</p>' for x in p["dolor"]["parrafos"])
    objec = "\n".join(
        f'''      <details>
        <summary>{esc(o["pregunta"])}</summary>
        <p>{esc(o["respuesta"])}</p>
      </details>''' for o in p["objeciones"])
    otras_li = "\n".join(
        f'        <li><a href="../{s}/">{esc(n)}</a></li>'
        for s, n in otras)

    faq_ld = json.dumps({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [{
            "@type": "Question", "name": o["pregunta"],
            "acceptedAnswer": {"@type": "Answer", "text": o["respuesta"]},
        } for o in p["objeciones"]],
    }, ensure_ascii=False)

    breadcrumb_ld = json.dumps({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "ANAYA", "item": f"{SITIO}/"},
            {"@type": "ListItem", "position": 2, "name": p["h1"], "item": f"{SITIO}/para/{slug}/"},
        ],
    }, ensure_ascii=False)

    return f'''<!DOCTYPE html>
<html lang="es-EC">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
<title>{esc(t("title"))}</title>
<meta name="description" content="{esc(t("description"))}" />
<meta name="theme-color" content="#4E351D" />
<link rel="canonical" href="{SITIO}/para/{slug}/" />

<meta property="og:type" content="website" />
<meta property="og:site_name" content="ANAYA" />
<meta property="og:locale" content="es_EC" />
<meta property="og:url" content="{SITIO}/para/{slug}/" />
<meta property="og:title" content="{esc(t("title"))}" />
<meta property="og:description" content="{esc(t("description"))}" />
<meta property="og:image" content="{SITIO}/assets/og-image.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta name="twitter:card" content="summary_large_image" />

<link rel="icon" href="../../assets/favicon.svg" type="image/svg+xml" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600&family=Montserrat:ital,wght@0,400;0,500;0,600;1,400&display=swap" />
<link rel="stylesheet" href="../../assets/styles.css" />
<link rel="stylesheet" href="../../assets/icp.css" />
<script src="../../assets/nav.js" defer></script>

<script type="application/ld+json">{faq_ld}</script>
<script type="application/ld+json">{breadcrumb_ld}</script>
</head>

<body class="icp">
<a class="skip" href="#oferta">Ir directo al pedido</a>

<header class="nav">
  <div class="wrap nav__in">
    <a class="brand" href="../../" aria-label="ANAYA — inicio">
      <span class="brand__mark" aria-hidden="true">
        <svg viewBox="0 0 64 64" width="34" height="34"><circle cx="32" cy="32" r="31" fill="#FFF8BD"/><text x="32" y="38" text-anchor="middle" font-family="Cormorant Garamond, serif" font-size="15" font-weight="600" letter-spacing="1.2" fill="#4E351D">ANAYA</text></svg>
      </span>
      <span class="brand__word">ANAYA</span>
    </a>
    <nav class="nav__links" aria-label="Principal">
      <div class="nav__item nav__item--sub">
        <button class="nav__toggle" aria-expanded="false" aria-controls="submenu">Para quién es <svg class="nav__chev" viewBox="0 0 12 8" aria-hidden="true"><path d="M1 1.5 6 6.5l5-5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
        <div class="subnav" id="submenu" hidden>
          <div class="subnav__in">
            <div class="subnav__col">
              <h3>Para regalar</h3>
              <ul>
              <li><a href="../regalo-sorpresa/">Sorprender a mi pareja o a mi mejor amiga</a></li>
              <li><a href="../desde-el-exterior/">Vivo fuera y mi familia está en Manta</a></li>
              <li><a href="../regalos-para-tu-equipo/">Regalarle a mi equipo o a mis clientes</a></li>
              </ul>
            </div>
            <div class="subnav__col">
              <h3>Para tu semana</h3>
              <ul>
              <li><a href="../semana-sin-cocinar/">Salgo temprano y llego tarde</a></li>
              <li><a href="../comida-fit/">Entreno y quiero comer acorde</a></li>
              <li><a href="../baja-en-azucar/">Cuido el azúcar o como keto</a></li>
              </ul>
            </div>
            <div class="subnav__col">
              <h3>Para compartir</h3>
              <ul>
              <li><a href="../bandeja-familiar/">Tengo reunión en casa</a></li>
              <li><a href="../desayuno-de-oficina/">Me toca el desayuno de la reunión</a></li>
              <li><a href="../huespedes-airbnb/">Recibo huéspedes</a></li>
              </ul>
            </div>
          </div>
          <a class="subnav__all" href="../">Ver todos los casos →</a>
        </div>
      </div>
      <a href="../../#sorpresa">Arma tu box</a>
      <a href="../../#semana">Tu semana</a>
      <a href="../../#compartir">Para compartir</a>
      <a href="../../#faq">Preguntas</a>
    </nav>
    <a class="btn btn--wa nav__cta" href="{wa_url(cierre["wa"])}" target="_blank" rel="noopener">
      {ICO_WA}Pedir por WhatsApp</a>
    <button class="burger" aria-expanded="false" aria-controls="mnav" aria-label="Abrir men\u00fa"><span></span><span></span><span></span></button>
  </div>
  <nav class="mnav" id="mnav" aria-label="Menú móvil" hidden>
    <p class="mnav__group">Para quién es</p>
    <p class="mnav__group">Para regalar</p>
    <a class="mnav__sub" href="../regalo-sorpresa/">Sorprender a mi pareja o a mi mejor amiga</a>
    <a class="mnav__sub" href="../desde-el-exterior/">Vivo fuera y mi familia está en Manta</a>
    <a class="mnav__sub" href="../regalos-para-tu-equipo/">Regalarle a mi equipo o a mis clientes</a>
    <p class="mnav__group">Para tu semana</p>
    <a class="mnav__sub" href="../semana-sin-cocinar/">Salgo temprano y llego tarde</a>
    <a class="mnav__sub" href="../comida-fit/">Entreno y quiero comer acorde</a>
    <a class="mnav__sub" href="../baja-en-azucar/">Cuido el azúcar o como keto</a>
    <p class="mnav__group">Para compartir</p>
    <a class="mnav__sub" href="../bandeja-familiar/">Tengo reunión en casa</a>
    <a class="mnav__sub" href="../desayuno-de-oficina/">Me toca el desayuno de la reunión</a>
    <a class="mnav__sub" href="../huespedes-airbnb/">Recibo huéspedes</a>
    <a class="mnav__sub" href="../">Ver todos los casos</a>
    <p class="mnav__group">El menú</p>
    <a href="../../#sorpresa">Arma tu box</a>
    <a href="../../#semana">Tu semana</a>
    <a href="../../#compartir">Para compartir</a>
    <a href="../../#faq">Preguntas</a>
    <a class="mnav__wa" href="{wa_url(cierre["wa"])}" target="_blank" rel="noopener">Pedir por WhatsApp</a>
  </nav>
</header>

<main>

<section class="icp-hero">
  <div class="wrap">
    <p class="icp-crumb"><a href="../../">ANAYA</a> · Cocina de casa por encargo en Manta</p>
    <h1>{esc(t("h1"))}</h1>
    <p class="lead">{esc(t("lead"))}</p>
    <div class="icp-hero__cta">
      <a class="btn btn--wa" href="{wa_url(prod["wa"])}" target="_blank" rel="noopener">
        {ICO_WA}{esc(cierre["boton"])}</a>
      <a class="btn btn--ghost" href="#oferta">Ver qué incluye</a>
    </div>
  </div>
</section>

<section class="icp-dolor">
  <div class="wrap icp-narrow">
    <h2>{esc(p["dolor"]["titulo"])}</h2>
{dolor}
  </div>
</section>

<section class="icp-mec">
  <div class="wrap">
    <header class="sec-head sec-head--center sec-head--light">
      <h2>{esc(p["mecanismo"]["titulo"])}</h2>
      <p class="sec-sub">{esc(p["mecanismo"]["intro"])}</p>
    </header>
    <div class="mec__grid">
{puntos}
    </div>
  </div>
</section>

<section class="icp-oferta" id="oferta">
  <div class="wrap icp-oferta__in">
    <div class="icp-oferta__card">
      <p class="eyebrow">Lo que pides</p>
      <h2>{esc(prod["nombre"])}</h2>
      <p class="icp-tagline">{esc(prod["tagline"])}</p>
      <ul class="icp-incluye">
{incluye}
      </ul>
      <p class="icp-nota">{esc(prod["nota"])}</p>
      <a class="btn btn--wa btn--block" href="{wa_url(prod["wa"])}" target="_blank" rel="noopener">
        {ICO_WA}{esc(cierre["boton"])}</a>
      <p class="icp-mini">Te confirmamos el valor y el cupo por WhatsApp. La tarjeta escrita a mano va gratis.</p>
    </div>
  </div>
</section>

<section class="icp-faq">
  <div class="wrap icp-narrow">
    <h2>Antes de pedir</h2>
    <div class="acc">
{objec}
    </div>
  </div>
</section>

<section class="final">
  <div class="wrap final__in">
    <h2>{esc(cierre["titulo"])}</h2>
    <p>{esc(cierre["texto"])}</p>
    <div class="final__cta">
      <a class="btn btn--cream" href="{wa_url(cierre["wa"])}" target="_blank" rel="noopener">{esc(cierre["boton"])}</a>
      <a class="btn btn--outline-cream" href="../../">Ver todo lo que hacemos</a>
    </div>
  </div>
</section>

<section class="icp-otras">
  <div class="wrap icp-narrow">
    <h2>¿Buscabas otra cosa?</h2>
    <p class="icp-otras__hub"><a href="../">Ver todos los casos</a></p>
    <ul class="icp-otras__list">
{otras_li}
    </ul>
  </div>
</section>

</main>

<footer class="foot">
  <div class="wrap foot__bar">
    <p>© 2026 ANAYA · Manta, Ecuador</p>
    <p>Cocina de casa, no fábrica</p>
  </div>
</footer>

<a class="fab" href="{wa_url(cierre["wa"])}" target="_blank" rel="noopener" aria-label="Escribir por WhatsApp">
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12.04 2A9.9 9.9 0 0 0 2.1 11.9c0 1.75.46 3.46 1.34 4.97L2 22l5.28-1.38a9.9 9.9 0 0 0 4.76 1.21h.01a9.9 9.9 0 0 0 9.94-9.9A9.9 9.9 0 0 0 12.04 2Zm5.8 14.06c-.25.69-1.45 1.32-2 1.36-.51.04-1.16.06-1.87-.12a16.9 16.9 0 0 1-1.7-.63c-2.99-1.29-4.94-4.3-5.09-4.5-.15-.2-1.22-1.62-1.22-3.1 0-1.47.77-2.2 1.05-2.5.27-.3.6-.37.8-.37h.57c.19 0 .43-.03.67.51.25.6.85 2.07.92 2.22.08.15.13.33.03.53-.1.2-.15.32-.3.5s-.31.39-.44.53c-.15.15-.3.31-.13.6.17.3.76 1.25 1.63 2.03 1.12 1 2.06 1.3 2.36 1.45.3.15.47.13.64-.08.17-.2.73-.85.93-1.15.2-.3.39-.25.66-.15.27.1 1.72.81 2.02.96.3.15.5.22.57.35.07.13.07.74-.18 1.43Z"/></svg>
</a>
</body>
</html>
'''


def main():
    datos = json.load(open('/tmp/icp-paginas.json', encoding='utf-8'))
    etiquetas = {d['slug']: d['pagina']['h1'] for d in datos}
    hechas = []
    for d in datos:
        slug, p = d['slug'], d['pagina']
        otras = [(s, n) for s, n in etiquetas.items() if s != slug]
        destino = RAIZ / 'para' / slug
        destino.mkdir(parents=True, exist_ok=True)
        (destino / 'index.html').write_text(pagina_html(slug, p, otras), encoding='utf-8')
        hechas.append(slug)
    print(f"{len(hechas)} páginas generadas:")
    for s in hechas:
        print("  /para/%s/" % s)


if __name__ == '__main__':
    main()
