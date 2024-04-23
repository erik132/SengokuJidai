var jwt = require('jsonwebtoken');
var cookies = require('cookie-parser');
const url = require('url');
const generalConst = require("../generalConstants.js");


const authMiddleware = ((req, res, next) => {
	var authToken = req.cookies[generalConst.authTokenField];
	
	jwt.verify(authToken, generalConst.authSecret, (err, decoded) => {
		if(err){
			res.redirect(url.format({pathname: generalConst.loginPath, query: {reason: 'invalid_token'} }));
		}else{
			req[generalConst.userIdField] = decoded.data;
			next();
		}
	});
});


module.exports = {
	authMiddleware
}