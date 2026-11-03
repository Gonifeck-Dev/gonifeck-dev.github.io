import type {ReactNode} from "react";
import "./Desktop.css";
import LightBeam from "./LightBeam.tsx";
import TaskBar from "./TaskBar.tsx";
import Button from "./Button.tsx";

type DesktopProps = {
    children?: ReactNode;
}

function Desktop({children}: DesktopProps) {
    return (
        <div className="desktop">
            <div className="desktop-wall" aria-hidden="true"/>
            <LightBeam/>
            <div className="desktop-windows">
                {children}
            </div>
            <TaskBar>
                <Button variant="normal" label="Símbolo de MS-DOS" action={() => {}}/>
                <Button variant="normal" label="Reproductor de música" action={() => {}}/>
                <Button variant="normal" label="William Wallace" action={() => {}}/>
            </TaskBar>
        </div>
    )
}

export default Desktop;
