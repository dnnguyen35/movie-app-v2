const calculateRemainingTime = (expirationTimeInSeconds) => {
  if (!expirationTimeInSeconds || typeof expirationTimeInSeconds !== "number") {
    return 0;
  }

  const now = Math.floor(Date.now() / 1000);
  const remainingTime = expirationTimeInSeconds - now;
  return Math.max(0, remainingTime);
};

export default calculateRemainingTime;
