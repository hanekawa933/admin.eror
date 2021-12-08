import instance from "../axios.default";

const setAuthToken = (token) => {
  if (token) {
    instance.defaults.headers.common["x-auth-token"] = `${token}`;
  } else {
    delete axios.defaults.headers.common["x-auth-token"];
  }
};

export default setAuthToken;
