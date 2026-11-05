import {WINDOW_MIN_VISIBLE} from "@/features/desktop/utils/position.ts"
import type {Size} from "@/features/desktop/types/window.ts"

/**
 * Mide el área de trabajo: el ancho de la capa y su alto hasta donde empieza la barra de tareas.
 *
 * @param layer - Capa donde viven las ventanas.
 * @param taskBar - Barra de tareas, o null si no hay.
 * @returns Ancho y alto en px.
 */
export function measureArea(layer: HTMLElement, taskBar: HTMLElement | null): Size {
    const layerRect = layer.getBoundingClientRect()
    const areaBottom = taskBar?.getBoundingClientRect().top ?? layerRect.bottom
    return {width: layerRect.width, height: areaBottom - layerRect.top}
}

/** Ancho y alto en px de un elemento, tal como se dibuja. */
export function measureSize(element: HTMLElement): Size {
    return {width: element.offsetWidth, height: element.offsetHeight}
}

/** Píxeles de una ventana que deben quedar visibles por la izquierda: sus botones _ □ X más {@link WINDOW_MIN_VISIBLE}. */
export function measureMinVisibleLeft(windowNode: HTMLElement): number {
    const controls = windowNode.querySelector<HTMLElement>(".window-controls")
    return (controls?.offsetWidth ?? 0) + WINDOW_MIN_VISIBLE
}
