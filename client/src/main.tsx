import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { ThemeProvider } from "@/components/theme-provider";

// Pre-initialize Firebase to ensure consistent initialization
import "./lib/firebase";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider defaultTheme="light" storageKey="homeo-theme">
    <App />
  </ThemeProvider>
);
