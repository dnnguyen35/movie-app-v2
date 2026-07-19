import { Box, Modal } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAuthModalOpen } from "../../redux/features/authModalSlice";
import Logo from "./Logo";
import SigninForm from "./SigninForm";
import SignupForm from "./SignupForm";
import VerifyOtpForm from "./VerifyOtpForm";
import ForgotPasswordForm from "./ForgotPasswordForm";

const actionState = {
  signin: "signin",
  signup: "signup",
  verifyOtp: "verifyOtp",
  forgotPassword: "forgotPassword",
};

const AuthModal = () => {
  const { authModalOpen } = useSelector((state) => state.authModal);

  const dispatch = useDispatch();

  const [action, setAction] = useState(actionState.signin);

  const [authData, setAuthData] = useState({
    email: "",
    otpExpireAt: null,
  });

  useEffect(() => {
    if (authModalOpen) {
      setAction(actionState.signin);
      setAuthData({
        email: "",
      });
    }
  }, [authModalOpen]);

  const handleClose = () => dispatch(setAuthModalOpen(false));

  const switchAuthState = (state, data = {}) => {
    setAuthData((prev) => ({ ...prev, ...data }));
    setAction(state);
  };

  return (
    <Modal open={authModalOpen} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "100%",
          maxWidth: "600px",
          padding: 4,
          outline: "none",
        }}
      >
        <Box
          sx={{
            padding: 4,
            boxShadow: 24,
            backgroundColor: "background.paper",
            borderRadius: "2%",
            outline: "2px solid",
            outlineColor: "primary.main",
          }}
        >
          <Box sx={{ textAlign: "center", marginBottom: "2rem" }}>
            <Logo />
          </Box>
          {action === actionState.signin && (
            <SigninForm
              switchAuthState={switchAuthState}
              actionState={actionState}
            />
          )}{" "}
          {action === actionState.signup && (
            <SignupForm
              switchAuthState={switchAuthState}
              actionState={actionState}
            />
          )}{" "}
          {action === actionState.verifyOtp && (
            <VerifyOtpForm
              switchAuthState={switchAuthState}
              actionState={actionState}
              authData={authData}
            />
          )}{" "}
          {action === actionState.forgotPassword && (
            <ForgotPasswordForm
              switchAuthState={switchAuthState}
              actionState={actionState}
            />
          )}{" "}
        </Box>
      </Box>
    </Modal>
  );
};

export default AuthModal;
