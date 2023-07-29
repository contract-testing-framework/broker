import React from "react";
import { createRoot } from "react-dom/client";
import { useState, useEffect } from "react";
import { MantineProvider, ColorSchemeProvider } from "@mantine/core";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter as Router } from "react-router-dom";
import { Notifications } from "@mantine/notifications";

function Root() {
  const [colorScheme, setColorScheme] = useState("light");

  useEffect(() => {
    const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)");

    setColorScheme(prefersDarkMode.matches ? "dark" : "light");

    const updateColorScheme = (event) => {
      setColorScheme(event.matches ? "dark" : "light");
    };

    prefersDarkMode.addEventListener("change", updateColorScheme);

    return () => {
      prefersDarkMode.removeEventListener("change", updateColorScheme);
    };
  }, []);

  const toggleColorScheme = () => {
    setColorScheme((prevColorScheme) =>
      prevColorScheme === "dark" ? "light" : "dark"
    );
  };

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        theme={{
          colorScheme,
          fontFamily: "Nunito",
          colors: { signetPurple: ["#541594"], signetBlue: ["#0CBAFF"] },
          defaultGradient: {
            from: "#0CBAFF",
            to: "#541594",
            deg: 45,
          },
        }}
        withGlobalStyles
        withNormalizeCSS
      >
        <React.StrictMode>
          <Router>
            <Notifications />
            <App />
          </Router>
        </React.StrictMode>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}

export default Root;

createRoot(document.getElementById("root")).render(<Root />);
