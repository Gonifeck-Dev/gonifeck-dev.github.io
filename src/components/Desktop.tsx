import type {ReactNode} from "react";
import "./Desktop.css"

type DesktopProps = {
    children?: ReactNode;
}

function Desktop({children}: DesktopProps) {
    return (
        <div className="desktop">
            <div className="desktop-wall" aria-hidden="true"/>
            {children}
        </div>
    )
}

export default Desktop;