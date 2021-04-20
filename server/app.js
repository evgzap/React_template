const express = require("express"),
  path = require("path"),
  config = require("./config/default"),
  port = config.server.port,
  fs = require("fs"),
  https = require("https");

let app = express(),
  server = require("http").Server(app),
  io = require("socket.io")(server);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "./views"));
app.use(express.static("public"));


app.get('*', (req, res)=>{
  res.render('index')
})


// Создание https протокола из ключей
const sslServer = https.createServer(
  {
    key: fs.readFileSync(path.join(__dirname, "config", "domain.key")),
    cert: fs.readFileSync(path.join(__dirname, "config", "domain.crt")),
  },
  app
);


// Прослушивание https порта
sslServer.listen(config.server.port, config.server.ip, () => {
  console.log(
    `\nServer HTTPS started on https://${config.server.ip}:${config.server.port}`
  );
});
