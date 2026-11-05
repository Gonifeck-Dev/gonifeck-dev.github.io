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

    function getApp(appId: string) {
        return apps.find(app => app.id === appId)
    }

    return (
        <div className="desktop" onPointerDown={deactivate}>
            <div className="desktop-wall" aria-hidden="true"/>
            <LightBeam/>
            <div className="desktop-windows" ref={layerRef}>
                {windows.map(({id, position, z, minimized}) => {
                    const app = getApp(id)
                    if (!app) return null
                    const boundsId = `bounds-${id}`
                    return (
                        <Fragment key={id}>
                            <div className="desktop-window-bounds" id={boundsId} aria-hidden="true"
                                 ref={boundsRef(id)}/>
                            <Rnd position={position ?? {x: 0, y: 0}}
                                 bounds={`#${boundsId}`}
                                 onDragStart={() => startDrag(id)}
                                 onDrag={(_event, dragData) => drag(id, {x: dragData.x, y: dragData.y})}
                                 dragHandleClassName="window-title-bar"
                                 cancel=".window-controls"
                                 enableResizing={false}
                                 style={{
                                     zIndex: z,
                                     display: minimized ? "none" : undefined,
                                     visibility: position ? undefined : "hidden",
                                 }}>
                                <div ref={windowRef(id)}
                                     onPointerDown={event => {
                                         event.stopPropagation()
                                         activate(id)
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
                {windows.map(({id}) => (
                    <Button key={id} variant="normal"
                            label={getApp(id)?.title}
                            pressed={id === activeId}
                            action={() => activate(id)}/>
                ))}
            </TaskBar>
        </div>
    )
}

export default Desktop
