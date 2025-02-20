/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Paper,
  Stack,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig"; // ваш конфиг
import { useClients } from "../contexts/ClientsContext"; // ваш контекст
import { fieldGroups } from "../utils/fieldGroups"; // группы полей

// Импорт компонентов DatePicker из MUI X
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

// Проверка, что дата в формате YYYY-MM-DD реальная
function isRealDate(value: string) {
  if (!value) return true; // пусть пустая строка не ломает логику
  const [yearStr, monthStr, dayStr] = value.split("-");
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);
  const day = parseInt(dayStr, 10);
  const dateObj = new Date(year, month - 1, day);
  return (
    dateObj.getFullYear() === year &&
    dateObj.getMonth() === month - 1 &&
    dateObj.getDate() === day
  );
}

export const ClientDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateClient: updateClientInContext, deleteClient } = useClients();

  const [clientData, setClientData] = useState<any>(null);
  const [originalData, setOriginalData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // Модальные окна:
  const [errorDialog, setErrorDialog] = useState({
    open: false,
    title: "",
    message: "",
  });
  const [successDialog, setSuccessDialog] = useState({
    open: false,
    title: "",
    message: "",
  });
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [afterCloseAction, setAfterCloseAction] = useState<(() => void) | null>(
    null
  );

  useEffect(() => {
    const fetchClient = async () => {
      if (!id) {
        setLoading(false);
        return;
      }
      try {
        const docRef = doc(db, "clients", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = { id, ...docSnap.data() };
          setClientData(data);
          setOriginalData(data);
        } else {
          setErrorDialog({
            open: true,
            title: "Ошибка",
            message: "Данные клиента не найдены.",
          });
        }
      } catch (err) {
        console.error("Ошибка при загрузке клиента:", err);
        setErrorDialog({
          open: true,
          title: "Ошибка",
          message: "Не удалось загрузить данные клиента.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchClient();
  }, [id]);

  const handleCloseErrorDialog = () => {
    setErrorDialog({ open: false, title: "", message: "" });
  };
  const handleCloseSuccessDialog = () => {
    setSuccessDialog({ open: false, title: "", message: "" });
    if (afterCloseAction) {
      afterCloseAction();
      setAfterCloseAction(null);
    }
  };

  // Изменение поля. Для дат ожидаем строку формата "YYYY-MM-DD"
  const handleFieldChange = (key: string, value: string) => {
    setClientData((prev: any) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = async () => {
    if (!clientData || !clientData.id) {
      setErrorDialog({
        open: true,
        title: "Ошибка",
        message: "Отсутствует ID клиента.",
      });
      return;
    }

    // Проверяем поля "Дата ..." на валидность
    for (const group of fieldGroups) {
      for (const field of group.fields) {
        if (field.key.includes("Дата")) {
          const value = clientData[field.key];
          if (value && !isRealDate(value)) {
            setErrorDialog({
              open: true,
              title: "Ошибка",
              message: `Неверная дата в поле "${field.key}": ${value}`,
            });
            return;
          }
        }
      }
    }

    try {
      const docRef = doc(db, "clients", String(clientData.id));
      await updateDoc(docRef, clientData);
      updateClientInContext(clientData);

      setSuccessDialog({
        open: true,
        title: "Успех",
        message: "Данные клиента успешно обновлены!",
      });
      setOriginalData(clientData);
      setIsEditing(false);
    } catch (error) {
      console.error("Ошибка при обновлении клиента:", error);
      setErrorDialog({
        open: true,
        title: "Ошибка",
        message: "Не удалось обновить данные клиента.",
      });
    }
  };

  const handleCancel = () => {
    setClientData(originalData);
    setIsEditing(false);
  };

  const handleDelete = () => {
    setDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    setDeleteConfirm(false);
    try {
      if (clientData?.id) {
        const docRef = doc(db, "clients", String(clientData.id));
        await deleteDoc(docRef);
        deleteClient(clientData.id);
        setSuccessDialog({
          open: true,
          title: "Успех",
          message: "Клиент успешно удален!",
        });
        setAfterCloseAction(() => () => {
          navigate(-1);
        });
      }
    } catch (err) {
      console.error("Ошибка при удалении клиента:", err);
      setErrorDialog({
        open: true,
        title: "Ошибка",
        message: "Не удалось удалить клиента.",
      });
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (!clientData) {
    return (
      <Container>
        <Typography variant="h6" mt={2}>
          Нет данных для отображения.
        </Typography>
      </Container>
    );
  }

  return (
     <Container sx={{my:4}}>
      <Typography variant="h4" gutterBottom>
        Данные клиента
      </Typography>

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
          {/* Название группы — фиолетовое в темной теме, основной цвет в светлой */}
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
            {group.fields.map(({ key, label }) => {
              const value = clientData[key] || "";
              if (isEditing) {
                // Если поле содержит "Дата" — используем MUI DatePicker
                if (key.includes("Дата")) {
                  return (
                    <Grid item xs={12} sm={6} md={4} key={key}>
                      {/* Название поля (сероватое в темной теме, более темное в светлой) */}
                      <Typography
                        variant="subtitle1"
                        sx={{
                          mb: 0.5,
                          fontWeight: "bold",
                          color: (theme) =>
                            theme.palette.mode === "dark"
                              ? theme.palette.grey[300]
                              : theme.palette.grey[700],
                        }}
                      >
                        {label}
                      </Typography>

                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          label=""
                          // Преобразуем строку в dayjs; если значение пустое — null
                          value={value ? dayjs(value, "YYYY-MM-DD") : null}
                          onChange={(newValue) => {
                            // При выборе даты сохраняем в формате "YYYY-MM-DD"
                            const formatted = newValue
                              ? newValue.format("YYYY-MM-DD")
                              : "";
                            handleFieldChange(key, formatted);
                          }}
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              size: "small",
                              // Цвет полей на усмотрение, здесь используем стандартные MUI
                              // либо можно задать backgroundColor, если хотим
                            },
                          }}
                        />
                      </LocalizationProvider>
                    </Grid>
                  );
                } else {
                  // Обычное текстовое поле для остальных
                  return (
                    <Grid item xs={12} sm={6} md={4} key={key}>
                      {/* Название поля */}
                      <Typography
                        variant="subtitle1"
                        sx={{
                          mb: 0.5,
                          fontWeight: "bold",
                          color: (theme) =>
                            theme.palette.mode === "dark"
                              ? theme.palette.grey[400]
                              : theme.palette.grey[700],
                        }}
                      >
                        {label}
                      </Typography>

                      <TextField
                        label=""
                        size="small"
                        fullWidth
                        value={value}
                        onChange={(e) => handleFieldChange(key, e.target.value)}
                      />
                    </Grid>
                  );
                }
              } else {
                // Режим просмотра (не редактирования)
                return (
                  <Grid item xs={12} sm={6} md={4} key={key}>
                    {/* Название поля */}
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: "bold",
                        color: (theme) =>
                          theme.palette.mode === "dark"
                            ? theme.palette.grey[400]
                            : theme.palette.grey[700],
                      }}
                    >
                      {label}
                    </Typography>

                    {/* Значение поля — с небольшим отступом слева */}
                    <Typography
                      variant="body1"
                      sx={{
                        ml: 1,
                        color: (theme) =>
                          theme.palette.mode === "dark"
                            ? theme.palette.common.white
                            : theme.palette.text.primary,
                      }}
                    >
                      {value || "—"}
                    </Typography>
                  </Grid>
                );
              }
            })}
          </Grid>
        </Paper>
      ))}

      <Stack direction="row" spacing={2}>
        {isEditing ? (
          <>
            <Button variant="contained" color="primary" onClick={handleSave}>
              Сохранить
            </Button>
            <Button variant="outlined" color="inherit" onClick={handleCancel}>
              Отменить
            </Button>
          </>
        ) : (
          <>
            <Button variant="contained" onClick={() => setIsEditing(true)}>
              Редактировать
            </Button>
            <Button variant="contained" color="error" onClick={handleDelete}>
              Удалить клиента
            </Button>
          </>
        )}
      </Stack>

      {/* Диалог подтверждения удаления */}
      <Dialog open={deleteConfirm} onClose={() => setDeleteConfirm(false)}>
        <DialogTitle>Удаление клиента</DialogTitle>
        <DialogContent>
          <Typography>Вы уверены, что хотите удалить этого клиента?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirm(false)}>Отмена</Button>
          <Button color="error" onClick={confirmDelete}>
            Удалить
          </Button>
        </DialogActions>
      </Dialog>

      {/* Диалог ошибки */}
      <Dialog open={errorDialog.open} onClose={handleCloseErrorDialog}>
        <DialogTitle>{errorDialog.title}</DialogTitle>
        <DialogContent>
          <Typography>{errorDialog.message}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseErrorDialog}>OK</Button>
        </DialogActions>
      </Dialog>

      {/* Диалог успеха */}
      <Dialog open={successDialog.open} onClose={handleCloseSuccessDialog}>
        <DialogTitle>{successDialog.title}</DialogTitle>
        <DialogContent>
          <Typography>{successDialog.message}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSuccessDialog}>OK</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};
