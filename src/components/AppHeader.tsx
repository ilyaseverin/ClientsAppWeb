import React, { useState, useMemo } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Tabs,
  Tab,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import MenuIcon from "@mui/icons-material/Menu";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface AppHeaderProps {
  mode: "light" | "dark";
  toggleColorMode: () => void;
}

interface TabItem {
  label: string;
  route: string;
}

/**
 * Компонент шапки приложения с адаптивной версткой:
 * - На десктопе: Tabs для навигации
 * - На мобильном: иконка-меню (Drawer), где пункты представлены списком
 */
export const AppHeader: React.FC<AppHeaderProps> = ({
  mode,
  toggleColorMode,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [mobileOpen, setMobileOpen] = useState(false);

  const currentPath = location.pathname;
  const isClientDetail = currentPath.startsWith("/client-detail");

  /**
   * Формируем список вкладок для десктопной версии:
   * - Если пользователь на детальной странице клиента, добавляем отдельную вкладку "Клиент"
   */
  const desktopTabs = useMemo<TabItem[]>(() => {
    if (isClientDetail) {
      return [
        { label: "Главная", route: "/home" },
        { label: "Клиенты", route: "/clients" },
        { label: "Клиент", route: "/client-detail" },
        { label: "Добавить клиента", route: "/add-client" },
        { label: "Поиск", route: "/search-client" },
      ];
    } else {
      return [
        { label: "Главная", route: "/home" },
        { label: "Клиенты", route: "/clients" },
        { label: "Добавить клиента", route: "/add-client" },
        { label: "Поиск", route: "/search-client" },
      ];
    }
  }, [isClientDetail]);

  /**
   * Определяем индекс активной вкладки (или 0, если ни одна не подошла),
   * чтобы Tabs правильно отображал подчеркивание
   */
  const selectedTabIndex = desktopTabs.findIndex((tab) =>
    currentPath.startsWith(tab.route)
  );

  const handleDesktopTabChange = (
    _event: React.SyntheticEvent,
    newValue: number
  ) => {
    navigate(desktopTabs[newValue].route);
  };

  /**
   * Флаги для подсветки пунктов меню в Drawer
   */
  const isActiveHome = currentPath.startsWith("/home");
  // "Клиенты" считаем активными, если мы либо на /clients, либо на /client-detail
  const isActiveClients = currentPath.startsWith("/clients") || isClientDetail;
  const isActiveAddClient = currentPath.startsWith("/add-client");
  const isActiveSearch = currentPath.startsWith("/search-client");

  /**
   * Обработчики авторизации/выхода
   */
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

  /**
   * Контент для Drawer (мобильное меню)
   */
  const drawerContent = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={() => setMobileOpen(false)}
      onKeyDown={() => setMobileOpen(false)}
    >
      <List>
        {/* Главная */}
        <ListItem disablePadding>
          <ListItemButton
            selected={isActiveHome}
            onClick={() => navigate("/home")}
          >
            <ListItemText primary="Главная" />
          </ListItemButton>
        </ListItem>

        {/* Клиенты */}
        <ListItem disablePadding>
          <ListItemButton
            selected={isActiveClients && !isClientDetail}
            onClick={() => navigate("/clients")}
          >
            <ListItemText primary="Клиенты" />
          </ListItemButton>
        </ListItem>

        {isClientDetail && (
          <List component="div" disablePadding>
            <ListItem disablePadding>
              <ListItemButton
                selected={true}
                sx={{ pl: 4 }}
                onClick={() => navigate("/client-detail")}
              >
                <ListItemText primary="Клиент" />
              </ListItemButton>
            </ListItem>
          </List>
        )}

        {/* Добавить клиента */}
        <ListItem disablePadding>
          <ListItemButton
            selected={isActiveAddClient}
            onClick={() => navigate("/add-client")}
          >
            <ListItemText primary="Добавить клиента" />
          </ListItemButton>
        </ListItem>

        {/* Поиск */}
        <ListItem disablePadding>
          <ListItemButton
            selected={isActiveSearch}
            onClick={() => navigate("/search-client")}
          >
            <ListItemText primary="Поиск" />
          </ListItemButton>
        </ListItem>
      </List>

      <Divider />

      <List>
        {/* Переключатель темы */}
        <ListItem disablePadding>
          <ListItemButton onClick={toggleColorMode}>
            <ListItemText
              primary={mode === "light" ? "Темная тема" : "Светлая тема"}
            />
          </ListItemButton>
        </ListItem>

        {/* Авторизация / Выход */}
        <ListItem disablePadding>
          {user ? (
            <ListItemButton onClick={handleLogout}>
              <ListItemText primary="Выйти" />
            </ListItemButton>
          ) : (
            <ListItemButton onClick={handleLogin}>
              <ListItemText primary="Войти" />
            </ListItemButton>
          )}
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="sticky">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            My Clients App
          </Typography>

          {/* Адаптивность: на мобильных — гамбургер меню, на десктопе — вкладки */}
          {isMobile ? (
            <IconButton
              color="inherit"
              onClick={() => setMobileOpen(true)}
              edge="end"
            >
              <MenuIcon />
            </IconButton>
          ) : (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Tabs
                value={selectedTabIndex === -1 ? 0 : selectedTabIndex}
                onChange={handleDesktopTabChange}
                textColor="inherit"
                indicatorColor="secondary"
              >
                {desktopTabs.map((tab, index) => (
                  <Tab key={index} label={tab.label} />
                ))}
              </Tabs>

              <IconButton color="inherit" onClick={toggleColorMode}>
                {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
              </IconButton>

              {user ? (
                <IconButton
                  color="inherit"
                  onClick={handleLogout}
                  title="Выйти"
                >
                  <LogoutIcon />
                </IconButton>
              ) : (
                <IconButton color="inherit" onClick={handleLogin} title="Войти">
                  <LoginIcon />
                </IconButton>
              )}
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Drawer для мобильных устройств */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{
          keepMounted: true,
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

export default AppHeader;
