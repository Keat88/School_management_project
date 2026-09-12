import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { BrowserRouter } from "react-router-dom";
// import { ModalProvider } from "./context/ModalProvider.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        {/* <ModalProvider> */}
        <App />
        {/* </ModalProvider> */}
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
);
