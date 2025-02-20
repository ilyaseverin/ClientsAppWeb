/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { Box, Container, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useClients } from "../contexts/ClientsContext";
import { ClientCard } from "../components/ClientCard";
import { useDebounce } from "../hooks/useDebounce";

export default function SearchClientPage() {
  const { clients } = useClients();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebounce(searchQuery, 500);

  // Мемоизированная фильтрация списка клиентов
  const filtered = useMemo(() => {
    if (debouncedQuery.trim().length < 3) return [];
    const lower = debouncedQuery.toLowerCase();
    return clients.filter((client) =>
      Object.values(client).some((val) =>
        String(val).toLowerCase().includes(lower)
      )
    );
  }, [debouncedQuery, clients]);

  // Состояние для количества отображаемых элементов
  const [visibleCount, setVisibleCount] = useState(10);

  // Если изменился фильтр, сбрасываем visibleCount
  useEffect(() => {
    setVisibleCount(10);
  }, [filtered]);

  // IntersectionObserver для подгрузки новых элементов
  const observer = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && visibleCount < filtered.length) {
          // Добавляем еще 20 элементов, или до конца списка
          setVisibleCount((prev) => Math.min(prev + 10, filtered.length));
        }
      });

      if (node) observer.current.observe(node);
    },
    [filtered, visibleCount]
  );

  return (
    <Container sx={{ my: 4 }}>
      <Typography variant="h5" gutterBottom>
        Поиск клиентов
      </Typography>

      <TextField
        label="Введите текст для поиска"
        variant="outlined"
        fullWidth
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ mb: 2 }}
      />

      {!searchQuery.trim() ? (
        <Typography variant="body1" color="text.secondary">
          Начните вводить текст для поиска...
        </Typography>
      ) : filtered.length > 0 ? (
        <>
          {filtered.slice(0, visibleCount).map((client) => (
            <Box key={client.id} sx={{ mb: 2 }}>
              <ClientCard
                client={client}
                onClick={() => navigate(`/client-detail/${client.id}`)}
              />
            </Box>
          ))}
          {/* Элемент для наблюдения за прокруткой */}
          <div ref={loadMoreRef} />
        </>
      ) : (
        <Typography variant="body1" color="text.secondary">
          Ничего не найдено
        </Typography>
      )}
    </Container>
  );
}
