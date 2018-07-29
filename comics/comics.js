$.ajax({
  type: 'GET',
  url: 'https://www.gocomics.com/calvinandhobbes/2018/07/29',
  contentType: 'text/html',
  /*dataType:'jsonp',*/
  responseType:'text/html',
  xhrFields: {
    withCredentials: false
  },
  headers: {
    'Access-Control-Allow-Credentials' : false,
    'Access-Control-Allow-Origin':'*',
    'Access-Control-Allow-Methods':'GET',
    'Access-Control-Allow-Headers':'text/html',
    'Content-Type': 'text/html',
  },
  success: function(data) {
    console.log(data);
  },
  error: function(error) {
    console.log("FAIL....=================");
  }
});