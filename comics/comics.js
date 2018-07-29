$.ajax({
    type: 'GET',
    url: "https://www.gocomics.com/calvinandhobbes/2018/07/29",
    headers: {
        "Access-Control-Allow-Origin": "*"
    }
}).done(function(data) { 
    alert(data);
});