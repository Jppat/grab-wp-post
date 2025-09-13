import axios from "axios";

export function createAxiosInstance() {
  const instance = axios.create();

  instance.interceptors.response.use(
    response => response.data, // pass successful responses unchanged
    error => {
      let message = "Something went wrong. Please try again later.";

      if (error.response) {
        const status = error.response.status;
        if (status >= 400 && status < 500) {
          message = "There was a problem with your request.";
        } else if (status >= 500) {
          message = "The server is having issues. Please try again later.";
        }
      } else if (error.request) {
        message = "No response from server. Please check your connection.";
      } else {
        message = error.message;
      }

      return Promise.reject({ ...error, humanMessage: message });
    }
  );

  return instance;
}

export default createAxiosInstance