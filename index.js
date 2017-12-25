const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const http = require('http');
const wsServer = require('ws').Server;
const app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

// session設定
app.use(session({
    secret: 'secretString',
    resave: false,
    saveUninitialized: false,
}));

const webServer = http.createServer(app);
const wss = new wsServer({server: webServer});
webServer.listen(3000, () => {
    console.log('server listen port 3000');
});

app.post('/api/login', (req, res) => {
    if (req.session.user) {
        res.json({msg: 'Authenticated'});
        return;
    }

    if (req.body.userId) {
        req.session.user = {
            userId: req.body.userId,
        };
        res.json({userId: req.session.user.userId});
        return;
    }

    res.json({msg: 'LoginFailure'});
});

wss.on('connection', (ws, req) => {
    console.log('connect WebSocket');

    ws.on('close', () => {
        console.log('WebSocket close');
    });

    ws.on('message', (message) => {
        console.log('message:', message);

        // 受信したdateをそのまま送信
        ws.send(JSON.stringify({date:message}));
    });
});

