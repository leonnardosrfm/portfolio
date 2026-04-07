import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import UtilitiesApp from "./UtilitiesApp"

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <UtilitiesApp />
    </StrictMode>
)
