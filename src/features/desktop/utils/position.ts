// Cálculos de posición de las ventanas. Funciones puras: no usan React ni el DOM,
// así se pueden probar solas (Vitest) y la regla del marco vive en un solo lugar.

export type Point = {x: number, y: number}
export type Size = {width: number, height: number}

// Cuánto de la ventana debe quedar siempre dentro del área (por los lados y abajo)
export const MIN_VISIBLE = 80
// Desplazamiento de la cascada: cada ventana nueva aparece un poco más abajo y a la derecha
export const CASCADE_STEP = 24

// Marco invisible: la ventana puede salir casi entera por los lados y por abajo,
// pero quedan MIN_VISIBLE px dentro. Por arriba, la barra de título nunca cruza el borde
// (si no, ya no se podría agarrar para traerla de vuelta).
// minLeft: lo que queda visible al salir por la izquierda. Desktop pasa el ancho de _ □ X + MIN_VISIBLE,
// porque por ese lado lo que se ve es la parte derecha de la ventana, donde están los botones.
// Cada eje se limita por separado: si X topa el borde, Y sigue libre (y al revés).
export function clampPosition(position: Point, size: Size, area: Size, minLeft = MIN_VISIBLE): Point {
    return {
        x: Math.min(Math.max(position.x, minLeft - size.width), area.width - MIN_VISIBLE),
        y: Math.min(Math.max(position.y, 0), area.height - MIN_VISIBLE),
    }
}

// Dónde aparece una ventana al crearse: en cascada desde la ventana en foco,
// o centrada (a un cuarto de la altura) si no hay ninguna en foco.
export function nextPosition(focused: Point | null, size: Size, area: Size, minLeft = MIN_VISIBLE): Point {
    const position = focused
        ? {x: focused.x + CASCADE_STEP, y: focused.y + CASCADE_STEP}
        : {x: (area.width - size.width) / 2, y: area.height / 4}
    return clampPosition({x: Math.round(position.x), y: Math.round(position.y)}, size, area, minLeft)
}
