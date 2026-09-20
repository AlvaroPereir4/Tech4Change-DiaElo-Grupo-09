import axios from "axios";

export const network = axios.create({
  baseURL: "http://168.75.104.67:8000",
  timeout: 5000,
});
