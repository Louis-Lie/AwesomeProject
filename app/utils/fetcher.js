function isFunction(functionToCheck) {
  const getType = {};
  return functionToCheck && getType.toString.call(functionToCheck) === "[object Function]";
}

function request(method, url, body, callback) {
  let payload = null;
  let fn = null;

  if (isFunction(body)) {
    fn = body;
  } else {
    payload = body;
    fn = callback;
  }

  fetch(url, {
    method,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: payload && JSON.stringify(payload)
  })
  .then(response => response.json())
  .then((data) => {
    console.log("fetch data: ", data);
    fn(data);
  })
  .catch((error) => {
    console.warn(error);
  });
}

const methods = {};
["delete", "get", "post", "put"].forEach((method) => {
  methods[method] = (url, body, callback) => request(method.toUpperCase(), url, body, callback);
});

export default methods;
