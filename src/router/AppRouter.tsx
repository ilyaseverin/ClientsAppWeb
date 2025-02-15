// src/router/AppRouter.tsx
import { Routes, Route, Navigate } from "react-router-dom";

import Layout from "../components/Layout";

import SearchClientPage from "../pages/SearchClientPage";

import { useAuth } from "../contexts/AuthContext";
import { ClientsPage } from "../pages/ClientsPage";
import { AddClientPage } from "../pages/AddClientPage";
import { ClientDetailPage } from "../pages/ClientDetailPage";
import { Login } from "../pages/Login";
import { HomePage } from "../pages/HomePage";

// Пропы для переключения темы (из App.tsx)
interface AppRouterProps {
  toggleTheme: () => void;
  mode: "light" | "dark";
}

export function AppRouter({ toggleTheme, mode }: AppRouterProps) {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Маршрут логина. Если пользователь уже авторизован, редиректим на / */}
      <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />

      {/* Общий Layout c AppBar/меню/табами */}
      <Route element={<Layout toggleTheme={toggleTheme} mode={mode} />}>
        {/* Все следующие роуты защищены: если нет user — редиректим на /login */}
        <Route
          path="/"
          element={user ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/clients"
          element={user ? <ClientsPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/add-client"
          element={user ? <AddClientPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/search-client"
          element={user ? <SearchClientPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/client/:id"
          element={user ? <ClientDetailPage /> : <Navigate to="/login" />}
        />
      </Route>

      {/* Если маршрут не найден */}
      <Route path="*" element={<div>Страница не найдена</div>} />
    </Routes>
  );
}
