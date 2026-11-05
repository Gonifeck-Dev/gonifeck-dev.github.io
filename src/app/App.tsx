import Desktop from "@/features/desktop/components/Desktop.tsx"
import Monitor from "@/components/Monitor/Monitor.tsx"
import {apps} from "@/app/catalog.tsx"

function App() {
    return (
        <Monitor>
            <Desktop apps={apps}/>
        </Monitor>
    )
}

export default App
