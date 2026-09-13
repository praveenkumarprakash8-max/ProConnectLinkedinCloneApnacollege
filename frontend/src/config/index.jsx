import axios from "axios";

export const BASE_URL =
  " https://proconnectlinkedincloneapnacollege-rquj.onrender.com";

export const clientServer = axios.create({
  baseURL: BASE_URL,
});

export default clientServer;
