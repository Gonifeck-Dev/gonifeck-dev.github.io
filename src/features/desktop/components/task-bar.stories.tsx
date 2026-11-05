import type {Meta, StoryObj} from "@storybook/react-vite"
import TaskBar from "@/features/desktop/components/task-bar.tsx"
import Button from "@/components/button/button.tsx"

const meta = {
    title: "Escritorio/Barra de tareas",
    component: TaskBar,
    tags: ["autodocs"],
    // La barra se pega abajo con position: absolute; esta caja simula el escritorio
    decorators: [
        (Story) => (
            <div style={{
                position: "relative",
                width: 800,
                height: 120,
                background: "var(--desktop-bg)",
            }}>
                <Story/>
            </div>
        ),
    ],
    argTypes: {
        children: {control: false},
    },
} satisfies Meta<typeof TaskBar>

export default meta
type Story = StoryObj<typeof meta>

/** Solo Inicio, separadores y reloj. */
export const NoTasks: Story = {
    name: "Sin tareas",
}

/** La tarea de la ventana activa se ve hundida. */
export const OneActiveTask: Story = {
    name: "Una tarea activa",
    args: {
        children: <Button variant="normal" label="Símbolo de MS-DOS" pressed/>,
    },
}

/** Varias ventanas abiertas: una activa y el resto normales. */
export const ManyTasks: Story = {
    name: "Varias tareas",
    args: {
        children: (
            <>
                <Button variant="normal" label="Símbolo de MS-DOS" pressed/>
                <Button variant="normal" label="Bloc de notas"/>
                <Button variant="normal" label="foto.png"/>
            </>
        ),
    },
}
