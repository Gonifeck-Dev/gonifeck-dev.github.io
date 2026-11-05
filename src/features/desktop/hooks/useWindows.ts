import {useCallback, useState} from "react"
import type {AppData} from "@/features/desktop/types/app.ts"
import type {WindowState} from "@/features/desktop/types/window.ts"
import type {WindowPosition} from "@/features/desktop/utils/position.ts"

// ESTADO de las ventanas: cuáles están abiertas, su orden (z), si están minimizadas,
// su posición y cuál está activa. No toca el DOM: las posiciones las calcula quien llama
// (useDesktopLayout) y aquí solo se guardan. Así estas reglas se pueden probar solas.
export function useWindows(apps: AppData[]) {
    // Al cargar se abren las apps marcadas con openAtStart, en el orden del catálogo
    const [windows, setWindows] = useState<WindowState[]>(() =>
        apps
            .filter(app => app.openAtStart)
            .map((app, index) => ({id: app.id, z: index + 1, minimized: false, position: null}))
    )
    const [activeId, setActiveId] = useState<string | null>(() =>
        apps.find(app => app.openAtStart)?.id ?? null
    )

    // Trae la ventana adelante, la desminimiza y la marca activa.
    // setWindows(previous => …): calcula sobre el estado más reciente, aunque lleguen varios clics seguidos.
    // Math.max(0, …): si no hubiera ventanas, el resultado sería -Infinity.
    function activate(id: string) {
        setWindows(previousWindows => {
            const highestZ = Math.max(0, ...previousWindows.map(windowState => windowState.z))
            return previousWindows.map(windowState =>
                windowState.id === id ? {...windowState, z: highestZ + 1, minimized: false} : windowState
            )
        })
        setActiveId(id)
    }

    // Clic en el escritorio vacío: ninguna ventana activa
    function deactivate() {
        setActiveId(null)
    }

    function setPosition(id: string, position: WindowPosition) {
        setWindows(previousWindows => previousWindows.map(windowState =>
            windowState.id === id ? {...windowState, position} : windowState
        ))
    }

    // Ubica las ventanas que aún no tienen posición, en orden: cada una recibe la posición
    // de la anterior como previousPosition (así salen en cascada). calculatePosition decide dónde va.
    // useCallback: la función es la misma en cada render, así los efectos de useDesktopLayout
    // que la usan no se vuelven a ejecutar sin necesidad (solo depende de setWindows, que es estable).
    const placeNew = useCallback((calculatePosition: (id: string, previousPosition: WindowPosition | null) => WindowPosition) => {
        setWindows(previousWindows => {
            let previousPosition: WindowPosition | null = null
            return previousWindows.map(windowState => {
                if (windowState.position) {
                    previousPosition = windowState.position
                    return windowState
                }
                const position = calculatePosition(windowState.id, previousPosition)
                previousPosition = position
                return {...windowState, position}
            })
        })
    }, [])

    // Recalcula la posición de todas (p. ej. al cambiar el tamaño del área).
    // Si ninguna cambia, devuelve el mismo estado y React no vuelve a dibujar.
    const keepInside = useCallback((calculatePosition: (id: string, position: WindowPosition) => WindowPosition) => {
        setWindows(previousWindows => {
            let anyMoved = false
            const updatedWindows = previousWindows.map(windowState => {
                if (!windowState.position) return windowState
                const newPosition = calculatePosition(windowState.id, windowState.position)
                const isSamePosition = newPosition.x === windowState.position.x && newPosition.y === windowState.position.y
                if (isSamePosition) return windowState
                anyMoved = true
                return {...windowState, position: newPosition}
            })
            return anyMoved ? updatedWindows : previousWindows
        })
    }, [])

    return {windows, activeId, activate, deactivate, setPosition, placeNew, keepInside}
}
