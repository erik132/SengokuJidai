const fs = require("fs");

const getIndex = ((req, res) => {
    res.render('index', { title: 'Sengoku Jidai', message: 'Login for war' });
});

module.exports = {
    getIndex
}