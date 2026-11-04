import {Fragment} from "react"
import {Rnd} from "react-rnd"
import "./Desktop.css"
import LightBeam from "./LightBeam.tsx"
import TaskBar from "./TaskBar.tsx"
import Button from "@/components/Button/Button.tsx"
import AppWindow from "@/components/AppWindow/AppWindow.tsx"
import type {AppData} from "@/features/desktop/types/app.ts"
import {useWindows} from "@/features/desktop/hooks/useWindows.ts"
import {useDesktopLayout} from "@/features/desktop/hooks/useDesktopLayout.ts"

type DesktopProps = {
    apps: AppData[]
}

// El escritorio: arma la pantalla. El estado vive en useWindows y el DOM (medir,
// ubicar, límites del arrastre) en useDesktopLayout.
function Desktop({apps}: DesktopProps) {
    const {windows, activeId, activate, deactivate, setPosition, placeNew, keepInside} = useWindows(apps)
    const {layerRef, taskBarRef, windowRef, boundsRef, startDrag, drag} =
        useDesktopLayout(windows, {setPosition, placeNew, keepInside})

    function getApp(id: string) {
        return apps.find(app => app.id === id)
    }

    return (
        <div className="desktop" onPointerDown={deactivate}>
            <div className="desktop-wall" aria-hidden="true"/>
            <LightBeam/>
            <div className="desktop-windows" ref={layerRef}>
                {windows.map(w => {
                    const app = getApp(w.id)
                    if (!app) return null
                    return (
                        <Fragment key={w.id}>
                            <div className="desktop-window-bounds" id={`bounds-${w.id}`} aria-hidden="true"
                                 ref={boundsRef(w.id)}/>
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
                                <div ref={windowRef(w.id)}
                                     onPointerDown={e => {
                                         e.stopPropagation()
                                         activate(w.id)
                                     }}>
                                    <AppWindow title={app.title} menus={app.menus} status={app.status}
                                               field={app.field}>
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
