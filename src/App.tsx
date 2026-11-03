import AboutMe from "./components/AboutMe.tsx";
import Desktop from "./components/Desktop.tsx";
import TaskBar from "./components/TaskBar.tsx";
import Button from "./components/Button.tsx";

function App() {

    return (
        <Desktop>
            <AboutMe/>
            <TaskBar>
                <Button variant={"normal"} label="Símbolo de MS-DOS" action={() => {
                }}/>
                <Button variant={"normal"} label="Reproductor de música" action={() => {
                }}/>
                <Button variant={"normal"} label="William Wallace" action={() => {
                }}/>
            </TaskBar>
        </Desktop>
    )
}

export default App
