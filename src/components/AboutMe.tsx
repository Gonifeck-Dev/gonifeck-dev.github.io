import Button from "./Button"
import AppWindow from "./AppWindow"

const aboutMeMenus = [
    { title: "Archivo", options: [] },
    { title: "Editar", options: [] },
    { title: "Ver", options: [] },
    { title: "Ayuda", options: [] },
]

const aboutMeStatus = {
    text: "Listo · Disponible para trabajar",
    easterEggs: "Secretos: 0/5",
}

const aboutMeInfo = {
    command: "C:\\> whoami.bat",
    name: "Gonzalo Ignacio Fernando Cerda López",
    subtitle: "alias «Gonifeck»",
    role: "Desarrollador Front-end y Back-end",
    text: "Desarrollo interfaces y el backend que las sostiene, con React, TypeScript y PostgreSQL. Elegí este diseño buscando darle personalidad y cariño, y también probar algo distinto: tomar lo mejor de la web de antes y construirlo con herramientas de hoy. Me pasa lo mismo con los juegos que se atreven a romper esquemas: creo que lo mejor que uno puede hacer es mostrar lo que ama.",
}

function AboutMe() {
    return (
        <AppWindow title="Símbolo de MS-DOS" menus={aboutMeMenus} status={aboutMeStatus}>
            <div className="aboutme">
                <p className="aboutme-command">{aboutMeInfo.command}</p>
                <h1 className="aboutme-name">{aboutMeInfo.name}</h1>
                <p className="aboutme-subtitle">{aboutMeInfo.subtitle}</p>
                <h2 className="aboutme-role">{aboutMeInfo.role}</h2>
                <p className="aboutme-text">{aboutMeInfo.text}</p>
                <div className="aboutme-buttons">
                    <Button variant="normal" emphasis="primary" label="Descargar CV" action={() => {}} />
                    <Button variant="normal" label="Ver Proyectos" action={() => {}} />
                    <Button variant="normal" label="Contacto" action={() => {}} />
                </div>
            </div>
        </AppWindow>
    )
}

export default AboutMe
