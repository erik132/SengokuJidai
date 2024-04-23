const express = require("express");
const app = express();

const general = require("./generalConstants.js");
const index_routes = require("./index/indexRouter.js");
const loginRouter = require("./auth/userRouter.js");
var cookieParser = require('cookie-parser');
const gameRouter = require("./game/gameRouter.js");

const {
    authMiddleware
} = require('./auth/authMiddleware.js');

app.set('view engine', 'pug');
app.use(express.static('./public'));
app.use(cookieParser());
app.listen(general.port, () => {
    console.log('Sengoku Jidai starting at port: ' + general.port);
});

app.use(express.json());
app.use('/', index_routes);
app.use('/auth', loginRouter);

app.use('/game', authMiddleware, gameRouter);