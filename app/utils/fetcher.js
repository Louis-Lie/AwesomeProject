import CookieManager from "react-native-cookies";

const axios = require("axios");


const instance = axios.create({
  baseURL: "https://souka.io",
  timeout: 3000,
  headers: {
    REFERER: "https://souka.io",
    Accept: "application/json",
    "Content-Type": "application/json"
  },
  transformResponse: [(data) => {
    console.log("fetch data --> ", JSON.parse(data));
    return JSON.parse(data);
  }],
});

instance.interceptors.request.use((config) => {
    // Do something before request is sent
  console.log("axios config: ", config);
  return config;
}, (error) => {
    // Do something with request error
  console.log("axios error: ", error);
  return Promise.reject(error);
});

instance.interceptors.response.use((response) => {
  console.log("axios response --> ", response);
  return response;
}, error =>
    // Do something with response error
   Promise.reject(error));

CookieManager.getAll((err, res) => {
  console.log("get all cookies: ", res, err);
  instance.defaults.headers.common["X-CSRFToken"] = res.csrftoken.value;
});
export default instance;
