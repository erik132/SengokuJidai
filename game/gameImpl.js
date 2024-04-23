var jwt = require('jsonwebtoken');
const generalConst = require("../generalConstants.js");


const getServerList = ((req, res) => {
	console.log(req[generalConst.userIdField]);
	res.render('serverList', { title: generalConst.appDisplayTitle, message: 'Login for war ' });
});

const getGameBoard =((req, res) => {
	console.log(req[generalConst.userIdField]);
	res.render('serverList', { title: generalConst.appDisplayTitle, message: 'Login for war ' });
});

module.exports = {
	getServerList,
	getGameBoard
}