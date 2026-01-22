import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HeroUIProvider } from "@heroui/react";
import { ThemeProvider } from "./context/ThemeContext";
import App from "./App";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import './index.css';
import './styles/animations.css';
import { ThemeProvider as MuiThemeProvider, createTheme, CssBaseline } from "@mui/material";

// Modern Healthcare Palette
const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#00ACC1",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#4CAF50",
    },
    error: {
      main: "#EF5350",
    },
    warning: {
      main: "#FFC107",
    },
    background: {
      default: "#1A1F2E",
      paper: "#252B3B",
    },
    text: {
      primary: "#E8EAF6",
      secondary: "#B0B8C4",
    },
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
    h3: { fontWeight: 700, letterSpacing: "-0.02em" },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { textTransform: "none", fontWeight: 600 },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: "10px 24px",
          boxShadow: "none",
          "&:hover": { boxShadow: "0 4px 12px rgba(0, 172, 193, 0.3)" },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 500 },
      },
    },
  },
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider>
      <HeroUIProvider>
        <MuiThemeProvider theme={theme}>
          <CssBaseline />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/dashboard" element={<App />} />
            </Routes>
          </BrowserRouter>
        </MuiThemeProvider>
      </HeroUIProvider>
    </ThemeProvider>
  </React.StrictMode>
);