function isFunction(functionToCheck) {
 var getType = {};
 return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}

function request(method, url, body, callback){
  if ( isFunction( body ) ) {
			callback = body;
			body = undefined;
	}

  fetch(url, {
    method: method,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: body && JSON.stringify(body)
  })
  .then((response) => response.json())
  .then((data) => {
    console.log('fetch data: ', data);
    callback(data);
  })
  .catch((error) => {
    console.warn(error);
  });
};

var methods = {};
['delete', 'get', 'post', 'put'].forEach((method) => {
  methods[method] = (url, body, callback) => {
    return request(method.toUpperCase(), url, body, callback)
  }
});

export default methods;
