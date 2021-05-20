const express = require('express'),
    path = require('path'),
    config = require('./config/default'),
    fs = require('fs'),
    mongoose = require('mongoose'),
    Session = require('express-session'),
    bodyParser = require('body-parser'),
    passport = require('./auth/passport'),
    { v4: uuidv4 } = require('uuid'),
    FileStore = require('session-file-store')(Session),
    fileUpload = require('express-fileupload'),
    middleware = require('connect-ensure-login'),
    flash = require('connect-flash');
var os = require('os');
https = require('https');
const { ExpressPeerServer } = require('peer');

let app = express(),
    server = require('http').Server(app);
const peerServer = ExpressPeerServer(server, {
    debug: true,
});
app.set('view engine', 'ejs');
app.use('/peerjs', peerServer);
app.set('views', path.join(__dirname, './views'));
app.use(express.static('public/client'));
app.use(express.static('public/statick'));

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '4mb' }));
app.use(require('cookie-parser')());
app.use(flash());
app.use(fileUpload({}));

let settingsSession = Session({
    store: new FileStore({
        path: 'server/sessions',
    }),
    secret: config.server.secret,

    resave: false,
    saveUninitialized: false,

    cookie: { maxAge: 99999999 },
});

app.use(settingsSession);
app.use(passport.initialize());
app.use(passport.session());

app.use('/login', require('./routes/login'));
app.get('/:room', (req, res) => {
    res.render('room', { roomId: req.params.room });
});
app.get('*', (req, res) => {
    res.render('index');
});

// Создание https протокола из ключей
const sslServer = https.createServer(
    {
        key: fs.readFileSync(path.join(__dirname, 'config', 'domain.key')),
        cert: fs.readFileSync(path.join(__dirname, 'config', 'domain.crt')),
    },
    app,
);

// Прослушивание https порта
sslServer.listen(config.server.port, config.server.ip, () => {
    console.log(
        `\nServer HTTPS started on https://${config.server.ip}:${config.server.port}`,
    );
});

const io = require('socket.io')(sslServer);
io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId);
        socket.to(roomId).broadcast.emit('user-connected', userId);
        // messages
        socket.on('message', message => {
            //send message to the same room
            io.to(roomId).emit('createMessage', message);
        });

        socket.on('disconnect', () => {
            socket.to(roomId).broadcast.emit('user-disconnected', userId);
        });
    });
});
