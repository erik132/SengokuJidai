const express = require("express");
const router = express.Router();

const  { 
    getGameBoard,
    getGameState,
    getUnitStates
} = require("./gameboardImpl.js");

//page servers
router.get("/gameboard", getGameBoard);

//API
router.get("/getGameState", getGameState);
router.get("/getUnitStates", getUnitStates);


module.exports = router;