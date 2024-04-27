const express = require("express");
const router = express.Router();

const  { 
    getServerList,
    getGameBoard,
    getCreateGame,
    getPlayerList
} = require("./gameImpl.js");

router.get("/serverlist", getServerList);
router.get("/gameboard", getGameBoard);
router.get("/creategame", getCreateGame);
router.get("/getPlayerList", getPlayerList);


module.exports = router;