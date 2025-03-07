const http = require("http");
const fs = require("fs");

/*

GET /poll
Get the messages

GET /page
Serve the client app

POST /message
To send the message

*/

const pool = [];
function handlePoll(req, res) {
  pool.push(res);
}

function handlePage(req, res) {
  fs.readFile("client.html", function(error, data){
    res.statusCode = 200;
    res.end(data);
  })
}

function emitMessage(message) {
  for (let res of pool) res.end(message);
  pool.length = 0;
}

function handleMessage(req, res) {
  let message = "";
  req.on("data", (chunk) => {
    message += chunk;
  });
  req.on("end", () => {
    emitMessage(message);
    res.end();
  });
}

http
  .createServer((req, res) => {
    let method = req.method;
    let url = req.url;
    if (method === "GET") {
      if (url === "/") handlePage(req, res);
      else if (url === "/poll") handlePoll(req, res);
    } else if (method === "POST" && url === "/message") handleMessage(req, res);
    else req.end();
  })
  .listen(3000)
  .on("listening", () => {
    console.log("I am listening on port 3000!");
  });
