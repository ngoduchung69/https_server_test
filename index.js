var fs = require("fs");
var https = require("https");
var express = require("express");
var cors = require("cors");
var cookieParser = require("cookie-parser");

var privateKey = fs.readFileSync("./dev-domain.test+3-key.pem", "utf8");
var certificate = fs.readFileSync("./dev-domain.test+3.pem", "utf8");

var credentials = { key: privateKey, cert: certificate };

var whitelist = ["https://localhost:3000"];
var corsOptions = {
  origin: function(origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials : true
};

var app = express();
app.use(cors(corsOptions));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Now using https..");
  console.log("Cookies: ", req.cookies);
  console.log("Signed Cookies: ", req.signedCookies);
});

app.get("/api/helloworld", (req, res) => {
  res.cookie('time', "123456");
  res.status(200).json({ sayHi: "hello from server, nice to meet you!" });
});

app.post("/api/clearCookie", (req, res) => {
  console.log("1122");
  res.clearCookie("time", {path : '/'});
  res.send("oke cookies had cleaned");
});

app.post("/api/setCookie", (req, res, next) => {
  console.log("11111");
  res.cookie('time', "aaaaaabbbbb");
  res.status(200).json({time : "aaaaaabbbbb"})
})

// your express configuration here

var httpsServer = https.createServer(credentials, app);

httpsServer.listen(8443, function() {
  console.log("server running at https://localhost:8443/");
});
