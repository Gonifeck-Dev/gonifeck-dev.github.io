import {useState} from "react";
import type {ReactNode} from "react";
import "./Desktop.css";
import LightBeam from "../LightBeam/LightBeam.tsx";
import TaskBar from "../TaskBar/TaskBar.tsx";
import Button from "../Button/Button.tsx";
import AppWindow from "../AppWindow/AppWindow.tsx";
import type {MenuData, StatusData} from "../AppWindow/AppWindow.tsx";

// Contrato: la forma que debe tener cada app que se le entregue al escritorio.
// El catálogo (src/app/catalog.tsx) lo cumple; Desktop no conoce ninguna feature.
export type AppData = {
    id: string
    title: string
    menus?: MenuData[]
    status?: StatusData
    field?: boolean
    openAtStart?: boolean
    content: ReactNode
}

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

    function activate(id: string) {
        const topZ = Math.max(...windows.map(w => w.z))
        setWindows(windows.map(w =>
            w.id === id ? {...w, z: topZ + 1, minimized: false} : w
        ))
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

export default Desktop;
