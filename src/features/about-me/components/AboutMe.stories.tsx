import type {Meta, StoryObj} from "@storybook/react-vite"
import AboutMe from "@/features/about-me/components/AboutMe.tsx"
import AppWindow from "@/components/AppWindow/AppWindow.tsx"

const meta = {
    title: "Apps/Sobre mí",
    component: AboutMe,
    tags: ["autodocs"],
} satisfies Meta<typeof AboutMe>

export default meta
type Story = StoryObj<typeof meta>

// Solo el contenido
export const Contenido: Story = {}

// Dentro de su ventana, como en el escritorio
export const EnSuVentana: Story = {
    name: "En su ventana",
    decorators: [
        (Story) => (
            <AppWindow
                title="Símbolo de MS-DOS"
                menus={[
                    {title: "Archivo", options: []},
                    {title: "Editar", options: []},
                    {title: "Ver", options: []},
                    {title: "Ayuda", options: []},
                ]}
                status={{text: "Listo · Disponible para trabajar", easterEggs: "Secretos: 0/5"}}
                field>
                <Story/>
            </AppWindow>
        ),
    ],
}
