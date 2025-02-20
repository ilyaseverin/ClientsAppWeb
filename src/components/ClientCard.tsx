/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import {
  Card,
  CardActionArea,
  CardContent,
  Typography,
  useTheme,
  Box,
} from "@mui/material";

interface Client {
  [key: string]: any;
}

interface ClientCardProps {
  client: Client;
  onClick?: () => void;
}

export const ClientCard: React.FC<ClientCardProps> = ({ client, onClick }) => {
  const theme = useTheme();

  // Формируем первую строку адреса
  const street = client["Улица"] || "";
  const house = client["№ Дома"] || "";
  const apartment = client["№ Квартиры"] || "";
  const streetAndHouse = [street, house].filter(Boolean).join(" ");
  let addressLine1 = streetAndHouse;
  if (apartment) {
    addressLine1 += `, кв. ${apartment}`;
  }

  // Вторая строка: населённый пункт
  const city = client["Наименование населенного пункта"] || "";

  return (
    <Card
      variant="outlined"
      sx={{
        width: "100%",
        borderRadius: 2,
        boxShadow: 1,
        bgcolor:
          theme.palette.mode === "dark"
            ? theme.palette.background.paper
            : "#fff",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          transform: "scale(1.005)",
          boxShadow: 4,
        },
        overflow: "hidden",
      }}
    >
      <CardActionArea onClick={onClick}>
        <CardContent sx={{ py: 1.5, px: 2 }}>
          {/* Имя клиента */}
          <Typography
            variant="h6"
            component="div"
            sx={{ fontWeight: "bold", mb: 0.5 }}
          >
            {client["ФИО"] || "Без имени"}
          </Typography>
          {/* Торговая марка и модель */}
          <Typography
            variant="subtitle2"
            component="div"
            sx={{
              mb: 1,
              color: theme.palette.text.secondary,
            }}
          >
            {(client["Торговая марка"] || "Не указана") +
              " " +
              (client["Модель"] || "")}
          </Typography>
          {/* Адрес */}
          {addressLine1 && (
            <Box sx={{ mb: 0.25 }}>
              <Typography variant="body2">{addressLine1}</Typography>
            </Box>
          )}
          {/* Город */}
          {city && (
            <Box sx={{ ml: 0.5 }}>
              <Typography variant="body2">{city}</Typography>
            </Box>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
};
