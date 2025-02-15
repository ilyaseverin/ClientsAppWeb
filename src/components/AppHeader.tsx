import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Tabs,
  Tab,
  Box,
  IconButton,
} from "@mui/material";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface AppHeaderProps {
  mode: "light" | "dark";
  toggleColorMode: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  mode,
  toggleColorMode,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Определяем, какая вкладка активна
  const currentPath = location.pathname;
  let value = 0;
  if (currentPath.startsWith("/clients")) value = 1;
  if (currentPath.startsWith("/add-client")) value = 2;
  if (currentPath.startsWith("/search-client")) value = 3;

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    switch (newValue) {
      case 0:
        navigate("/home");
        break;
      case 1:
        navigate("/clients");
        break;
      case 2:
        navigate("/add-client");
        break;
      case 3:
        navigate("/search-client");
        break;
      default:
        navigate("/home");
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Ошибка при выходе:", error);
    }
  };

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          My Clients App
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          {/* Вкладки */}
          <Tabs
            value={value}
            onChange={handleChange}
            textColor="inherit"
            indicatorColor="secondary"
          >
            <Tab label="Главная" />
            <Tab label="Клиенты" />
            <Tab label="Добавить клиента" />
            <Tab label="Поиск" />
          </Tabs>

          {/* Переключатель темы */}
          <IconButton color="inherit" onClick={toggleColorMode}>
            {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
          </IconButton>

          {/* Кнопка авторизации/выхода */}
          {user ? (
            <IconButton color="inherit" onClick={handleLogout} title="Выйти">
              <LogoutIcon />
            </IconButton>
          ) : (
            <IconButton color="inherit" onClick={handleLogin} title="Войти">
              <LoginIcon />
            </IconButton>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default AppHeader;
