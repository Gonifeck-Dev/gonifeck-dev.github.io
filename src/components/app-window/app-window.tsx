import "./app-window.css"
import Button from "@/components/button/button.tsx"
import type {ReactNode} from "react"

export type MenuData = {
    title: string,
    options: string[],
}

export type StatusData = {
    text: string,
    easterEggs: string,
}

type AppWindowProps = {
    title: string,
    icon?: string,
    menus?: MenuData[],
    status?: StatusData,
    field?: boolean,
    children?: ReactNode,
    onClose?: () => void,
    onMinimize?: () => void,
}

function AppWindow({title, icon, menus, status, field, children, onClose, onMinimize}: AppWindowProps) {
    return (
        <div className="window">
            <div className="window-title-bar">
                {icon && <img src={icon} alt=""/>}
                <span className="window-title">
                    {title}
                </span>

                <div className="window-controls">
                    <Button variant="small" action={onMinimize} label="_"/>
                    <Button variant="small" action={() => {
                    }} label="□"/>
                    <Button variant="small" action={onClose} label="X"/>
                </div>
            </div>

            {menus && (
                <ul className="window-menu">
                    {menus.map(menu => (
                        <li key={menu.title} className="window-menu-item">
                            {menu.title}
                        </li>
                    ))}
                </ul>
            )}

            <div className={field ? "window-content window-content-field" : "window-content"}>
                {children}
            </div>

            {status && (
                <div className="window-status">
                    <span className="window-status-item">{status.text}</span>
                    <span className="window-status-item">{status.easterEggs}</span>
                </div>
            )}
        </div>
    )
}

export default AppWindow

