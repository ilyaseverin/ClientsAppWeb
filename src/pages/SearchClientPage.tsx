/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/SearchClientPage.tsx
import { useClients } from "../contexts/ClientsContext";
import {
  Box,
  TextField,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemButton,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SearchClientPage() {
  const { clients } = useClients();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [filtered, setFiltered] = useState<any[]>([]);

  // простой вариант debounce:
  const [timer, setTimer] = useState<any>(null);

  const handleChange = (value: string) => {
    setSearchQuery(value);
    if (timer) clearTimeout(timer);

    const newTimer = setTimeout(() => {
      performSearch(value);
    }, 500);

    setTimer(newTimer);
  };

  const performSearch = (query: string) => {
    if (!query.trim()) {
      setFiltered([]);
      return;
    }
    const lower = query.toLowerCase();
    const result = clients.filter((c) =>
      Object.values(c).some((val) => String(val).toLowerCase().includes(lower))
    );
    setFiltered(result);
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Поиск клиентов
      </Typography>

      <TextField
        label="Введите текст для поиска"
        fullWidth
        value={searchQuery}
        onChange={(e) => handleChange(e.target.value)}
        sx={{ mb: 2 }}
      />

      {!searchQuery.trim() ? (
        <Typography>Начните вводить текст...</Typography>
      ) : filtered.length > 0 ? (
        <List>
          {filtered.map((client) => (
            <ListItem key={client.id} disablePadding>
              <ListItemButton onClick={() => navigate(`/client/${client.id}`)}>
                <Card sx={{ width: "100%" }}>
                  <CardContent>
                    <Typography variant="h6">
                      {client["ФИО"] || "Без имени"}
                    </Typography>
                    <Typography variant="body2">
                      {client["Телефон"] || ""}
                    </Typography>
                  </CardContent>
                </Card>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography>Ничего не найдено</Typography>
      )}
    </Box>
  );
}
