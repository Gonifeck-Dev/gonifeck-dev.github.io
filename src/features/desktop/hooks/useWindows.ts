import {useCallback, useState} from "react"
import type {AppData} from "@/features/desktop/types/app.ts"
import type {WindowState} from "@/features/desktop/types/window.ts"
import type {Point} from "@/features/desktop/utils/position.ts"

// ESTADO de las ventanas: cuáles están abiertas, su orden (z), si están minimizadas,
// su posición y cuál está activa. No toca el DOM: las posiciones las calcula quien llama
// (useDesktopLayout) y aquí solo se guardan. Así estas reglas se pueden probar solas.
export function useWindows(apps: AppData[]) {
    // Al cargar se abren las apps marcadas con openAtStart, en el orden del catálogo
    const [windows, setWindows] = useState<WindowState[]>(() =>
        apps
            .filter(app => app.openAtStart)
            .map((app, i) => ({id: app.id, z: i + 1, minimized: false, position: null}))
    )
    const [activeId, setActiveId] = useState<string | null>(() =>
        apps.find(app => app.openAtStart)?.id ?? null
    )

    // Trae la ventana adelante, la desminimiza y la marca activa.
    // setWindows(prev => …): calcula sobre el estado más reciente, aunque lleguen varios clics seguidos.
    // Math.max(0, …): si no hubiera ventanas, el resultado sería -Infinity.
    function activate(id: string) {
        setWindows(prev => {
            const topZ = Math.max(0, ...prev.map(w => w.z))
            return prev.map(w =>
                w.id === id ? {...w, z: topZ + 1, minimized: false} : w
            )
        })
        setActiveId(id)
    }

    // Clic en el escritorio vacío: ninguna ventana activa
    function deactivate() {
        setActiveId(null)
    }

    function setPosition(id: string, position: Point) {
        setWindows(prev => prev.map(w => w.id === id ? {...w, position} : w))
    }

    // Ubica las ventanas que aún no tienen posición, en orden: cada una recibe la posición
    // de la anterior como "en foco" (así salen en cascada). calculate decide dónde va.
    // useCallback: la función es la misma en cada render, así los efectos de useDesktopLayout
    // que la usan no se vuelven a ejecutar sin necesidad (solo depende de setWindows, que es estable).
    const placeNew = useCallback((calculate: (id: string, focused: Point | null) => Point) => {
        setWindows(prev => {
            let focused: Point | null = null
            return prev.map(w => {
                if (w.position) {
                    focused = w.position
                    return w
                }
                const position = calculate(w.id, focused)
                focused = position
                return {...w, position}
            })
        })
    }, [])

    // Recalcula la posición de todas (p. ej. al cambiar el tamaño del área).
    // Si ninguna cambia, devuelve el mismo estado y React no vuelve a dibujar.
    const keepInside = useCallback((calculate: (id: string, position: Point) => Point) => {
        setWindows(prev => {
            let moved = false
            const next = prev.map(w => {
                if (!w.position) return w
                const position = calculate(w.id, w.position)
                if (position.x === w.position.x && position.y === w.position.y) return w
                moved = true
                return {...w, position}
            })
            return moved ? next : prev
        })
    }, [])

    return {windows, activeId, activate, deactivate, setPosition, placeNew, keepInside}
}
