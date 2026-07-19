import { LoadingButton } from "@mui/lab";
import {
  Alert,
  Box,
  Button,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
} from "@mui/material";
import { useFormik } from "formik";
import { useState } from "react";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { Eye, EyeOff, Icon } from "lucide-react";

import userApi from "../../api/modules/user.api";

const SignupForm = ({ switchAuthState, actionState }) => {
  const [isSignupRequest, setIsSignupRequest] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { t } = useTranslation();

  const signupForm = useFormik({
    initialValues: {
      email: "",
      name: "",
      password: "",
      confirmPassword: "",
    },

    validationSchema: Yup.object({
      email: Yup.string()
        .matches(
          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
          t("validation.email_invalid"),
        )
        .required(t("validation.email_required")),

      name: Yup.string()
        .min(1, t("validation.name_min"))
        .required(t("validation.name_required")),

      password: Yup.string()
        .min(1, t("validation.password_min"))
        .required(t("validation.password_required")),

      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], t("validation.confirmPassword_match"))
        .min(1, t("validation.confirmPassword_min"))
        .required(t("validation.confirmPassword_required")),
    }),

    onSubmit: async (values) => {
      setErrorMessage(null);
      setIsSignupRequest(true);

      const payload = {
        email: values.email,
        name: values.name,
        password: values.password,
      };

      const { response, error } = await userApi.signup(payload);

      setIsSignupRequest(false);

      if (response) {
        signupForm.resetForm();

        toast.success(t("success.otp_sent"));

        switchAuthState(actionState.verifyOtp, {
          email: values.email,
          otpExpireAt: response.otpExpireAt,
        });
      }

      if (error) {
        console.log(error.message);
        setErrorMessage(error?.data || error?.errorCode);
      }
    },
  });

  return (
    <Box component="form" onSubmit={signupForm.handleSubmit}>
      <Stack spacing={3}>
        <TextField
          type="email"
          placeholder="Email"
          name="email"
          fullWidth
          value={signupForm.values.email}
          onChange={signupForm.handleChange}
          color="success"
          error={
            signupForm.touched.email && signupForm.errors.email !== undefined
          }
          helperText={signupForm.touched.email && signupForm.errors.email}
        />

        <TextField
          type="text"
          placeholder="Display name"
          name="name"
          fullWidth
          value={signupForm.values.name}
          onChange={signupForm.handleChange}
          color="success"
          error={
            signupForm.touched.name && signupForm.errors.name !== undefined
          }
          helperText={signupForm.touched.name && signupForm.errors.name}
        />

        <TextField
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          name="password"
          fullWidth
          value={signupForm.values.password}
          onChange={signupForm.handleChange}
          color="success"
          error={
            signupForm.touched.password &&
            signupForm.errors.password !== undefined
          }
          helperText={signupForm.touched.password && signupForm.errors.password}
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

        <TextField
          type={showConfirmPassword ? "text" : "password"}
          placeholder="Confirm password"
          name="confirmPassword"
          fullWidth
          value={signupForm.values.confirmPassword}
          onChange={signupForm.handleChange}
          color="success"
          error={
            signupForm.touched.confirmPassword &&
            signupForm.errors.confirmPassword !== undefined
          }
          helperText={
            signupForm.touched.confirmPassword &&
            signupForm.errors.confirmPassword
          }
          slotProps={{
            input: {
              readOnly: false,
              onCopy: (e) => e.preventDefault(),
              onCut: (e) => e.preventDefault(),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    edge="end"
                  >
                    {showConfirmPassword ? <EyeOff /> : <Eye />}
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
        loading={isSignupRequest}
      >
        {t("topbar.sign_up")}
      </LoadingButton>

      <Button
        fullWidth
        sx={{ marginTop: 1 }}
        onClick={() => switchAuthState(actionState.signin)}
      >
        {t("topbar.sign_in")}
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

export default SignupForm;
