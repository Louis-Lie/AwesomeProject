const axios = require("axios");


const instance = axios.create({
  baseURL: "https://souka.io",
  timeout: 3000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json"
  },
  xsrfCookieName: "csrftoken",
  xsrfHeaderName: "X-CSRFToken",
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

// let csrfToken = null;
// if (!csrfToken) {
//   CookieManager.getAll((err, res) => {
//     console.log("get cookies", err, res);
//     csrfToken = res.csrftoken.value;
//   });
// }
//
// function isFunction(functionToCheck) {
//   const getType = {};
//   return functionToCheck && getType.toString.call(functionToCheck) === "[object Function]";
// }
//
// function request(method, url, body, callback) {
//   let payload = null;
//   let fn = null;
//
//   if (isFunction(body)) {
//     fn = body;
//   } else {
//     payload = body;
//     fn = callback;
//   }
//
//   console.log(method, url, payload, fn);
//   fetch(url, {
//     method,
//     referrer: "https://souka.io",
//     headers: {
//       Accept: "application/json",
//       "Content-Type": "application/json",
//       "X-CSRFToken": csrfToken
//     },
//     body: payload && JSON.stringify(payload)
//   })
//   .then(response => response.json())
//   .then((data) => {
//     console.log("fetch data: ", data);
//     if (fn) {
//       fn(data);
//     }
//   })
//   .catch((error) => {
//     console.warn(error);
//   });
// }
//
// const methods = {};
// ["delete", "get", "post", "put"].forEach((method) => {
//   methods[method] = (url, body, callback) => request(method.toUpperCase(), url, body, callback);
// });
export default instance;
