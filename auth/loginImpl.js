var jwt = require('jsonwebtoken');
const url = require('url');
var formidable = require('formidable');
const connections = require('../database/connectionHolder.js');
const bcrypt = require('bcrypt');
const generalConst = require("../generalConstants.js");

const saltRounds = 10;

const doLogin = ((req, res) => {

    var form = new formidable.IncomingForm
    form.parse(req, (err, fields, files) => {
        if (err) throw err;

        const user = String(fields.user);
        const password = String(fields.password);
        connections.query('SELECT id, name, password, secret FROM users WHERE name=?', [user], async (err, rows, fields) =>{
            if(err) {
                res.status(500).send('Internal server error');
                console.error(err);
                return;
            }
            if(rows.length == 0) {
                res.redirect(url.format({pathname: generalConst.loginPath, query: {reason: 'no_such_user'} }));
                return;
            }
            bcrypt.compare(password, rows[0].password, async (err, result) => {
                if(err) {
                    res.status(401).send('No such user exists');
                    console.error(err);
                    return;
                }
                if(result) {
                    let timeout = Math.floor(Date.now() / 1000) + (generalConst.authTokenLifetime);
                    
                    jwt.sign({data: rows[0].id, exp: timeout}, generalConst.authSecret, async (err, token) => {
                        if(err) {
                            res.status(500).send('Internal server error');
                            console.error(err);
                            return;
                        }
                        res.cookie(generalConst.authTokenField, token);
                        res.redirect(url.format({pathname: generalConst.userArrivalPath }));
                        
                    });
                }else{
                    res.redirect(url.format({pathname: generalConst.loginPath, query: {reason: 'wrong_password'} }));
                }
            });
        });
        
        
    });
});

const showCreateUser = ((req, res) => {
    res.render('createUser', {title: generalConst.appDisplayTitle});
});

const createUser = ((req, res, next) => {
    var form = new formidable.IncomingForm
    form.parse(req, (err, fields, files) => {
        if (err) throw err;
        const user = String(fields.user);
        const password = String(fields.password);


        bcrypt.hash(password, saltRounds, async (err, hash) => {
            if(err) {
                res.status(500).send('Internal Server Error');
                console.error(err);
                return;
            }
            connections.query('INSERT INTO users(name, password, secret) VALUES(?,?,?);', [user, hash, secretSalt] , async (err, rows, fields) => {
                if(err) {
                    res.status(401).send('Try another username');
                    console.error(err);
                    return;
                }
                
                res.render('userCreateSuccess', {title: generalConst.appDisplayTitle, username: user});
            });
        });
    });
         
});

module.exports = {
    doLogin,
    showCreateUser,
    createUser
}