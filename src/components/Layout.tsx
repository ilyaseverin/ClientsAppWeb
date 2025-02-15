import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Tabs,
  Tab,
  IconButton,
  Box,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";

import { useAuth } from "../contexts/AuthContext";

interface LayoutProps {
  toggleTheme: () => void;
  mode: "light" | "dark";
}

export default function Layout({ toggleTheme, mode }: LayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Описываем вкладки
  const tabs = [
    { label: "Главная", path: "/" },
    { label: "Клиенты", path: "/clients" },
    { label: "Добавить", path: "/add-client" },
    { label: "Поиск", path: "/search-client" },
  ];

  // Определяем текущую вкладку
  const currentTab = tabs.findIndex((tab) => tab.path === location.pathname);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Clients App
          </Typography>
          {/* Переключатель темы */}
          <IconButton color="inherit" onClick={toggleTheme}>
            {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>

          {/* Кнопка Logout (если есть user) */}
          {user && (
            <IconButton color="inherit" onClick={handleLogout}>
              <LogoutIcon />
            </IconButton>
          )}
        </Toolbar>
        {user && (
          <Tabs value={currentTab}>
            {tabs.map((tab, index) => (
              <Tab
                key={tab.path}
                label={tab.label}
                component={Link}
                to={tab.path}
                value={index}
              />
            ))}
          </Tabs>
        )}
      </AppBar>

      <Box sx={{ padding: 2 }}>
        {/* Здесь будет рендер соответствующей страницы */}
        <Outlet />
      </Box>
    </>
  );
}
