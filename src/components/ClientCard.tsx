/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/ClientCard.tsx
import React from "react";
import { Card, CardActionArea, CardContent, Typography } from "@mui/material";

// Интерфейс
interface Client {
  [key: string]: any;
}

interface ClientCardProps {
  client: Client;
  onClick?: () => void;
}

export const ClientCard: React.FC<ClientCardProps> = ({ client, onClick }) => {
  // Формируем первую строку адреса
  const street = client["Улица"] || "";
  const house = client["№ Дома"] || "";
  const apartment = client["№ Квартиры"] || "";
  const streetAndHouse = [street, house].filter(Boolean).join(" ");
  let addressLine1 = streetAndHouse;
  if (apartment) {
    addressLine1 += `, кв. ${apartment}`;
  }

  // Вторая строка: населенный пункт
  const city = client["Наименование населенного пункта"] || "";

  return (
    <Card variant="outlined" sx={{ mb: 1 }}>
      <CardActionArea onClick={onClick}>
        <CardContent>
          <Typography variant="h6">{client["ФИО"] || "Без имени"}</Typography>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            {(client["Торговая марка"] || "Не указана") +
              " " +
              (client["Модель"] || "")}
          </Typography>
          {/* Адрес */}
          {addressLine1 && (
            <Typography variant="body2">{addressLine1}</Typography>
          )}
          {city && <Typography variant="body2">{city}</Typography>}
        </CardContent>
      </CardActionArea>
    </Card>
  );
};
