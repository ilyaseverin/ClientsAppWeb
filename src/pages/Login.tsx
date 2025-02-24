import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  CircularProgress,
} from "@mui/material";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

interface LoginFormInputs {
  email: string;
  password: string;
}

const schema = yup.object().shape({
  email: yup
    .string()
    .required("Email обязателен")
    .email("Неверный формат email"),
  password: yup.string().required("Пароль обязателен"),
});

export const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>({
    resolver: yupResolver(schema),
  });

  const [loginError, setLoginError] = React.useState<string | null>(null);

  const onSubmit = async (data: LoginFormInputs) => {
    setLoginError(null);
    try {
      await login(data.email, data.password);
      navigate("/home");
    } catch (error) {
      setLoginError((error as Error).message);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Typography variant="h5" gutterBottom>
        Вход
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        display="flex"
        flexDirection="column"
        gap={2}
        noValidate
      >
        <TextField
          label="Email"
          fullWidth
          {...register("email")}
          error={Boolean(errors.email) || Boolean(loginError)}
          helperText={errors.email?.message}
        />

        <TextField
          label="Пароль"
          type="password"
          fullWidth
          {...register("password")}
          error={Boolean(errors.password) || Boolean(loginError)}
          helperText={errors.password?.message}
        />

        {loginError && (
          <Typography variant="body2" color="error">
            {loginError}
          </Typography>
        )}

        <Button
          variant="contained"
          type="submit"
          disabled={isSubmitting}
          sx={{ py: 1.5 }}
        >
          {isSubmitting ? <CircularProgress size={24} /> : "Войти"}
        </Button>
      </Box>
    </Container>
  );
};

export default Login;
