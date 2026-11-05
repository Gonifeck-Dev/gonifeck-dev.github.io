import type {ReactNode} from "react"
import type {MenuData, StatusData} from "@/components/app-window/app-window.tsx"

/** Una app que el escritorio puede abrir como ventana. Se declaran en src/app/catalog.tsx. */
export type AppData = {
    /** Identificador único; también identifica su ventana. */
    id: string
    /** Texto de la barra de título y del botón de tarea. */
    title: string
    /** Barra de menús de la ventana. */
    menus?: MenuData[]
    /** Barra de estado al pie de la ventana. */
    status?: StatusData
    /** Muestra el contenido en un campo hundido y oscuro. */
    field?: boolean
    /** Se abre al cargar la página. La primera con este valor queda activa. */
    openAtStart?: boolean
    /** Contenido de la ventana. */
    content: ReactNode
}
