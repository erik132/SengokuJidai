const express = require("express");
const router = express.Router();

const  { 
    getIndex
} = require("./indexImpl.js");

router.get("/", getIndex);


module.exports = router;