import { LoadingButton } from "@mui/lab";
import { Alert, Box, Button, Stack, TextField } from "@mui/material";
import { useFormik } from "formik";
import { useState } from "react";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

import userApi from "../../api/modules/user.api";

const ForgotPasswordForm = ({ switchAuthState, actionState }) => {
  const { t } = useTranslation();

  const [isRequesting, setIsRequesting] = useState(false);
  const [errorMessage, setErrorMessage] = useState();

  const forgotPasswordForm = useFormik({
    initialValues: {
      email: "",
    },

    validationSchema: Yup.object({
      email: Yup.string()
        .matches(
          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
          t("validation.email_invalid"),
        )
        .required(t("validation.email_required")),
    }),

    onSubmit: async (values) => {
      setErrorMessage(undefined);
      setIsRequesting(true);

      const { response, error } = await userApi.resetPassword({
        email: values.email,
      });

      setIsRequesting(false);

      if (response) {
        forgotPasswordForm.resetForm();

        toast.success(t("success.reset_password"));

        switchAuthState(actionState.signin);
      }

      if (error) {
        setErrorMessage(error?.data || error?.errorCode);
      }
    },
  });

  return (
    <Box component="form" onSubmit={forgotPasswordForm.handleSubmit}>
      <Stack spacing={3}>
        <TextField
          type="email"
          placeholder="Email"
          name="email"
          fullWidth
          value={forgotPasswordForm.values.email}
          onChange={forgotPasswordForm.handleChange}
          color="success"
          error={
            forgotPasswordForm.touched.email &&
            forgotPasswordForm.errors.email !== undefined
          }
          helperText={
            forgotPasswordForm.touched.email && forgotPasswordForm.errors.email
          }
        />
      </Stack>

      <LoadingButton
        type="submit"
        fullWidth
        size="large"
        variant="contained"
        sx={{ mt: 4 }}
        loading={isRequesting}
      >
        {t("topbar.reset_password")}
      </LoadingButton>

      <Button
        fullWidth
        sx={{ mt: 1 }}
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

export default ForgotPasswordForm;
