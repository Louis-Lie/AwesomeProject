import DeviceInfo from "react-native-device-info";
import CookieManager from "react-native-cookies";
import axios from "axios";

const UA = DeviceInfo.getUserAgent();
console.log("GET UA: ", UA);

const instance = axios.create({
  baseURL: "https://souka.io",
  timeout: 5000,
  headers: {
    REFERER: "https://souka.io",
    Accept: "application/json",
    "Content-Type": "application/json",
    "User-Agent": UA
  },
  transformResponse: [(data) => {
    console.log("fetch data --> ", JSON.parse(data));
    return JSON.parse(data);
  }]
});

instance.interceptors.request.use((config) => {
    // Do something before request is sent
  console.log("axios config: ", config.url, config);
  return config;
}, (error) => {
    // Do something with request error
  console.log("axios request error: ", error);
  return Promise.reject(error);
});

instance.interceptors.response.use(response => response, (error) => {
    // Do something with response error
  console.log("axios response error: ", error);
  return Promise.reject(error);
});


const updateCSRF = () => {
  CookieManager.getAll((err, res) => {
    console.log("get all cookies: ", res, err);
    instance.defaults.headers.common["X-CSRFToken"] = res.csrftoken.value;
  });
};

export { updateCSRF };
export default instance;
