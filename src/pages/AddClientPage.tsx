/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
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
    <Box sx={{ p: 2, maxWidth: 800, margin: "0 auto" }}>
      <Typography variant="h4" gutterBottom>
        Добавить клиента
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        sx={{ mt: 2 }}
      >
        {fieldGroups.map((group) => (
          <Box key={group.groupTitle} sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              {group.groupTitle}
            </Typography>

            <Grid container spacing={2}>
              {group.fields.map(({ key, label }) => (
                <Grid item xs={12} sm={6} key={key}>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    {label}
                  </Typography>

                  <Controller
                    control={control}
                    name={key}
                    render={({ field: { onChange, value } }) => {
                      if (key.includes("Дата")) {
                        return (
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                              label={label}
                              // Преобразуем строку в Dayjs для отображения
                              value={value ? dayjs(value, "YYYY-MM-DD") : null}
                              onChange={(newValue) => {
                                // Сразу преобразовываем в строку "YYYY-MM-DD"
                                onChange(
                                  newValue ? newValue.format("YYYY-MM-DD") : ""
                                );
                              }}
                              slotProps={{
                                textField: {
                                  fullWidth: true,
                                  label,
                                  error: !!errors[key],
                                  helperText: errors[key]?.message as string,
                                },
                              }}
                            />
                          </LocalizationProvider>
                        );
                      }
                      return (
                        <TextField
                          fullWidth
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
          </Box>
        ))}

        <Box mt={3}>
          <Button variant="contained" type="submit">
            Добавить клиента
          </Button>
        </Box>
      </Box>

      <Dialog open={dialogOpen} onClose={closeDialog}>
        <DialogTitle>{dialogTitle}</DialogTitle>
        <DialogContent>
          <Typography>{dialogMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>OK</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
