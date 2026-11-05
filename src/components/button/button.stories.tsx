import type {Meta, StoryObj} from "@storybook/react-vite"
import {fn} from "storybook/test"
import Button from "@/components/button/button.tsx"

const meta = {
    title: "Escritorio/Botón",
    component: Button,
    tags: ["autodocs"], // página Docs con todas las historias juntas
    args: {
        variant: "normal",
        label: "Aceptar",
        action: fn(), // los clics aparecen en la pestaña Actions
    },
    argTypes: {
        variant: {control: "inline-radio", description: "Tamaño del botón"},
        emphasis: {control: "inline-radio", description: "Énfasis visual"},
        pressed: {description: "Se ve hundido (por ejemplo, la tarea activa)"},
        label: {description: "Texto del botón"},
        icon: {description: "Ruta de un ícono opcional"},
        action: {description: "Qué hace al hacer clic"},
        href: {description: "Si se indica, el botón es un enlace (`<a>`)"},
        newTab: {description: "Abre el enlace en otra pestaña"},
        download: {description: "Descarga el archivo del enlace"},
    },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Normal: Story = {}

export const Primario: Story = {
    args: {emphasis: "primary", label: "Descargar CV"},
}

export const Hundido: Story = {
    args: {pressed: true, label: "Símbolo de MS-DOS"},
}

export const ControlDeVentana: Story = {
    name: "Control de ventana",
    args: {variant: "small", label: "_"},
}

export const Enlace: Story = {
    args: {label: "Ver Proyectos", href: "https://github.com/Gonifeck-Dev", newTab: true},
}
