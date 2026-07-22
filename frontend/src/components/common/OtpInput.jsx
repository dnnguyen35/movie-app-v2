import { Box, TextField } from "@mui/material";
import { useEffect, useRef, useState } from "react";

const OTP_LENGTH = process.env.REACT_APP_OTP_LENGTH;

const OtpInput = ({ value = "", onChange }) => {
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const inputRefs = useRef([]);

  useEffect(() => {
    if (!value) return;

    const otpArray = value.split("").slice(0, OTP_LENGTH);

    while (otpArray.length < OTP_LENGTH) {
      otpArray.push("");
    }

    setOtp(otpArray);
  }, [value]);

  const updateOtp = (newOtp) => {
    setOtp(newOtp);
    onChange(newOtp.join(""));
  };

  const handleChange = (index, event) => {
    const input = event.target.value.replace(/\D/g, "");

    if (!input) {
      const newOtp = [...otp];
      newOtp[index] = "";
      updateOtp(newOtp);
      return;
    }

    const digit = input[input.length - 1];

    const newOtp = [...otp];
    newOtp[index] = digit;
    updateOtp(newOtp);

    if (index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, event) => {
    if (event.key !== "Backspace") return;

    if (otp[index]) {
      const newOtp = [...otp];
      newOtp[index] = "";
      updateOtp(newOtp);
      return;
    }

    if (index > 0) {
      const newOtp = [...otp];
      newOtp[index - 1] = "";
      updateOtp(newOtp);

      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (event) => {
    event.preventDefault();

    const pasted = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);

    if (!pasted) return;

    const newOtp = Array(OTP_LENGTH).fill("");

    pasted.split("").forEach((digit, index) => {
      newOtp[index] = digit;
    });

    updateOtp(newOtp);

    const lastIndex = Math.min(pasted.length, OTP_LENGTH) - 1;

    inputRefs.current[lastIndex]?.focus();
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        gap: { xs: 0.2, sm: 1 },
      }}
    >
      {otp.map((digit, index) => (
        <TextField
          key={index}
          value={digit}
          inputRef={(ref) => (inputRefs.current[index] = ref)}
          onChange={(event) => handleChange(index, event)}
          onKeyDown={(event) => handleKeyDown(index, event)}
          onPaste={handlePaste}
          inputProps={{
            maxLength: 1,
            style: {
              textAlign: "center",
              fontSize: "1rem",
            },
          }}
          sx={{
            width: { xs: 40, sm: 50 },
          }}
        />
      ))}
    </Box>
  );
};

export default OtpInput;
