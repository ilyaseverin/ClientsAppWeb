/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Typography } from "@mui/material";
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

  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
        {new Date(date).toLocaleDateString("ru-RU", {
          weekday: "short",
          day: "numeric",
          month: "long",
        })}
      </Typography>

      {clients.map((client) => (
        <ClientCard
          key={client.id}
          client={client}
          onClick={() => navigate(`/client-detail/${client.id}`)}
        />
      ))}
    </Box>
  );
};
