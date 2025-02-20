/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Box, Typography, Stack, useTheme } from "@mui/material";
import { ClientCard } from "./ClientCard";
import { useNavigate } from "react-router-dom";

interface RenderClientsForDateProps {
  date: string;
  clients: any[];
}

export const RenderClientsForDate: React.FC<RenderClientsForDateProps> = ({
  date,
  clients,
}) => {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <Box>
      <Typography
        variant="h6"
        sx={{
          fontWeight: "bold",
          mb: 2,
          color:theme.palette.primary.main
        }}
      >
        {new Date(date).toLocaleDateString("ru-RU", {
          weekday: "short",
          day: "numeric",
          month: "long",
        })}
      </Typography>

      <Stack spacing={2}>
        {clients.map((client) => (
          <ClientCard
            key={client.id}
            client={client}
            onClick={() => navigate(`/client-detail/${client.id}`)}
          />
        ))}
      </Stack>
    </Box>
  );
};
