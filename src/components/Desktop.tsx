import type {ReactNode} from "react";
import "./Desktop.css"
import "./Desktop-crt.css"
import LightBeam from "./LightBeam.tsx"

type DesktopProps = {
    children?: ReactNode;
}

function Desktop({children}: DesktopProps) {
    return (
        <div className="desktop">
            <div className="desktop-wall" aria-hidden="true"/>
            <LightBeam/>
            {children}
            <div className="desktop-crt" aria-hidden="true"/>
        </div>
    )
}

export default Desktop;
