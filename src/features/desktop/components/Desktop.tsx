import {useState} from "react"
import "./Desktop.css"
import LightBeam from "./LightBeam.tsx"
import Button from "@/components/Button/Button.tsx"
import AppWindow from "@/components/AppWindow/AppWindow.tsx"
import TaskBar from "./TaskBar.tsx"
import type {AppData} from "@/features/desktop/types/app.ts"

type WindowState = {
    id: string
    z: number
    minimized: boolean
}

type DesktopProps = {
    apps: AppData[]
}

function Desktop({apps}: DesktopProps) {
    // Al cargar se abren las apps marcadas con openAtStart, en el orden del catálogo
    const [windows, setWindows] = useState<WindowState[]>(() =>
        apps
            .filter(app => app.openAtStart)
            .map((app, i) => ({id: app.id, z: i + 1, minimized: false}))
    )
    const [activeId, setActiveId] = useState<string | null>(() =>
        apps.find(app => app.openAtStart)?.id ?? null
    )

    function getApp(id: string) {
        return apps.find(app => app.id === id)
    }

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

    return (
        <div className="desktop" onPointerDown={() => setActiveId(null)}>
            <div className="desktop-wall" aria-hidden="true"/>
            <LightBeam/>
            <div className="desktop-windows">
                {windows.map(w => {
                    const app = getApp(w.id)
                    if (!app) return null
                    return (
                        <div key={w.id} className="desktop-window-slot" style={{zIndex: w.z}}
                             hidden={w.minimized}
                             onPointerDown={e => {
                                 e.stopPropagation()
                                 activate(w.id)
                             }}>
                            <AppWindow title={app.title} menus={app.menus} status={app.status} field={app.field}>
                                {app.content}
                            </AppWindow>
                        </div>
                    )
                })}
            </div>
            <TaskBar>
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
