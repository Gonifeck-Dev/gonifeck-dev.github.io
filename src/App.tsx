import AboutMe from "./components/AboutMe.tsx";
import Desktop from "./components/Desktop.tsx";
import Monitor from "./components/Monitor.tsx";

function App() {
    return (
        <Monitor>
            <Desktop>
                <AboutMe/>
            </Desktop>
        </Monitor>
    )
}

export default App
