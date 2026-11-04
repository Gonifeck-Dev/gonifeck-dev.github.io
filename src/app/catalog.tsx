import type {AppData} from "@/features/desktop/types/app.ts"
import AboutMe from "@/features/about-me/components/AboutMe.tsx"

// Catálogo: las apps del escritorio. Agregar una app = una feature nueva + una entrada aquí.
// Vive en app/ porque es el único lugar que puede conocer todas las features (bulletproof-react).
export const apps: AppData[] = [
    {
        id: "about",
        title: "Símbolo de MS-DOS",
        menus: [
            {title: "Archivo", options: []},
            {title: "Editar", options: []},
            {title: "Ver", options: []},
            {title: "Ayuda", options: []},
        ],
        status: {text: "Listo · Disponible para trabajar", easterEggs: "Secretos: 0/5"},
        field: true,
        openAtStart: true,
        content: <AboutMe/>,
    },
]
