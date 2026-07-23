import privateClient from "../client/private.client.js";
import publicClient from "../client/public.client.js";

const userEndpoints = {
  signin: "/auth/login",
  signup: "/auth/register",
  getInfo: "/users/info",
  passwordUpdate: "/users/change-password",
  resetPassword: "/auth/reset-password",
  verifyOtp: "/auth/verify",
  resendOtp: "/auth/resend-otp",
  logout: "/auth/logout",
};

const userApi = {
  signin: async ({ email, password }) => {
    try {
      const response = await publicClient.post(userEndpoints.signin, {
        email,
        password,
      });

      return { response };
    } catch (error) {
      return { error };
    }
  },

  signup: async ({ email, name, password }) => {
    try {
      const response = await publicClient.post(userEndpoints.signup, {
        email,
        name,
        password,
      });

      return { response };
    } catch (error) {
      return { error };
    }
  },

  getInfo: async () => {
    try {
      const response = await privateClient.get(userEndpoints.getInfo);

      return { response };
    } catch (error) {
      return { error };
    }
  },

  passwordUpdate: async ({ password, newPassword, confirmNewPassword }) => {
    try {
      const response = await privateClient.post(userEndpoints.passwordUpdate, {
        currentPassword: password,
        newPassword,
        confirmNewPassword,
      });

      return { response };
    } catch (error) {
      return { error };
    }
  },

  resetPassword: async ({ email }) => {
    try {
      const response = await publicClient.post(userEndpoints.resetPassword, {
        email,
      });

      return { response };
    } catch (error) {
      return { error };
    }
  },

  verifyOtp: async ({ email, otpCode }) => {
    try {
      const response = await publicClient.post(userEndpoints.verifyOtp, {
        email,
        otpCode,
      });

      return { response };
    } catch (error) {
      return { error };
    }
  },

  resendOtp: async ({ email }) => {
    try {
      const response = await publicClient.post(userEndpoints.resendOtp, {
        email,
      });

      return { response };
    } catch (error) {
      return { error };
    }
  },

  logout: async () => {
    try {
      const response = await publicClient.post(userEndpoints.logout);

      return { response };
    } catch (error) {
      return { error };
    }
  },
};

export default userApi;
