const url = require('url');
const connections = require('../database/connectionHolder.js');
const generalConst = require("../generalConstants.js");


const getServerList = ((req, res) => {
	connections.query('SELECT id, name, state, map_name, map_file_name, current_players, max_players FROM games_view', async (err, rows, fields) => {
		if(err) {
			console.error(err);
            res.status(500).send('Internal server error');
            return;
        }
        res.render('serverList', { title: generalConst.appDisplayTitle, message: 'Login for war ', game_list: rows });
	});
	
});

const getCreateGame = ((req, res) => {
	const userId = req[generalConst.userIdField];
	const incomingId = req.query.id;
	if(incomingId){ //join existing
		const processedId = Number(incomingId);
		connections.execute('SELECT join_game(?, ?) AS id;', [processedId, userId], async (testErr, testRows, testFields) => {
			if(testErr){
				console.error(testErr);
				res.redirect(url.format({pathname: generalConst.serverListPath, query: {reason: 'database_error'} }));
				return;
			}
			if(testRows[0].id == null){
				res.redirect(url.format({pathname: generalConst.serverListPath, query: {reason: 'can_not_join_game'} }));
				return;
			}
			res.render('createGame', { title: generalConst.appDisplayTitle, msg: "Game joined successfully", game_id: processedId });
		});
	}else{ //create a game
		const incomingName = req.query.gamename;
		if(incomingName){
			const gameName = String(incomingName);
			
			connections.execute('SELECT create_game(?, ?) AS id;', [gameName, userId], async (gameErr, gameRows, gameFields) => {
				if(gameErr){
					console.log(gameErr);
					res.redirect(url.format({pathname: generalConst.serverListPath, query: {reason: 'database_rejected_game'} }));
	                return;
				}
				res.render('createGame', { title: generalConst.appDisplayTitle, msg: "Game created successfully", game_id: gameRows[0].id });
			});
			
		}else{
			res.redirect(url.format({pathname: generalConst.serverListPath, query: {reason: 'bad_game_name'} }));
		    return;
		}
		
	}
	
});

const getPlayerList = ((req, res) => {
	const incomingId = req.query.gameid;
	if(incomingId){
		const processedId = Number(incomingId);
		connections.query("SELECT player_name FROM player_list_view WHERE game_id=?", [processedId], async (err, rows, fields) => {
			if(err){
				res.status(500).send('Internal server error');
				return;
			}
			res.json(rows);
		});
	}else{
		res.status(500).send('Game id not supplied');
	}
	
});

const readinessSwap = ((req, res, readiness) => {
	const userId = req[generalConst.userIdField];
	const incomingId = req.body.gameid;
	if(incomingId){
		const processedId = Number(incomingId);
		connections.execute("CALL ready_player(?, ?, ?);", [processedId, userId, readiness], async (err, rows, fields) => {
			if(err){
				console.error(err)
				res.status(500).send('Internal server error');
				return;
			}
			res.json({readiness: readiness});
		});
	}else{
		res.status(500).send("incorrect game id");
	}
});

const readyPlayer = ((req, res) => {
	readinessSwap(req, res, 1);
});

const unreadyPlayer = ((req, res) => {
	readinessSwap(req, res, 0);
});

const getReadiness = ((req, res) => {
	const userId = req[generalConst.userIdField];
	const incomingId = req.query.gameid;
	if(incomingId){
		const processedId = Number(incomingId);
		connections.query("SELECT is_ready FROM participants WHERE game_id=? AND user_id=?;", [processedId, userId], async (err, rows, fields) => {
			if(err){
				console.error(err)
				res.status(500).send('Internal server error');
				return;
			}
			if(rows.length != 1){
				res.status(500).send("Incorrect inputs");
				console.log(rows)
				return;
			}
			res.json({readiness: rows[0].is_ready});
		});
	}else{
		res.status(500).send("incorrect game id");
	}
});

const getGameStart = ((req, res) => {
	const incomingId = req.query.gameid;
	if(incomingId){
		const processedId = Number(incomingId);
		connections.execute("SELECT is_game_ready(?) AS is_ready;", [processedId], async (err, rows, fields) => {
			if(err){
				console.error(err);
				res.status(500).send('Internal server error');
				return;
			}
			res.json({readiness: rows[0].is_ready})
		});
	}else{
		res.status(500).send("incorrect game id");
	}
});

module.exports = {
	getServerList,
	getCreateGame,
	getPlayerList,
	readyPlayer,
	unreadyPlayer,
	getReadiness,
	getGameStart
}