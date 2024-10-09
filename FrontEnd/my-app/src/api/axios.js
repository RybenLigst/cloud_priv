import axios from "axios";

const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5034';
const instance = axios.create({
  baseURL: baseURL,
});

export default instance;
