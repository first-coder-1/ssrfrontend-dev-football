export const axiosConfig = {
  validateStatus: function (status: number) {
    return status < 500; // Resolve only if the status code is less than 500
  },
};
