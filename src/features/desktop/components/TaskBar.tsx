import type {ReactNode, Ref} from "react"
import "./TaskBar.css"
import Button from "@/components/Button/Button.tsx"

type TaskBarProps = {
    /** Botones de tarea: uno por ventana abierta. */
    children?: ReactNode
    /** El escritorio lo mide para saber dónde termina el área de trabajo. */
    ref?: Ref<HTMLDivElement>
}

/** Barra de tareas: botón Inicio, tareas y reloj. */
function TaskBar({children, ref}: TaskBarProps) {
    return (
        <div className="taskbar" ref={ref}>
            <div className="taskbar-start">
                <Button variant="normal" label="Inicio" action={() => {}}/>
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
