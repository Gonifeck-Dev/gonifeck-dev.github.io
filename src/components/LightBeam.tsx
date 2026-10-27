import "./LightBeam.css"

function LightBeam() {
    return (
        <div className="light-beam" aria-hidden="true">
            <div className="light-beam-pane"/>
            <div className="light-beam-pane"/>
            <div className="light-beam-pane"/>
            <div className="light-beam-pane"/>
        </div>
    );
}

export default LightBeam;
