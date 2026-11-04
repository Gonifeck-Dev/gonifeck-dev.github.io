import {Fragment, useEffect, useLayoutEffect, useRef, useState} from "react"
import {Rnd} from "react-rnd"
import "./Desktop.css"
import LightBeam from "./LightBeam.tsx"
import Button from "@/components/Button/Button.tsx"
import AppWindow from "@/components/AppWindow/AppWindow.tsx"
import TaskBar from "./TaskBar.tsx"
import type {AppData} from "@/features/desktop/types/app.ts"
import {clampPosition, MIN_VISIBLE, nextPosition} from "@/features/desktop/utils/position.ts"
import type {Point, Size} from "@/features/desktop/utils/position.ts"

type WindowState = {
    id: string
    z: number
    minimized: boolean
    position: Point | null // null = todavía no se ubica (falta medir su tamaño)
}

type DesktopProps = {
    apps: AppData[]
}

function Desktop({apps}: DesktopProps) {
    // Al cargar se abren las apps marcadas con openAtStart, en el orden del catálogo
    const [windows, setWindows] = useState<WindowState[]>(() =>
        apps
            .filter(app => app.openAtStart)
            .map((app, i) => ({id: app.id, z: i + 1, minimized: false, position: null}))
    )
    const [activeId, setActiveId] = useState<string | null>(() =>
        apps.find(app => app.openAtStart)?.id ?? null
    )

    // Referencias al DOM para medir: la capa de ventanas, la barra de tareas y cada ventana
    const layerRef = useRef<HTMLDivElement>(null)
    const taskBarRef = useRef<HTMLDivElement>(null)
    const windowRefs = useRef(new Map<string, HTMLDivElement>())
    // Un marco invisible por ventana: react-rnd lo usa como límite al arrastrar
    const boundsRefs = useRef(new Map<string, HTMLDivElement>())

    function getApp(id: string) {
        return apps.find(app => app.id === id)
    }

    // Área de trabajo: la capa de ventanas, desde arriba hasta donde empieza la barra de tareas
    function getArea(): Size {
        const layer = layerRef.current?.getBoundingClientRect()
        const taskBar = taskBarRef.current?.getBoundingClientRect()
        if (!layer) return {width: 0, height: 0}
        return {width: layer.width, height: (taskBar?.top ?? layer.bottom) - layer.top}
    }

    function getSize(id: string): Size {
        const node = windowRefs.current.get(id)
        return {width: node?.offsetWidth ?? 0, height: node?.offsetHeight ?? 0}
    }

    // Mínimo visible por la izquierda: los botones _ □ X completos + una base para agarrar
    function getMinLeft(id: string): number {
        const controls = windowRefs.current.get(id)?.querySelector<HTMLElement>(".window-controls")
        return (controls?.offsetWidth ?? 0) + MIN_VISIBLE
    }

    // Ubica las ventanas nuevas después de dibujarlas (recién ahí se conoce su tamaño)
    // y antes de que el navegador pinte, así no se ven saltar.
    useLayoutEffect(() => {
        if (windows.every(w => w.position !== null)) return
        const area = getArea()
        // Medir el DOM y luego actualizar el estado es el uso documentado de useLayoutEffect
        // (react.dev → useLayoutEffect → "Measuring layout before the browser repaints the screen").
        // Corre una sola vez por ventana nueva: después todas tienen posición y sale en la línea de arriba.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setWindows(prev => {
            let focused: Point | null = null
            return prev.map(w => {
                if (w.position) {
                    focused = w.position
                    return w
                }
                const position = nextPosition(focused, getSize(w.id), area, getMinLeft(w.id))
                focused = position
                return {...w, position}
            })
        })
    }, [windows])

    // Si cambia el tamaño del área (navegador, marco del CRT, barra de tareas), las ventanas que
    // quedaron fuera del marco se empujan hacia adentro. Las que ya estaban dentro no se mueven.
    // ResizeObserver avisa como mucho una vez por cuadro y solo cuando el tamaño cambia de verdad;
    // si ninguna ventana se mueve, se devuelve el mismo estado y React no vuelve a dibujar.
    useEffect(() => {
        const layer = layerRef.current
        if (!layer) return
        const observer = new ResizeObserver(() => {
            const area = getArea()
            setWindows(prev => {
                let moved = false
                const next = prev.map(w => {
                    if (!w.position) return w
                    const position = clampPosition(w.position, getSize(w.id), area, getMinLeft(w.id))
                    if (position.x === w.position.x && position.y === w.position.y) return w
                    moved = true
                    return {...w, position}
                })
                return moved ? next : prev
            })
        })
        observer.observe(layer)
        return () => observer.disconnect() // al desmontar Desktop se deja de observar
    }, [])

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

    // Al empezar a arrastrar se dimensiona el marco invisible de esa ventana: es la caja donde
    // la ventana entera debe caber para cumplir la regla (izquierda: _ □ X + base; arriba: 0;
    // derecha y abajo: MIN_VISIBLE). react-rnd lo mide justo después y limita el arrastre por
    // su cuenta, eje por eje y sin saltos: al volver de un borde, la ventana espera al puntero.
    function startDrag(id: string) {
        const box = boundsRefs.current.get(id)
        if (!box) return
        const area = getArea()
        const size = getSize(id)
        const left = getMinLeft(id) - size.width
        box.style.left = `${left}px`
        box.style.top = "0px"
        box.style.width = `${area.width - MIN_VISIBLE + size.width - left}px`
        box.style.height = `${area.height - MIN_VISIBLE + size.height}px`
    }

    // Guarda la posición; clampPosition es una red de seguridad (react-rnd ya respeta el marco)
    function drag(id: string, position: Point) {
        const clamped = clampPosition(position, getSize(id), getArea(), getMinLeft(id))
        setWindows(prev => prev.map(w => w.id === id ? {...w, position: clamped} : w))
    }

    return (
        <div className="desktop" onPointerDown={() => setActiveId(null)}>
            <div className="desktop-wall" aria-hidden="true"/>
            <LightBeam/>
            <div className="desktop-windows" ref={layerRef}>
                {windows.map(w => {
                    const app = getApp(w.id)
                    if (!app) return null
                    return (
                        <Fragment key={w.id}>
                        <div className="desktop-window-bounds" id={`bounds-${w.id}`} aria-hidden="true"
                             ref={node => {
                                 if (node) boundsRefs.current.set(w.id, node)
                                 else boundsRefs.current.delete(w.id)
                             }}/>
                        <Rnd position={w.position ?? {x: 0, y: 0}}
                             bounds={`#bounds-${w.id}`}
                             onDragStart={() => startDrag(w.id)}
                             onDrag={(_e, d) => drag(w.id, {x: d.x, y: d.y})}
                             dragHandleClassName="window-title-bar"
                             cancel=".window-controls"
                             enableResizing={false}
                             style={{
                                 zIndex: w.z,
                                 display: w.minimized ? "none" : undefined,
                                 visibility: w.position ? undefined : "hidden",
                             }}>
                            <div ref={node => {
                                if (node) windowRefs.current.set(w.id, node)
                                else windowRefs.current.delete(w.id)
                            }}
                                 onPointerDown={e => {
                                     e.stopPropagation()
                                     activate(w.id)
                                 }}>
                                <AppWindow title={app.title} menus={app.menus} status={app.status} field={app.field}>
                                    {app.content}
                                </AppWindow>
                            </div>
                        </Rnd>
                        </Fragment>
                    )
                })}
            </div>
            <TaskBar ref={taskBarRef}>
                {windows.map(w => (
                    <Button key={w.id} variant="normal"
                            label={getApp(w.id)?.title}
                            pressed={w.id === activeId}
                            action={() => activate(w.id)}/>
                ))}
            </TaskBar>
        </div>
    )
}

export default Desktop
