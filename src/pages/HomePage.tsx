/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/HomeScreen.tsx
import React, { useEffect, useState } from "react";
import { Box, Typography, Paper } from "@mui/material";
import { useClients } from "../contexts/ClientsContext";
import { RenderClientsForDate } from "../components/renderClientsForDate";

export const HomePage: React.FC = () => {
  const { clients } = useClients();
  const [upcomingClients, setUpcomingClients] = useState<Record<string, any[]>>(
    {}
  );

  useEffect(() => {
    if (clients.length > 0) {
      calculateUpcomingClients(clients);
    }
  }, [clients]);

  const calculateUpcomingClients = (clientsData: any[]) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    const grouped: Record<string, any[]> = {};

    clientsData.forEach((client) => {
      const dateStr = client["Дата планируемого ТО"] || client["Дата ТО"];
      if (dateStr) {
        const dateObj = new Date(dateStr);
        dateObj.setHours(0, 0, 0, 0);

        // Логика вычисления "следующий год", если дата уже прошла
        const targetMonth = dateObj.getMonth();
        const targetDay = dateObj.getDate();
        let targetYear = today.getFullYear();

        const adjustedDate = new Date(targetYear, targetMonth, targetDay);
        if (adjustedDate < today) {
          targetYear += 1;
        }
        const finalDate = new Date(targetYear, targetMonth, targetDay);

        if (finalDate >= today && finalDate <= nextWeek) {
          const formattedDate = finalDate.toISOString().split("T")[0];
          if (!grouped[formattedDate]) {
            grouped[formattedDate] = [];
          }
          grouped[formattedDate].push(client);
        }
      }
    });

    setUpcomingClients(grouped);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Клиенты на ближайшие 7 дней
      </Typography>

      {Object.keys(upcomingClients).length === 0 ? (
        <Typography>Нет клиентов на ближайшие 7 дней.</Typography>
      ) : (
        Object.entries(upcomingClients).map(([date, group]) => (
          <Paper key={date} sx={{ p: 2, mb: 2 }}>
            <RenderClientsForDate date={date} clients={group} />
          </Paper>
        ))
      )}
    </Box>
  );
};
