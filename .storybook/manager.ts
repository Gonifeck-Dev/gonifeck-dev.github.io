import { addons } from 'storybook/manager-api'
import { create } from 'storybook/theming'

// Interfaz de Storybook (no el sitio): panel de controles a la derecha y tema oscuro
addons.setConfig({
  panelPosition: 'right',
  theme: create({
    base: 'dark',
    brandTitle: 'Gonifeck-Dev',
  }),
})
