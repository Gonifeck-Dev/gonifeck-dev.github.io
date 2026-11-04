import type {ReactNode} from "react";
import "./TaskBar.css";
import Button from "../Button/Button.tsx";

type TaskBarProps = {
    children?: ReactNode;
}

function TaskBar({children}: TaskBarProps) {
    return (
        <div className="taskbar">
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

export default TaskBar;
