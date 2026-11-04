import {useState} from "react";
import type {ReactNode} from "react";
import "./Desktop.css";
import LightBeam from "../LightBeam/LightBeam.tsx";
import TaskBar from "../TaskBar/TaskBar.tsx";
import Button from "../Button/Button.tsx";
import AppWindow from "../AppWindow/AppWindow.tsx";
import type {MenuData, StatusData} from "../AppWindow/AppWindow.tsx";
import AboutMe from "../AboutMe/AboutMe.tsx";

type AppData = {
    id: string
    title: string
    menus?: MenuData[]
    status?: StatusData
    content: ReactNode
}

type WindowState = {
    id: string
    z: number
    minimized: boolean
}


const apps: AppData[] = [
    {
        id: "about",
        title: "Símbolo de MS-DOS",
        menus: [
            {title: "Archivo", options: []},
            {title: "Editar", options: []},
            {title: "Ver", options: []},
            {title: "Ayuda", options: []},
        ],
        status: {text: "Listo · Disponible para trabajar", easterEggs: "Secretos: 0/5"},
        content: <AboutMe/>,
    },
]

function Desktop() {
    const [windows, setWindows] = useState<WindowState[]>([
        {id: "about", z: 1, minimized: false},
    ])
    const [activeId, setActiveId] = useState<string | null>("about")

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
                    const app = apps.find(a => a.id === w.id)
                    if (!app) return null
                    return (
                        <div key={w.id} className="desktop-window-slot" style={{zIndex: w.z}}
                             hidden={w.minimized}
                             onPointerDown={e => {
                                 e.stopPropagation()
                                 activate(w.id)
                             }}>
                            <AppWindow title={app.title} menus={app.menus} status={app.status}>
                                {app.content}
                            </AppWindow>
                        </div>
                    )
                })}
            </div>
            <TaskBar>
                {windows.map(w => (
                    <Button key={w.id} variant="normal"
                            label={apps.find(app => app.id === w.id)?.title}
                            pressed={w.id === activeId}
                            action={() => activate(w.id)}/>
                ))}
            </TaskBar>
        </div>
    )
}

export default Desktop;
