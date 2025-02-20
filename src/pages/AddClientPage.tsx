/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import {
  Container,
  Paper,
  Box,
  Typography,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
} from "@mui/material";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import { useForm, Controller } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig"; // <-- поправьте путь
import { useClients } from "../contexts/ClientsContext"; // <-- поправьте путь
import { fieldGroups } from "../utils/fieldGroups"; // <-- поправьте путь

import dayjs from "dayjs";

// Интерфейс формы. Все даты теперь храним как строки в формате "YYYY-MM-DD"
export interface FormData {
  [key: string]: any;
  ФИО: string;
  "Дата ТО": string; // дата хранится как строка "YYYY-MM-DD"
  // ... другие поля при необходимости
}

// Yup-схема для валидации даты в формате "YYYY-MM-DD"
const clientSchema = Yup.object().shape({
  ФИО: Yup.string().required("ФИО обязательно"),
  "Дата ТО": Yup.string()
    .required("Дата ТО обязательна")
    .matches(/^\d{4}-\d{2}-\d{2}$/, "Неверный формат (YYYY-MM-DD)")
    .test("is-valid-date", "Дата не существует", (value) =>
      value ? dayjs(value, "YYYY-MM-DD", true).isValid() : false
    ),
});

export const AddClientPage: React.FC = () => {
  const { addClient } = useClients();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(clientSchema),
    defaultValues: Object.fromEntries(
      fieldGroups.flatMap((group) =>
        group.fields.map((field) => {
          // Для полей с датой задаем пустую строку
          if (field.key.includes("Дата")) {
            return [field.key, ""];
          }
          return [field.key, ""];
        })
      )
    ) as FormData,
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogMessage, setDialogMessage] = useState("");

  const closeDialog = () => {
    setDialogOpen(false);
  };

  // При сабмите данные уже содержат дату в виде строки "YYYY-MM-DD"
  const onSubmit = async (data: FormData) => {
    try {
      const docRef = await addDoc(collection(db, "clients"), data);
      addClient({ id: docRef.id, ...data });

      setDialogTitle("Успех");
      setDialogMessage("Клиент успешно добавлен!");
      setDialogOpen(true);

      reset();
    } catch (error) {
      console.error("Ошибка при добавлении клиента:", error);
      setDialogTitle("Ошибка");
      setDialogMessage("Не удалось добавить клиента.");
      setDialogOpen(true);
    }
  };

  return (
    <Container sx={{my:4}}>
      <Typography variant="h4" gutterBottom>
        Добавить клиента
      </Typography>

      {/* Форма добавления клиента */}
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        {fieldGroups.map((group) => (
          <Paper
            key={group.groupTitle}
            elevation={2}
            sx={{
              p: 2,
              mb: 3,
              borderRadius: 2,
              bgcolor: (theme) =>
                theme.palette.mode === "light" ? "#fafafa" : "inherit",
            }}
          >
            <Typography
                        variant="h6"
                        gutterBottom
                        sx={{
                          fontWeight: "bold",
                          color: (theme) =>
                            theme.palette.mode === "dark"
                              ? theme.palette.primary.main // фиолетовый для темной темы
                              : theme.palette.primary.main, // "основной" цвет в светлой теме
                        }}
                      >
              {group.groupTitle}
            </Typography>

            <Grid container spacing={2}>
              {group.fields.map(({ key, label }) => (
                <Grid item xs={12} sm={6} md={4} key={key}>
                  <Typography
                                        variant="subtitle1"
                                        sx={{
                                          fontWeight: "bold",
                                          mb:0.5,
                                          color: (theme) =>
                                            theme.palette.mode === "dark"
                                              ? theme.palette.grey[400]
                                              : theme.palette.grey[700],
                                        }}
                                      >
                    {label}
                  </Typography>

                  <Controller
                    control={control}
                    name={key}
                    render={({ field: { onChange, value } }) => {
                      // Поле с датой
                      if (key.includes("Дата")) {
                        return (
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                              label=""
                              value={value ? dayjs(value, "YYYY-MM-DD") : null}
                              onChange={(newValue) => {
                                const formatted = newValue
                                  ? newValue.format("YYYY-MM-DD")
                                  : "";
                                onChange(formatted);
                              }}
                              slotProps={{
                                textField: {
                                  fullWidth: true,
                                  size: "small",
                                  error: !!errors[key],
                                  helperText: errors[key]?.message as string,
                                },
                              }}
                            />
                          </LocalizationProvider>
                        );
                      }

                      // Обычное текстовое поле
                      return (
                        <TextField
                          fullWidth
                          size="small"
                          placeholder={`Введите ${label}`}
                          value={value || ""}
                          onChange={(e) => onChange(e.target.value)}
                          error={!!errors[key]}
                          helperText={errors[key]?.message as string}
                        />
                      );
                    }}
                  />
                </Grid>
              ))}
            </Grid>
          </Paper>
        ))}

        <Stack direction="row" spacing={2}>
          <Button variant="contained" type="submit" color="primary">
            Добавить клиента
          </Button>
        </Stack>
      </Box>

      {/* Диалог с результатом */}
      <Dialog open={dialogOpen} onClose={closeDialog}>
        <DialogTitle>{dialogTitle}</DialogTitle>
        <DialogContent>
          <Typography>{dialogMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>OK</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};
