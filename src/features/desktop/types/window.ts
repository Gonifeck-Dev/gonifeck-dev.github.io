/** Coordenadas en px. En una ventana, su esquina superior izquierda. */
export type WindowPosition = { x: number, y: number }
/** Ancho y alto en px. */
export type Size = { width: number, height: number }

/** Una ventana abierta en el escritorio. */
export type WindowState = {
    /** Id de la app que muestra (ver AppData). */
    id: string
    /** Orden de apilado: la de mayor valor queda encima. */
    z: number
    minimized: boolean
    /** Esquina superior izquierda; null hasta que se mide y se ubica. */
    position: WindowPosition | null
}
