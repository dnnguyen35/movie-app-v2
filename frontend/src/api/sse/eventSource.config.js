const baseURL = process.env.REACT_APP_API_URL;

const createNotificationEventSource = () =>
  new EventSource(`${baseURL}/notifications/sse`);

export const { createNotificationEventSource };
