import { useTheme } from '../context/ThemeContext'

export default function ThemeToggle() {
    const { theme, toggle } = useTheme()

    return (
        <button
            onClick={toggle}
            title={`switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            style={{
                borderRadius: '5px',
                color: 'var(--text-muted)',
                fontSize: '13px',
                padding: '4px 10px',
                cursor: 'pointer',
                fontFamily: "'JetBrains Mono', monospace",
                transition: 'all 0.15s',
            }}
            onMouseOver={e => { e.target.style.borderColor = 'var(--text-muted)'; e.target.style.color = 'var(--text-primary)'; }}
            onMouseOut={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.color = 'var(--text-muted)'; }}
        >
            {theme === 'dark' ? '☀ light' : '◑ dark'}
        </button>
    )
}