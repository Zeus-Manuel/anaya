#!/usr/bin/env python3
"""Sella los assets con un hash de contenido: styles.css?v=<hash>

Por qué: GitHub Pages sirve todo con cache-control: max-age=600, y el HTML
y el CSS se cachean por separado. Después de un despliegue, quien ya había
visitado el sitio puede recibir el HTML nuevo con el CSS viejo todavía en
caché — y la página se rompe hasta que expire. Con el hash en la URL, el
HTML nuevo apunta a una URL nueva y el navegador está obligado a bajarla.

Se ejecuta al final del build, después de build-icp.py.
"""
import hashlib, pathlib, re

RAIZ = pathlib.Path(__file__).parent
ASSETS = ["assets/styles.css", "assets/icp.css", "assets/nav.js", "assets/app.js"]


def hash_corto():
    h = hashlib.sha256()
    for a in ASSETS:
        p = RAIZ / a
        if p.exists():
            h.update(p.read_bytes())
    return h.hexdigest()[:8]


def sellar(v):
    htmls = [RAIZ / "index.html", RAIZ / "para" / "index.html"]
    htmls += list((RAIZ / "para").glob("*/index.html"))
    tocados = 0
    for f in htmls:
        if not f.exists():
            continue
        s = f.read_text(encoding="utf-8")
        # quita cualquier ?v= previo y vuelve a sellar
        s = re.sub(r'((?:assets/)?(?:styles|icp)\.css|(?:assets/)?(?:nav|app)\.js)(\?v=[0-9a-f]+)?"',
                   lambda m: f'{m.group(1)}?v={v}"', s)
        f.write_text(s, encoding="utf-8")
        tocados += 1
    return tocados


if __name__ == "__main__":
    v = hash_corto()
    n = sellar(v)
    print(f"sellado v={v} en {n} archivos HTML")
