import type {ReactNode} from "react"
import type {MenuData, StatusData} from "@/components/AppWindow/AppWindow.tsx"

// Contrato: la forma que debe cumplir cada app del catálogo (src/app/catalog.tsx).
// El escritorio solo conoce este tipo; no conoce ninguna feature concreta.
export type AppData = {
    id: string
    title: string
    menus?: MenuData[]
    status?: StatusData
    field?: boolean
    openAtStart?: boolean
    content: ReactNode
}
