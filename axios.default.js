import axios from "axios";

const instance = axios.create({
  baseURL: `https://erorsetneg.com/eror_api/api`,
});

export default instance;
