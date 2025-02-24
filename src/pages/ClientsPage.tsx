/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/ClientsPage.tsx

import React, { useState, useEffect } from "react";
import {
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  Container,
} from "@mui/material";
import { useSearchParams } from "react-router-dom"; // для работы с query
import { useClients } from "../contexts/ClientsContext";

import {
  calculateMonthlyCounts,
  filterClientsByMonth,
} from "../utils/clientsUtils";
import { RenderClientsForDate } from "../components/renderClientsForDate";

export const ClientsPage: React.FC = () => {
  const { clients } = useClients();
  const [filteredClients, setFilteredClients] = useState<Record<string, any[]>>(
    {}
  );
  const [dropdownItems, setDropdownItems] = useState<any[]>([]);

  // Инициализация selectedMonth из query-параметра
  const [searchParams, setSearchParams] = useSearchParams();
  const initialMonth = searchParams.get("month") || "";
  const [selectedMonth, setSelectedMonth] = useState<string>(initialMonth);

  // При изменении списка клиентов — пересчитываем выпадающий список
  useEffect(() => {
    if (clients.length) {
      const items = calculateMonthlyCounts(clients);
      setDropdownItems(items);
    }
  }, [clients]);

  // При изменении selectedMonth — сохраняем в URL и фильтруем
  useEffect(() => {
    if (selectedMonth) {
      searchParams.set("month", selectedMonth);
      setSearchParams(searchParams);
      const filtered = filterClientsByMonth(clients, selectedMonth);
      setFilteredClients(filtered);
    } else {
      searchParams.delete("month");
      setSearchParams(searchParams);
      setFilteredClients({});
    }
  }, [selectedMonth, clients, searchParams, setSearchParams]);

  return (
    <Container sx={{ my: 4 }}>
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
    </Container>
  );
};

export default ClientsPage;
