/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/HomeScreen.tsx
import React, { useEffect, useState } from "react";
import { Typography, Paper, Container } from "@mui/material";
import { useClients } from "../contexts/ClientsContext";
import { RenderClientsForDate } from "../components/renderClientsForDate";
import { calculateUpcomingClients } from "../utils/clientsUtils";

export const HomePage: React.FC = () => {
  const { clients } = useClients();
  const [upcomingClients, setUpcomingClients] = useState<Record<string, any[]>>(
    {}
  );

  useEffect(() => {
    if (clients.length > 0) {
      const grouped = calculateUpcomingClients(clients);
      setUpcomingClients(grouped);
    }
  }, [clients]);

  return (
    <Container sx={{ my: 4 }}>
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
    </Container>
  );
};
