/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/ClientsScreen.tsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
} from "@mui/material";
import { useClients } from "../contexts/ClientsContext";
import { RenderClientsForDate } from "../components/renderClientsForDate"; // см. ниже
// Если хотите добавить логику логаута, сделайте свою кнопку / иконку

export const ClientsPage: React.FC = () => {
  const { clients } = useClients();

  const [filteredClients, setFilteredClients] = useState<Record<string, any[]>>(
    {}
  );
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [dropdownItems, setDropdownItems] = useState<any[]>([]);

  // При изменении списка клиентов — рассчитываем месяцы
  useEffect(() => {
    if (clients.length) {
      calculateMonthlyCounts(clients);
    }
  }, [clients]);

  // При выборе месяца — фильтруем
  useEffect(() => {
    if (selectedMonth) {
      filterClientsByMonth(clients, selectedMonth);
    } else {
      setFilteredClients({});
    }
  }, [selectedMonth, clients]);

  // Считаем, сколько клиентов на каждый месяц
  const calculateMonthlyCounts = (clientsData: any[]) => {
    const counts: Record<string, number> = {};

    clientsData.forEach((client) => {
      const date = client["Дата планируемого ТО"] || client["Дата ТО"];
      if (date) {
        const clientMonth = new Date(date).toISOString().slice(0, 7);
        counts[clientMonth] = (counts[clientMonth] || 0) + 1;
      }
    });

    // Превращаем в массив для Select
    const items = Object.keys(counts)
      .sort()
      .map((month) => {
        const [year, monthNumber] = month.split("-");
        const monthName = new Date(
          parseInt(year, 10),
          parseInt(monthNumber, 10) - 1
        ).toLocaleString("ru-RU", { month: "long" });
        return {
          label: `${
            monthName.charAt(0).toUpperCase() + monthName.slice(1)
          } ${year} (${counts[month]})`,
          value: month,
        };
      });

    setDropdownItems(items);
  };

  // Фильтруем клиентов по выбранному месяцу
  const filterClientsByMonth = (clientsData: any[], month: string) => {
    const groupedClients: Record<string, any[]> = {};

    clientsData.forEach((client) => {
      const date = client["Дата планируемого ТО"] || client["Дата ТО"];
      if (date) {
        const formattedDate = new Date(date).toISOString().split("T")[0];
        const clientMonth = formattedDate.slice(0, 7);
        if (clientMonth === month) {
          if (!groupedClients[formattedDate]) {
            groupedClients[formattedDate] = [];
          }
          groupedClients[formattedDate].push(client);
        }
      }
    });

    // Сортируем ключи (даты)
    const sorted = Object.keys(groupedClients)
      .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
      .reduce<Record<string, any[]>>((acc, date) => {
        acc[date] = groupedClients[date];
        return acc;
      }, {});

    setFilteredClients(sorted);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Клиенты
      </Typography>

      <FormControl sx={{ minWidth: 240, mb: 3 }}>
        <InputLabel id="month-select-label">Выберите месяц</InputLabel>
        <Select
          labelId="month-select-label"
          value={selectedMonth}
          label="Выберите месяц"
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          <MenuItem value="">
            <em>Все месяцы</em>
          </MenuItem>
          {dropdownItems.map((item) => (
            <MenuItem key={item.value} value={item.value}>
              {item.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {Object.entries(filteredClients).map(([date, group]) => (
        <Paper key={date} sx={{ p: 2, mb: 2 }} elevation={2}>
          <RenderClientsForDate date={date} clients={group} />
        </Paper>
      ))}
    </Box>
  );
};
