export const convertMinuteToHour = (minuteInput) => {
  const minuteInputParseToNum = Number(minuteInput);

  if (!Number.isFinite(minuteInputParseToNum) || minuteInputParseToNum <= 0) {
    return "N/A";
  }

  const hour = Math.floor(minuteInputParseToNum / 60);
  const minute = minuteInputParseToNum % 60;

  if (hour > 0) {
    return `${hour}h ${minute}m`;
  } else {
    return `${minute}m`;
  }
};
