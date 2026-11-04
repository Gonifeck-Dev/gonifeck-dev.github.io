import Desktop from "../components/Desktop/Desktop.tsx";
import Monitor from "../components/Monitor/Monitor.tsx";
import {apps} from "./catalog.tsx";

function App() {
    return (
        <Monitor>
            <Desktop apps={apps}/>
        </Monitor>
    )
}

export default App
