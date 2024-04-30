const express = require("express");
const router = express.Router();

const  { 
    getServerList,
    getGameBoard,
    getCreateGame,
    getPlayerList,
    readyPlayer,
    unreadyPlayer,
    getReadiness,
    getGameStart
} = require("./gameImpl.js");

//page servers
router.get("/serverlist", getServerList);
router.get("/gameboard", getGameBoard);
router.get("/creategame", getCreateGame);
router.get("/getPlayerList", getPlayerList);


//API
router.post("/readyPlayer", readyPlayer);
router.post("/unreadyPlayer", unreadyPlayer);

router.get("/getReadiness", getReadiness);
router.get("/getStart", getGameStart);


module.exports = router;