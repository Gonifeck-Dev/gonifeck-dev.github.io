# Proyecto portafolio - Gonifeck-Dev

La finalidad de este portafolio es aprender y demostrar los conocimientos que he adquirido, tanto en mis estudios universitarios como de manera independiente, y, con ello, darle expresividad y personalidad: algo que muestre lo que soy.

## Inspiraciones

Siempre tuve gran admiración por el trabajo de TanyaHastur en la página del animador y artista JoelG, que tiene marcos con relieve, interacciones, easter eggs y una gran inspiración en lo que fueron las páginas web de los 2000. Junto con ello, me lleva a tomar este camino el cariño por la estética de Windows 98 y el género "webcore".

Al tener conocimientos de After Effects, Photoshop y de flujos y ecosistemas orientados a artistas, decidí apostar por un estilo 2.5D con parallax que sea tanto llamativo como compatible con la visión de Windows 98, pero teniendo en cuenta el rendimiento en dispositivos de pocos recursos.

## Decisiones tomadas

- **React**: por la necesidad de administrar múltiples ventanas con JavaScript. En proyectos anteriores fue un caos mantener el orden y darle mantención al código sin un framework.
- **Vite**: arma el sitio como archivos estáticos que GitHub Pages puede publicar y, mientras programo, recarga la página cada vez que guardo.
- **TypeScript**: mi familiaridad con Java, la necesidad de mejorar mis conocimientos de JavaScript y los beneficios que aporta a la hora de corregir mi código; todo ello me ha llevado a elegir TypeScript.
- **Tailwind 4 + CSS propio**: Tailwind es un estándar en empresas, el cual me será útil dominar; por otro lado, el CSS propio será necesario para lograr la estética visual de Windows 98.
- **ESLint**: el revisor de código más usado.

## Comandos del proyecto

| Comando | Qué hace |
|---|---|
| `npm install` | Descarga las dependencias |
| `npm run dev` | Abre la página en http://localhost:5173 y la recarga cada vez que guardas |
| `npm run build` | Revisa los tipos y genera el sitio final en `dist/` |
| `npm run lint` | Revisa el código con ESLint |
| `npm run preview` | Muestra en tu equipo el sitio final generado |
