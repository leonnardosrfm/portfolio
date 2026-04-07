import { useEffect, useState } from "react"

export default function useTheme() {
    const [theme, setTheme] = useState(() => {
        if (typeof window === "undefined") {
            return "light"
        }

        return localStorage.getItem("theme") ?? "light"
    })

    useEffect(() => {
        localStorage.setItem("theme", theme)
    }, [theme])

    function toggleTheme() {
        setTheme((prev) => (prev === "light" ? "dark" : "light"))
    }

    return { theme, toggleTheme }
}
