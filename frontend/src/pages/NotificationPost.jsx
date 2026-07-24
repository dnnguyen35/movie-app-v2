import { LoadingButton } from "@mui/lab";
import { Box, Stack, TextField } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

import Container from "../components/common/Container";
import uiConfigs from "../configs/ui.configs";
import adminApi from "../api/modules/admin.api";
import { useSelector } from "react-redux";
import DontHavePermission from "./admin/components/DontHavePermission";

const NotificationPost = () => {
  const { user } = useSelector((state) => state.user);

  const [onRequest, setOnRequest] = useState(false);

  const { t } = useTranslation();

  const form = useFormik({
    initialValues: {
      notificationMessage: "",
    },
    validationSchema: Yup.object({
      notificationMessage: Yup.string().required(
        t("validation.notification_message_required"),
      ),
    }),
    onSubmit: async (values) => handlePostNotification(values),
  });

  const handlePostNotification = async (values) => {
    if (onRequest) return;

    setOnRequest(true);
    const { response, error } = await adminApi.postNotification(values);
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
      toast.success(t("success.post_notification_success"));
    }
  };

  if (!user || !user.roles.includes("ROLE_ADMIN"))
    return <DontHavePermission />;

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
      <Container header={t("user.post_notification")}>
        <Box
          component="form"
          maxWidth="900px"
          onSubmit={form.handleSubmit}
          sx={{ width: { md: "150%" } }}
        >
          <Stack spacing={2}>
            <TextField
              type="text"
              multiline
              minRows={3}
              maxRows={5}
              placeholder="Content"
              name="notificationMessage"
              fullWidth
              value={form.values.notificationMessage}
              onChange={form.handleChange}
              color="success"
              error={
                form.touched.notificationMessage &&
                form.errors.notificationMessage !== undefined
              }
              helperText={
                form.touched.notificationMessage &&
                form.errors.notificationMessage
              }
            />

            <LoadingButton
              type="submit"
              variant="contained"
              fullWidth
              sx={{ marginTop: 4 }}
              loading={onRequest}
            >
              {t("user.post_notification")}
            </LoadingButton>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default NotificationPost;
