import DeviceInfo from "react-native-device-info";
import CookieManager from "react-native-cookies";
import axios from "axios";

const UA = DeviceInfo.getUserAgent();
console.log("GET UA: ", UA);

const instance = axios.create({
  baseURL: "https://souka.io",
  timeout: 3500,
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
  const HOME_URL = "https://souka.io/";
  CookieManager.get(HOME_URL, (err, res) => {
    console.log("get all cookies: ", res, err);
    let csrftoken = res.csrftoken;
    if (csrftoken.value) {
      // android
      csrftoken = csrftoken.value;
    }
    instance.defaults.headers.common["X-CSRFToken"] = csrftoken;
  });
};

export { updateCSRF };
export default instance;
