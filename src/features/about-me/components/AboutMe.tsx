import "./AboutMe.css"
import Button from "../../../components/Button/Button.tsx"

const aboutMeInfo = {
    command: "C:\\> whoami.bat",
    name: "Gonzalo Ignacio Fernando Cerda López",
    subtitle: "alias «Gonifeck»",
    role: "Desarrollador Front-end y Back-end",
    text: "Desarrollo interfaces y el backend que las sostiene, con React, TypeScript y PostgreSQL. Elegí este diseño buscando darle personalidad y cariño, y también probar algo distinto: tomar lo mejor de la web de antes y construirlo con herramientas de hoy. Me pasa lo mismo con los juegos que se atreven a romper esquemas: creo que lo mejor que uno puede hacer es mostrar lo que ama.",
}

function AboutMe() {
    return (
        <div className="aboutme">
            <p className="aboutme-command">{aboutMeInfo.command}</p>
            <h1 className="aboutme-name">{aboutMeInfo.name}</h1>
            <p className="aboutme-subtitle">{aboutMeInfo.subtitle}</p>
            <h2 className="aboutme-role">{aboutMeInfo.role}</h2>
            <p className="aboutme-text">{aboutMeInfo.text}</p>
            <div className="aboutme-buttons">
                <Button variant="normal" emphasis="primary" label="Descargar CV"
                        href="/main_fullstack_es.pdf" download/>
                <Button variant="normal" label="Ver Proyectos"
                        href="https://github.com/Gonifeck-Dev" newTab/>
                <Button variant="normal" label="Contacto"
                        href="mailto:gonzalo.fclopez@gmail.com"/>
            </div>
        </div>
    )
}

export default AboutMe
