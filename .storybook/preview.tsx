/// <reference types="vite/client" />
import type {Preview} from '@storybook/react-vite'
import {withThemeByDataAttribute} from '@storybook/addon-themes'
import {themes} from 'storybook/theming'
import '../src/index.css'

const preview: Preview = {
    parameters: {
        layout: 'centered',
        backgrounds: {disable: true},
        docs: {theme: themes.dark},
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
    },
    decorators: [
        withThemeByDataAttribute({
            themes: {
                Noche: 'night',
                Dia: 'day',
            },
            defaultTheme: 'Noche',
            attributeName: 'data-theme',
        }),
    ],
};

export default preview;
