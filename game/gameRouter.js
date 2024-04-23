const express = require("express");
const router = express.Router();

const  { 
    getServerList,
    getGameBoard
} = require("./gameImpl.js");

router.get("/serverlist", getServerList);
router.get("/gameboard", getGameBoard);


module.exports = router;