/**
 * Theme mode + palette context. Lives in its own module so App.jsx exports only
 * components (react-refresh/only-export-components), and so Header and
 * ThemePaletteSelector no longer import App.jsx — which imports them — to get it.
 */
import { createContext } from 'react';

export const ThemeContext = createContext({
    isDark: true,
    setIsDark: () => {},
    palette: 'cyan',
    setPalette: () => {}
});
