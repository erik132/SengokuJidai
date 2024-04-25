const express = require("express");
const router = express.Router();

const  { 
    getServerList,
    getGameBoard,
    getCreateGame
} = require("./gameImpl.js");

router.get("/serverlist", getServerList);
router.get("/gameboard", getGameBoard);
router.get("/creategame", getCreateGame);


module.exports = router;