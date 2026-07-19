import { LoadingButton } from "@mui/lab";
import {
  Alert,
  Box,
  Button,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

import userApi from "../../api/modules/user.api";
import OtpInput from "./OtpInput";
import { setAuthModalOpen } from "../../redux/features/authModalSlice";
import { setUser } from "../../redux/features/userSlice";
import calculateRemainingTime from "../../utils/calculateRemainingTime.utils";

const VerifyOtpForm = ({ authData, switchAuthState, actionState }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [otpCode, setOtpCode] = useState("");

  const [remainingTime, setRemainingTime] = useState(
    calculateRemainingTime(authData.otpExpireAt),
  );

  const [isVerifyRequest, setIsVerifyRequest] = useState(false);
  const [isResendRequest, setIsResendRequest] = useState(false);

  const [errorMessage, setErrorMessage] = useState();

  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingTime(calculateRemainingTime(authData.otpExpireAt));
    }, 1000);

    return () => clearInterval(interval);
  }, [authData.otpExpireAt]);

  const handleVerify = async () => {
    setErrorMessage(undefined);

    if (otpCode.length !== 6) {
      setErrorMessage(t("validation.otp_invalid"));
      return;
    }

    setIsVerifyRequest(true);

    const { response, error } = await userApi.verifyOtp({
      email: authData.email,
      otpCode,
    });

    setIsVerifyRequest(false);

    if (response) {
      dispatch(setUser(response));
      dispatch(setAuthModalOpen(false));

      toast.success(t("success.sign_up"));
    }

    if (error) {
      setErrorMessage(error.message);
      setOtpCode("");
    }
  };

  const handleResendOtp = async () => {
    setErrorMessage(undefined);

    setIsResendRequest(true);

    const { response, error } = await userApi.resendOtp({
      email: authData.email,
    });

    setIsResendRequest(false);

    if (response) {
      setRemainingTime(calculateRemainingTime(response.otpExpireAt));

      switchAuthState(actionState.verifyOtp, {
        otpExpireAt: response.otpExpireAt,
      });

      setOtpCode("");

      toast.success(t("success.otp_sent"));
    }

    if (error) {
      setErrorMessage(error?.data || error?.errorCode);
    }
  };

  const minutes = String(Math.floor(remainingTime / 60)).padStart(2, "0");

  const seconds = String(remainingTime % 60).padStart(2, "0");

  return (
    <Box>
      <Stack spacing={3}>
        <TextField value={authData.email} disabled fullWidth />

        <OtpInput value={otpCode} onChange={setOtpCode} />

        <Typography
          textAlign="center"
          color={remainingTime > 0 ? "text.secondary" : "error"}
        >
          {remainingTime > 0
            ? `${t("otp.expire_in")} ${minutes}:${seconds}`
            : t("otp.expired")}
        </Typography>
      </Stack>

      <LoadingButton
        fullWidth
        variant="contained"
        sx={{ mt: 4 }}
        loading={isVerifyRequest}
        color="primary"
        disabled={remainingTime <= 0}
        onClick={handleVerify}
      >
        {t("topbar.verify_otp")}
      </LoadingButton>

      <LoadingButton
        fullWidth
        sx={{ mt: 1 }}
        disabled={remainingTime > 0}
        variant="outlined"
        color="primary"
        loading={isResendRequest}
        onClick={handleResendOtp}
      >
        {t("topbar.resend_otp")}
      </LoadingButton>

      <Button
        fullWidth
        sx={{ mt: 1 }}
        onClick={() => switchAuthState(actionState.signup)}
      >
        {t("topbar.sign_up")}
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

export default VerifyOtpForm;
