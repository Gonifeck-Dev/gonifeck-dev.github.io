import type {ReactNode} from "react";
import "./Monitor.css";

type MonitorProps = {
    children?: ReactNode;
}

function Monitor({children}: MonitorProps) {
    return (
        <div className="monitor">
            {children}
            <div className="monitor-crt" aria-hidden="true"/>
            <div className="monitor-frame" aria-hidden="true"/>
        </div>
    )
}

export default Monitor;
