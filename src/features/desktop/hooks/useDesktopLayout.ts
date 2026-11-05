import {useEffect, useLayoutEffect, useRef} from "react"
import type {WindowState} from "@/features/desktop/types/window.ts"
import {clampPosition, WINDOW_MIN_VISIBLE, nextPosition} from "@/features/desktop/utils/position.ts"
import type {WindowPosition, Size} from "@/features/desktop/utils/position.ts"

// Lo que este hook necesita de useWindows (solo las acciones que usa)
type WindowActions = {
    setPosition: (id: string, position: WindowPosition) => void
    placeNew: (calculate: (id: string, previousPosition: WindowPosition | null) => WindowPosition) => void
    keepInside: (calculate: (id: string, position: WindowPosition) => WindowPosition) => void
}

// DOM del escritorio: guarda las referencias a los elementos, mide el área y las ventanas,
// ubica las ventanas nuevas, las empuja al cambiar el tamaño y prepara el marco del arrastre.
// Las reglas (dónde puede estar una ventana) están en utils/position.ts; aquí solo se mide.
export function useDesktopLayout(windows: WindowState[], {setPosition, placeNew, keepInside}: WindowActions) {
    // Referencias al DOM: la capa de ventanas, la barra de tareas, cada ventana y su marco invisible
    const layerRef = useRef<HTMLDivElement>(null)
    const taskBarRef = useRef<HTMLDivElement>(null)
    const windowRefs = useRef(new Map<string, HTMLDivElement>())
    const boundsRefs = useRef(new Map<string, HTMLDivElement>())

    // Área de trabajo: la capa de ventanas, desde arriba hasta donde empieza la barra de tareas
    function getArea(): Size {
        const layerRect = layerRef.current?.getBoundingClientRect()
        const taskBarRect = taskBarRef.current?.getBoundingClientRect()
        if (!layerRect) return {width: 0, height: 0}
        const areaBottom = taskBarRect?.top ?? layerRect.bottom
        return {width: layerRect.width, height: areaBottom - layerRect.top}
    }

    function getSize(id: string): Size {
        const windowNode = windowRefs.current.get(id)
        return {width: windowNode?.offsetWidth ?? 0, height: windowNode?.offsetHeight ?? 0}
    }

    // Mínimo visible por la izquierda: los botones _ □ X completos + una base para agarrar
    function getMinLeft(id: string): number {
        const controls = windowRefs.current.get(id)?.querySelector<HTMLElement>(".window-controls")
        return (controls?.offsetWidth ?? 0) + WINDOW_MIN_VISIBLE
    }

    // Callback refs: React llama con el elemento al aparecer y con null al desaparecer
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
    // y antes de que el navegador pinte, así no se ven saltar.
    // Medir el DOM y luego actualizar el estado es el uso documentado de useLayoutEffect
    // (react.dev → useLayoutEffect → "Measuring layout before the browser repaints the screen").
    useLayoutEffect(() => {
        const allWindowsPlaced = windows.every(w => w.position !== null)
        if (allWindowsPlaced) return
        const area = getArea()
        placeNew((id, previousPosition) => nextPosition(previousPosition, getSize(id), area, getMinLeft(id)))
    }, [windows, placeNew])

    // Si cambia el tamaño del área (navegador, marco del CRT, barra de tareas), las ventanas que
    // quedaron fuera del marco se empujan hacia adentro. Las que ya estaban dentro no se mueven.
    // ResizeObserver avisa como mucho una vez por cuadro y solo cuando el tamaño cambia de verdad.
    useEffect(() => {
        const layer = layerRef.current
        if (!layer) return
        const observer = new ResizeObserver(() => {
            const area = getArea()
            keepInside((id, position) => clampPosition(position, getSize(id), area, getMinLeft(id)))
        })
        observer.observe(layer)
        return () => observer.disconnect() // al desmontar el escritorio se deja de observar
    }, [keepInside])

    // Al empezar a arrastrar se dimensiona el marco invisible de esa ventana: es la caja donde
    // la ventana entera debe caber para cumplir la regla (izquierda: _ □ X + base; arriba: 0;
    // derecha y abajo: WINDOW_MIN_VISIBLE). react-rnd lo mide justo después y limita el arrastre por
    // su cuenta, eje por eje y sin saltos: al volver de un borde, la ventana espera al puntero.
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

    // Guarda la posición; clampPosition es una red de seguridad (react-rnd ya respeta el marco)
    function drag(id: string, position: WindowPosition) {
        setPosition(id, clampPosition(position, getSize(id), getArea(), getMinLeft(id)))
    }

    return {layerRef, taskBarRef, windowRef, boundsRef, startDrag, drag}
}
