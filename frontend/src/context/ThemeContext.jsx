import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(() => {
        const saved = localStorage.getItem('pf-theme') || 'dark'
        document.documentElement.setAttribute('data-theme', saved)
        return saved
    })

    useEffect(() => {
        localStorage.setItem('pf-theme', theme)
        document.documentElement.setAttribute('data-theme', theme)
    }, [theme])

    const toggle = () => setTheme(t => t === 'dark' ? 'light' : 'dark')

    return (
        <ThemeContext.Provider value={{ theme, toggle }}>
            {children}
        </ThemeContext.Provider>
    )
}

export const useTheme = () => useContext(ThemeContext)