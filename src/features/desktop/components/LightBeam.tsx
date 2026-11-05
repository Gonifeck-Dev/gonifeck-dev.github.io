import "./LightBeam.css"

/** Haz de luz decorativo que entra por una ventana de 4 cristales. */
function LightBeam() {
    return (
        <div className="light-beam" aria-hidden="true">
            <div className="light-beam-pane"/>
            <div className="light-beam-pane"/>
            <div className="light-beam-pane"/>
            <div className="light-beam-pane"/>
        </div>
    )
}

export default LightBeam
