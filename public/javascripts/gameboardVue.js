import {createApp, ref} from 'vue'


createApp({
	data() {
		return {
			gameId: 0,
			gameSize: {x: 1, y: 1},
			gameState: [],
			gameTiles: [],
			moveLog: [],
			mapName: "",
			mapFileName: ""


		}
	},
	setup(){
        
    },
    created(){
        this.gameId = document.getElementById("gameId").value
        this.initGameState()
    },
    mounted(){

    },
    methods: {
    	initGameState(){
    		axios.get("/gameboard/getGameState/?gameid=" + this.gameId).then((response) => {
                this.gameSize = {x: response.data.sizeX, y: response.data.sizeY}
                this.mapName = response.data.mapName
                this.mapFileName = response.data.mapFileName
                this.initBoard()
            }).catch((error)=>{
                console.log("error on game state aquisition: " + error.response.data)
                console.log(error.data)
            })
    	},
    	initBoard(){
    		var outerCanister = []
			for (let y = 0; y < this.gameSize.y; y++) {
				var innerCanister = []
				for (let x = 0; x < this.gameSize.y; x++) {
					innerCanister[x] = '0' + y
				}
				outerCanister[y] = innerCanister
			}
			this.gameTiles = outerCanister
    	}
    },
    template: `
    	<div class="is-gapless" v-for="tileRow in gameTiles">
	    	<div class="columns is-gapless">
	    		<div class="column is-narrow" v-for="tile in tileRow"><div class="notification is-danger map-tile tile-stretch">{{tile}}</div></div>
	    	</div>
    	</div>
    `
}).mount("#gameboard")