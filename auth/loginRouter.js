const express = require("express");
const router = express.Router();

const  { 
    doLogin,
    showCreateUser,
    createUser
} = require("./loginImpl.js");

router.post("/login", doLogin);
router.get("/createuser", showCreateUser);
router.post("/createuser", createUser);


module.exports = router;