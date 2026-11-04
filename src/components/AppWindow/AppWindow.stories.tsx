import type {Meta, StoryObj} from "@storybook/react-vite";
import AppWindow from "./AppWindow.tsx";

const meta = {
    title: "Escritorio/Ventana",
    component: AppWindow,
    tags: ["autodocs"],
    args: {
        title: "Bloc de notas",
        children: <p>Contenido de ejemplo dentro de la ventana.</p>,
    },
    argTypes: {
        title: {description: "Texto de la barra de título"},
        icon: {description: "Ruta de un ícono opcional junto al título"},
        menus: {description: "Menús de la ventana (opcional: una foto no los tiene)"},
        status: {description: "Barra de estado inferior (opcional)"},
        field: {description: "Campo: contenido sobre fondo oscuro con bisel hundido"},
        children: {control: false, description: "Contenido de la app"},
    },
} satisfies Meta<typeof AppWindow>;

export default meta;
type Story = StoryObj<typeof meta>;

// Todas las partes: título, menús, contenido y barra de estado
export const Completa: Story = {
    args: {
        menus: [
            {title: "Archivo", options: []},
            {title: "Editar", options: []},
            {title: "Ver", options: []},
            {title: "Ayuda", options: []},
        ],
        status: {text: "Listo", easterEggs: "Secretos: 0/5"},
        field: true,
    },
};

// Como un visor de fotos: solo barra de título y contenido
export const SinMenuNiEstado: Story = {
    name: "Sin menú ni estado",
    args: {title: "foto.png"},
};

