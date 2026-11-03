import {useState} from "react";
import type {ReactNode} from "react";
import "./Desktop.css";
import LightBeam from "./LightBeam.tsx";
import TaskBar from "./TaskBar.tsx";
import Button from "./Button.tsx";
import AboutMe from "./AboutMe.tsx";

type AppData = {
    id: string
    title: string
    content: ReactNode
}

type WindowState = {
    id: string
    z: number
    minimized: boolean
}

// Catálogo: lo fijo de cada app. Agregar una app = agregar una línea.
const apps: AppData[] = [
    {id: "about", title: "Símbolo de MS-DOS", content: <AboutMe/>},
]

function Desktop() {
    // Lo que cambia: ventanas abiertas, su orden (z) y si están minimizadas
    const [windows, setWindows] = useState<WindowState[]>([
        {id: "about", z: 1, minimized: false},
    ])
    const [activeId, setActiveId] = useState<string | null>("about")

    // Trae la ventana adelante, la desminimiza y la marca activa
    function activate(id: string) {
        const topZ = Math.max(...windows.map(w => w.z))
        setWindows(windows.map(w =>
            w.id === id ? {...w, z: topZ + 1, minimized: false} : w
        ))
        setActiveId(id)
    }

    return (
        // Clic en el escritorio vacío: ninguna ventana activa
        <div className="desktop" onPointerDown={() => setActiveId(null)}>
            <div className="desktop-wall" aria-hidden="true"/>
            <LightBeam/>
            <div className="desktop-windows">
                {windows.map(w => (
                    <div key={w.id} className="desktop-window-slot" style={{zIndex: w.z}}
                         hidden={w.minimized}
                         onPointerDown={e => {
                             e.stopPropagation()
                             activate(w.id)
                         }}>
                        {apps.find(app => app.id === w.id)?.content}
                    </div>
                ))}
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
