import { LoadingButton } from "@mui/lab";
import {
  Box,
  Alert,
  Button,
  Stack,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useFormik } from "formik";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import * as Yup from "yup";
import userApi from "../../api/modules/user.api";
import { setAuthModalOpen } from "../../redux/features/authModalSlice";
import { setUser } from "../../redux/features/userSlice";
import { useTranslation } from "react-i18next";
import { EyeOff, Eye } from "lucide-react";

const SigninForm = ({ switchAuthState, actionState }) => {
  const dispatch = useDispatch();

  const [isLoginRequest, setIsLoginRequest] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const { t } = useTranslation();

  const [showPassword, setShowPassword] = useState(false);

  const signinForm = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .matches(
          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
          t("validation.email_invalid"),
        )
        .required(t("validation.email_required")),
      password: Yup.string()
        .min(1, t("validation.password_min"))
        .required(t("validation.password_required")),
    }),
    onSubmit: async (values) => {
      setErrorMessage(undefined);
      setIsLoginRequest(true);

      const { response, error } = await userApi.signin(values);
      setIsLoginRequest(false);

      if (response) {
        signinForm.resetForm();
        dispatch(setUser(response));
        dispatch(setAuthModalOpen(false));
        toast.success(t("success.sign_in"));
      }

      if (error) {
        setErrorMessage(error?.data || error?.errorCode);
      }
    },
  });

  return (
    <Box component="form" onSubmit={signinForm.handleSubmit}>
      <Stack spacing={3}>
        <TextField
          type="email"
          placeholder="Email"
          name="email"
          fullWidth
          value={signinForm.values.email}
          onChange={signinForm.handleChange}
          color="success"
          error={
            signinForm.touched.email && signinForm.errors.email !== undefined
          }
          helperText={signinForm.touched.email && signinForm.errors.email}
        />
        <TextField
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          name="password"
          fullWidth
          value={signinForm.values.password}
          onChange={signinForm.handleChange}
          color="success"
          error={
            signinForm.touched.password &&
            signinForm.errors.password !== undefined
          }
          helperText={signinForm.touched.password && signinForm.errors.password}
          slotProps={{
            input: {
              readOnly: false,
              onCopy: (e) => e.preventDefault(),
              onCut: (e) => e.preventDefault(),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    edge="end"
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
      </Stack>

      <LoadingButton
        type="submit"
        fullWidth
        size="large"
        variant="contained"
        sx={{ marginTop: 4 }}
        loading={isLoginRequest}
      >
        {t("topbar.sign_in")}
      </LoadingButton>
      <Button
        fullWidth
        sx={{ marginTop: 1 }}
        onClick={() => {
          switchAuthState(actionState.signup);
        }}
      >
        {t("topbar.sign_up")}
      </Button>
      <Button
        fullWidth
        sx={{ marginTop: 1 }}
        onClick={() => switchAuthState(actionState.forgotPassword)}
      >
        {t("topbar.forgot_password")}
      </Button>

      {errorMessage &&
        (typeof errorMessage === "string" ? (
          <Box sx={{ mt: 2 }}>
            <Alert severity="warning" variant="outlined">
              {t(`error_code.${errorMessage}`)}
            </Alert>
          </Box>
        ) : (
          Object.entries(errorMessage).map(([key, value]) => (
            <Box key={key} sx={{ mt: 2 }}>
              <Alert severity="warning" variant="outlined">
                {t(`dto_validation_error.${value}`)}
              </Alert>
            </Box>
          ))
        ))}
    </Box>
  );
};

export default SigninForm;
