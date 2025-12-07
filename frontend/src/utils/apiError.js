export const getApiErrorMessage = (error) => {
  if (error.response && error.response.data && error.response.data.msg) {
    return error.response.data.msg;
  } else if (error.message) {
    return error.message;
  } else {
    return "Ocurrió un error desconocido.";
  }
};
