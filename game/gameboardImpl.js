const url = require('url');
const connections = require('../database/connectionHolder.js');
const generalConst = require("../generalConstants.js");


const getGameBoard = ((req, res) => {
	const gameId = req.query.gameid;
	if(gameId){
		const processedId = Number(gameId);
		connections.query("SELECT id FROM games WHERE id=?;", [processedId], async (err, rows, fields) => {
			if(err){
				console.error(err);
				res.status(500).send('Internal server error');
            	return;
			}
			if(rows.length == 0){
				console.log("Client trying to access a game that does not exist: " + processedId);
				res.redirect(url.format({pathname: generalConst.serverListPath }));
				return;
			}
			res.render('gameboard', { title: generalConst.appDisplayTitle, game_id: processedId });
		});
	}else{
		res.redirect(url.format({pathname: generalConst.serverListPath }));
	}
});

const getGameState = ((req, res) => {
	const gameId = req.query.gameid;
	if(gameId){
		const processedId = Number(gameId);
		connections.query("SELECT size_x, size_y, map_name, map_file_name FROM game_info_view WHERE id=?;", [processedId], async (err, rows, fields) => {
			if(err){
				console.error(err);
				res.status(500).send('Internal server error');
            	return;
			}
			if(rows.length != 1){
				console.log("Error: getting gamestate returned " + rows.length + " rows instead of 1.");
				res.status(500).send("Something wrong with your game id.");
				return;
			}
			res.json({sizeX: rows[0].size_x, sizeY: rows[0].size_y, mapName: rows[0].map_name, mapFileName: rows[0].map_file_name});
		});
	}else{
		res.setStatus(500).send("Incorrect game Id");
	}
});


module.exports = {
	getGameBoard,
	getGameState
}