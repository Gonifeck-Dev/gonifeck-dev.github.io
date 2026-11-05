import {useEffect, useLayoutEffect, useRef} from "react"
import type {WindowState} from "@/features/desktop/types/window.ts"
import {clampPosition, WINDOW_MIN_VISIBLE, nextPosition} from "@/features/desktop/utils/position.ts"
import type {WindowPosition, Size} from "@/features/desktop/utils/position.ts"
import {measureArea, measureMinVisibleLeft, measureSize} from "@/features/desktop/utils/measure.ts"

type WindowActions = {
    setPosition: (id: string, position: WindowPosition) => void
    placeNew: (calculatePosition: (id: string, previousPosition: WindowPosition | null) => WindowPosition) => void
    keepInside: (calculatePosition: (id: string, position: WindowPosition) => WindowPosition) => void
}

/**
 * Conecta el estado de las ventanas con el DOM: mide el área y cada ventana, ubica las
 * ventanas nuevas, devuelve al área las que quedan fuera y limita el arrastre.
 * Las reglas de posición están en utils/position.ts.
 *
 * @param windows - Ventanas abiertas (de useWindows).
 * @param actions - `setPosition`, `placeNew` y `keepInside` de useWindows.
 * @returns Refs para conectar en Desktop (capa, barra de tareas, cada ventana y su marco)
 *   y los manejadores del arrastre (`startDrag`, `drag`).
 */
export function useWindowPlacement(windows: WindowState[], {setPosition, placeNew, keepInside}: WindowActions) {
    const layerRef = useRef<HTMLDivElement>(null)
    const taskBarRef = useRef<HTMLDivElement>(null)
    const windowRefs = useRef(new Map<string, HTMLDivElement>())
    const boundsRefs = useRef(new Map<string, HTMLDivElement>())

    function getArea(): Size {
        const layer = layerRef.current
        return layer ? measureArea(layer, taskBarRef.current) : {width: 0, height: 0}
    }

    function getSize(id: string): Size {
        const windowNode = windowRefs.current.get(id)
        return windowNode ? measureSize(windowNode) : {width: 0, height: 0}
    }

    function getMinLeft(id: string): number {
        const windowNode = windowRefs.current.get(id)
        return windowNode ? measureMinVisibleLeft(windowNode) : WINDOW_MIN_VISIBLE
    }

    // Refs por ID: guardan el nodo al montarse y lo borran al desmontarse
    function windowRef(id: string) {
        return (node: HTMLDivElement | null) => {
            if (node) windowRefs.current.set(id, node)
            else windowRefs.current.delete(id)
        }
    }

    function boundsRef(id: string) {
        return (node: HTMLDivElement | null) => {
            if (node) boundsRefs.current.set(id, node)
            else boundsRefs.current.delete(id)
        }
    }

    // Ubica las ventanas nuevas después de dibujarlas (recién ahí se conoce su tamaño)
    // y antes de que el navegador pinte, para que no se vean saltar
    useLayoutEffect(() => {
        const allWindowsPlaced = windows.every(windowState => windowState.position !== null)
        if (allWindowsPlaced) return
        const area = getArea()
        placeNew((id, previousPosition) => nextPosition(previousPosition, getSize(id), area, getMinLeft(id)))
    }, [windows, placeNew])

    // Si la capa de ventanas cambia de tamaño, devuelve al área las ventanas que quedaron fuera
    useEffect(() => {
        const layer = layerRef.current
        if (!layer) return
        const observer = new ResizeObserver(() => {
            const area = getArea()
            keepInside((id, position) => clampPosition(position, getSize(id), area, getMinLeft(id)))
        })
        observer.observe(layer)
        return () => observer.disconnect()
    }, [keepInside])

    // Ajusta el marco invisible de la ventana: la caja donde debe caber entera para cumplir
    // las reglas de clampPosition. react-rnd lo usa como límite durante el arrastre.
    function startDrag(id: string) {
        const boundsBox = boundsRefs.current.get(id)
        if (!boundsBox) return
        const area = getArea()
        const {width, height} = getSize(id)
        const boxLeft = getMinLeft(id) - width
        boundsBox.style.left = `${boxLeft}px`
        boundsBox.style.top = "0px"
        boundsBox.style.width = `${area.width - WINDOW_MIN_VISIBLE + width - boxLeft}px`
        boundsBox.style.height = `${area.height - WINDOW_MIN_VISIBLE + height}px`
    }

    function drag(id: string, position: WindowPosition) {
        setPosition(id, clampPosition(position, getSize(id), getArea(), getMinLeft(id)))
    }

    return {layerRef, taskBarRef, windowRef, boundsRef, startDrag, drag}
}
