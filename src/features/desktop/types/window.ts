import type {WindowPosition} from "@/features/desktop/utils/position.ts"

// Estado de una ventana abierta en el escritorio
export type WindowState = {
    id: string
    z: number
    minimized: boolean
    position: WindowPosition | null // null = todavía no se ubica (falta medir su tamaño)
}
