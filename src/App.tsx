import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ClientsProvider } from "./contexts/ClientsContext";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

// Страницы
import { Login } from "./pages/Login";
import { ClientsPage } from "./pages/ClientsPage";
import { AddClientPage } from "./pages/AddClientPage";
import SearchClientPage from "./pages/SearchClientPage";
import { ClientDetailPage } from "./pages/ClientDetailPage";
import { HomePage } from "./pages/HomePage";

// Переключалка темы
import { useColorMode } from "./theme"; // хук для управления темой
import { AppHeader } from "./components/AppHeader";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  // Хук для переключения темы
  const { mode, toggleColorMode, theme } = useColorMode();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <ClientsProvider>
          {/* Шапка приложения – внутри нее реализована логика показа кнопки выхода, если пользователь авторизован */}
          <AppHeader mode={mode} toggleColorMode={toggleColorMode} />
          {/* Роутинг */}
          <Routes>
            {/* Страница входа доступна всем */}
            <Route path="/login" element={<Login />} />

            {/* Защищенные маршруты */}
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/clients"
              element={
                <ProtectedRoute>
                  <ClientsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/add-client"
              element={
                <ProtectedRoute>
                  <AddClientPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/search-client"
              element={
                <ProtectedRoute>
                  <SearchClientPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/client-detail/:id"
              element={
                <ProtectedRoute>
                  <ClientDetailPage />
                </ProtectedRoute>
              }
            />
            {/* Если запрошен корневой путь – перенаправляем на home */}
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="*" element={<div>Not Found</div>} />
          </Routes>
        </ClientsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
