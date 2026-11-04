import type {ReactNode, Ref} from "react"
import "./TaskBar.css"
import Button from "@/components/Button/Button.tsx"

type TaskBarProps = {
    children?: ReactNode
    ref?: Ref<HTMLDivElement> // React 19: ref llega como una prop más (Desktop mide dónde empieza la barra)
}

function TaskBar({children, ref}: TaskBarProps) {
    return (
        <div className="taskbar" ref={ref}>
            <div className="taskbar-start">
                <Button variant="normal" label="Inicio" action={() => {
                }}/>
            </div>
            <div className="taskbar-separator" aria-hidden="true"/>
            <div className="taskbar-task">{children}</div>
            <div className="taskbar-separator" aria-hidden="true"/>
            <div className="taskbar-tray">
                4:20 PM
            </div>
        </div>
    )
}

export default TaskBar
