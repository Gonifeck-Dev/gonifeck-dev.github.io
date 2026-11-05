import type {WindowPosition} from "@/features/desktop/utils/position.ts"

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
