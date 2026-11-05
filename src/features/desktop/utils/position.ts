import {clamp} from "@/features/desktop/utils/clamp.ts"

/** Coordenadas en px. En una ventana, su esquina superior izquierda. */
export type WindowPosition = { x: number, y: number }
/** Ancho y alto en px. */
export type Size = { width: number, height: number }

/** Píxeles de la ventana que siempre quedan dentro del área, por los lados y abajo. */
export const WINDOW_MIN_VISIBLE = 80
/** Píxeles que se desplaza cada ventana nueva respecto de la que está en foco. */
export const NEW_WINDOW_DISPLACEMENT = 24

/**
 * Mantiene una ventana dentro del área, dejando siempre una parte visible.
 *
 * Por arriba no sale nunca, para que la barra de título siempre se pueda agarrar.
 * Por los lados y abajo puede salir hasta dejar {@link WINDOW_MIN_VISIBLE} px dentro.
 *
 * @param position - Posición que se quiere dar a la ventana (esquina superior izquierda).
 * @param size - Tamaño de la ventana.
 * @param area - Tamaño del escritorio.
 * @param minLeft - Píxeles visibles al salir por la izquierda.
 * @returns La posición corregida.
 */
export function clampPosition(position: WindowPosition, size: Size, area: Size, minLeft = WINDOW_MIN_VISIBLE): WindowPosition {
    const maxX = area.width - WINDOW_MIN_VISIBLE
    const minX = minLeft - size.width

    const maxY = area.height - WINDOW_MIN_VISIBLE
    const minY = 0

    return {
        x: clamp(position.x, minX, maxX),
        y: clamp(position.y, minY, maxY),
    }
}

/**
 * Calcula dónde aparece una ventana recién abierta.
 *
 * Con ventana en foco: en cascada, {@link NEW_WINDOW_DISPLACEMENT} px más abajo y a la derecha.
 * Sin ventana en foco: centrada en horizontal y a un cuarto de la altura.
 * Se redondea para no quedar en medio píxel y se ajusta con {@link clampPosition}.
 *
 * @param focused - Esquina superior izquierda de la ventana en foco, o null si no hay.
 * @param size - Tamaño de la ventana nueva.
 * @param area - Tamaño del escritorio.
 * @param minLeft - Píxeles visibles al salir por la izquierda (se pasa a {@link clampPosition}).
 * @returns La posición inicial de la ventana, ya dentro del área.
 */
export function nextPosition(focused: WindowPosition | null, size: Size, area: Size, minLeft = WINDOW_MIN_VISIBLE): WindowPosition {
    const positionX = focused ? focused.x + NEW_WINDOW_DISPLACEMENT : (area.width - size.width) / 2
    const positionY = focused ? focused.y + NEW_WINDOW_DISPLACEMENT : area.height / 4

    return clampPosition({x: Math.round(positionX), y: Math.round(positionY)}, size, area, minLeft)
}
