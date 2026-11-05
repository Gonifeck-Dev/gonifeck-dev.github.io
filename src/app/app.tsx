import Desktop from "@/features/desktop/components/desktop.tsx"
import Monitor from "@/components/monitor/monitor.tsx"
import {apps} from "@/app/catalog.tsx"

function App() {
    return (
        <Monitor>
            <Desktop apps={apps}/>
        </Monitor>
    )
}

export default App
