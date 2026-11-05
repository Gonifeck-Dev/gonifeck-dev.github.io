import {useCallback, useState} from "react"
import type {AppData} from "@/features/desktop/types/app.ts"
import type {WindowState} from "@/features/desktop/types/window.ts"
import type {WindowPosition} from "@/features/desktop/utils/position.ts"

/**
 * Estado de las ventanas abiertas y de cuál está activa. No mide el DOM: las posiciones
 * llegan calculadas desde useDesktopLayout.
 *
 * @param apps - Catálogo de apps. Al cargar se abren las que tienen `openAtStart`, en su orden.
 * @returns `windows` y `activeId` (null si ninguna está activa), y las acciones para cambiarlos.
 */
export function useWindows(apps: AppData[]) {
    const [windows, setWindows] = useState<WindowState[]>(() =>
        apps
            .filter(app => app.openAtStart)
            .map((app, index) => ({id: app.id, z: index + 1, minimized: false, position: null}))
    )
    const [activeId, setActiveId] = useState<string | null>(() =>
        apps.find(app => app.openAtStart)?.id ?? null
    )

    /** Trae la ventana al frente, la restaura si estaba minimizada y la marca activa. */
    function activate(id: string) {
        setWindows(previousWindows => {
            // El 0 evita -Infinity cuando no hay ventanas
            const highestZ = Math.max(0, ...previousWindows.map(windowState => windowState.z))
            return previousWindows.map(windowState =>
                windowState.id === id ? {...windowState, z: highestZ + 1, minimized: false} : windowState
            )
        })
        setActiveId(id)
    }

    /** Deja el escritorio sin ventana activa. */
    function deactivate() {
        setActiveId(null)
    }

    function setPosition(id: string, position: WindowPosition) {
        setWindows(previousWindows => previousWindows.map(windowState =>
            windowState.id === id ? {...windowState, position} : windowState
        ))
    }

    /**
     * Ubica las ventanas que aún no tienen posición, en orden de apertura.
     * Cada una recibe la posición de la anterior, para salir en cascada.
     */
    const placeNew = useCallback((calculatePosition: (id: string, previousPosition: WindowPosition | null) => WindowPosition) => {
        // useCallback: useDesktopLayout usa placeNew y keepInside como dependencias de sus efectos
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

    /**
     * Recalcula la posición de todas las ventanas ya ubicadas (p. ej. al cambiar el tamaño del área).
     * Si ninguna cambia, devuelve el mismo estado para no redibujar.
     */
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
