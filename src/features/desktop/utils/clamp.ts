/**
 * Limita un número a un rango entre min y max.
 *
 * Si value es menor que min, devuelve min.
 * Si value está entre min y max, devuelve value sin cambios.
 * Si value es mayor que max, devuelve max.
 * Si min es mayor que max, devuelve max.
 *
 * @param value - Número a limitar.
 * @param min - Límite inferior aceptado.
 * @param max - Límite superior aceptado.
 * @returns El número dentro del rango [min, max].
 */
export function clamp(value: number, min: number, max: number) {
    const atLeastMin = Math.max(value, min)
    return Math.min(atLeastMin, max)
}
