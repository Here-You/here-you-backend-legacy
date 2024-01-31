export const response = ({ success, code, message }, data) => {
  return {
    success: success,
    code: code,
    message: message,
    data: data,
  };
};

export const errResponse = ({ success, code, message }) => {
  return {
    success: success,
    code: code,
    message: message,
  };
};
