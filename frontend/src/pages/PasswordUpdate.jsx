import { LoadingButton } from "@mui/lab";
import {
  Box,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import Container from "../components/common/Container";
import uiConfigs from "../configs/ui.configs";
import { useState } from "react";
import userApi from "../api/modules/user.api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/features/userSlice";
import { setAuthModalOpen } from "../redux/features/authModalSlice";
import { useTranslation } from "react-i18next";
import { Eye, EyeOff } from "lucide-react";

const PasswordUpdate = () => {
  const [onRequest, setOnRequest] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const form = useFormik({
    initialValues: {
      password: "",
      newPassword: "",
      confirmNewPassword: "",
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .min(1, t("validation.password_min"))
        .required(t("validation.password_required")),
      newPassword: Yup.string()
        .min(1, t("validation.newPassword_min"))
        .required(t("validation.newPassword_required")),
      confirmNewPassword: Yup.string()
        .oneOf(
          [Yup.ref("newPassword")],
          t("validation.confirmNewPassword_match"),
        )
        .min(1, t("validation.confirmNewPassword_min"))
        .required(t("validation.confirmNewPassword_required")),
    }),
    onSubmit: async (values) => onUpdate(values),
  });

  const onUpdate = async (values) => {
    if (onRequest) return;

    setOnRequest(true);
    const { response, error } = await userApi.passwordUpdate(values);
    setOnRequest(false);

    if (error) {
      const errorMessage = error.errorCode;

      if (typeof errorMessage === "string") {
        toast.error(t(`error_code.${errorMessage}`));
      } else {
        Object.entries(errorMessage).forEach(([key, value]) => {
          toast.error(t(`dto_validation_error.${value}`));
        });
      }
    }

    if (response) {
      form.resetForm();
      navigate("/");
      dispatch(setUser(null));
      // dispatch(setAuthModalOpen(true));
      toast.success("Password changed successfully. Please login again ");
    }
  };

  return (
    <Box
      sx={{
        ...uiConfigs.style.mainContent,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "50vh",
      }}
    >
      <Container header={t("update_password")}>
        <Box
          component="form"
          maxWidth="900px"
          onSubmit={form.handleSubmit}
          sx={{ width: { md: "150%" } }}
        >
          <Stack spacing={2}>
            <TextField
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              name="password"
              fullWidth
              value={form.values.password}
              onChange={form.handleChange}
              color="success"
              error={
                form.touched.password && form.errors.password !== undefined
              }
              helperText={form.touched.password && form.errors.password}
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
              type={showNewPassword ? "text" : "password"}
              placeholder="New password"
              name="newPassword"
              fullWidth
              value={form.values.newPassword}
              onChange={form.handleChange}
              color="success"
              error={
                form.touched.newPassword &&
                form.errors.newPassword !== undefined
              }
              helperText={form.touched.newPassword && form.errors.newPassword}
              slotProps={{
                input: {
                  readOnly: false,
                  onCopy: (e) => e.preventDefault(),
                  onCut: (e) => e.preventDefault(),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        type="button"
                        onClick={() => setShowNewPassword((prev) => !prev)}
                        edge="end"
                      >
                        {showNewPassword ? <EyeOff /> : <Eye />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
            <TextField
              type={showNewPassword ? "text" : "password"}
              placeholder="Confirm new password"
              name="confirmNewPassword"
              fullWidth
              value={form.values.confirmNewPassword}
              onChange={form.handleChange}
              color="success"
              error={
                form.touched.confirmNewPassword &&
                form.errors.confirmNewPassword !== undefined
              }
              helperText={
                form.touched.confirmNewPassword &&
                form.errors.confirmNewPassword
              }
            />

            <LoadingButton
              type="submit"
              variant="contained"
              fullWidth
              sx={{ marginTop: 4 }}
              loading={onRequest}
            >
              {t("update_password")}
            </LoadingButton>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default PasswordUpdate;
