import {createApp, ref} from 'vue'


createApp({
	data() {
		return {
			gameId: 0,
			gameSize: {x: 1, y: 1},
			unitStates: [],
			gameTiles: [],
			moveLog: [],
			mapName: "",
			mapFileName: "",
			gameTilesChanged: false,
			selectedUnit: null


		}
	},
	setup(){
        
    },
    created(){
        
    },
    mounted(){
    	this.gameId = document.getElementById("gameId").value
        this.initGameState()
    	//this.initUnitLocations()
    },
    updated(){
    	console.log("we have updated");
    	if(this.gameTilesChanged){
    		this.gameTilesChanged = false;
    		this.initUnitLocations()
    	}
    },
    methods: {
    	initGameState(){
    		axios.get("/gameboard/getGameState/?gameid=" + this.gameId).then((response) => {
                this.gameSize = {x: response.data.sizeX, y: response.data.sizeY}
                this.mapName = response.data.mapName
                this.mapFileName = response.data.mapFileName
                this.unitStates = response.data.unitData
                console.log(response.data.unitData)
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
					innerCanister[x] = {x:x, y:y}
				}
				outerCanister[y] = innerCanister
			}
			this.gameTiles = outerCanister
    	},
    	initUnitStates(){
    		axios.get("/gameboard/getUnitStates/?gameid=" + this.gameId).then((response) => {
                console.log(response.data)
            }).catch((error)=>{
                console.log("error on unit state aquisition: " + error.response.data)
                console.log(error.data)
            })
    	},
    	initUnitLocations(){
    		var holderElement = document.querySelector("#holderofall")
    		var holderRect = holderElement.getBoundingClientRect()

    		this.unitStates.forEach(unit =>{
    			var unitElement = document.querySelector("#unit" + unit.unique_id)
    			//var unitElement = this.$refs.unit1;
    			//console.log("#tilex" + unit.grid_x + "y" + unit.grid_y)

    			var destTile = document.querySelector("#tilex" + unit.grid_x + "y" + unit.grid_y)
    			var destRect = destTile.getBoundingClientRect()
    			//console.log("unit nr " + unit.unique_id + " is going to: " + destRect.left + " " + destRect.top)
				unit.original_left = destRect.left - holderRect.left
    			unit.original_top = destRect.top - holderRect.top

    			unitElement.style.left = destRect.left - holderRect.left
    			unitElement.style.top = destRect.top - holderRect.top

    			
    		})
    	},
    	unitClick(unitId){
    		console.log("trying to select unit: " + unitId)
    		if(this.selectedUnit == unitId){
    			this.selectedUnit = null
    		}else{
    			this.selectedUnit = unitId
    			//console.log(this.unitStates[unitId - 1])
    		}
    		
    	},
    	tileClick(x, y){
    		if(this.selectedUnit != null){
    			var unitElement = document.querySelector("#unit" + this.selectedUnit)
    			var unitRect = unitElement.getBoundingClientRect()

    			var tileElement = document.querySelector('#tilex' + x + 'y' + y)
    			var tileRect = tileElement.getBoundingClientRect()

    			var holderElement = document.querySelector("#holderofall")
    			var holderRect = holderElement.getBoundingClientRect()

    			let moveByX = (tileRect.left - holderRect.left) - this.unitStates[this.selectedUnit - 1].original_left
    			let moveByY = (tileRect.top - holderRect.top) - this.unitStates[this.selectedUnit - 1].original_top

    			console.log("I'm unit " + this.selectedUnit + " at: " + unitRect.left + " " + unitRect.top)
    			console.log("Tile is " + x + " " + y + " at " + tileRect.left + " " + tileRect.top)
    			console.log("I'll move by " + moveByX + " " + moveByY)

    			unitElement.style.transform = `translate(${moveByX}px, ${moveByY}px)`
    		}
    	}
    },
    watch: {
    	gameTiles(){
    		this.gameTilesChanged = true;
    	}
    	
    },
    template: `
    	<div class="is-gapless" v-for="tileRow in gameTiles">
	    	<div class="columns is-gapless">
	    		<div :id="'tilex' + tile.x + 'y' + tile.y" class="column is-narrow" v-for="tile in tileRow" @click="tileClick(tile.x, tile.y)">
	    			<div class="notification is-danger map-tile tile-stretch">{{tile.x + " " + tile.y}}</div>
	    		</div>
	    	</div>
    	</div>
    	<figure :id="'unit' + unitData.unique_id"  :class="'image unit-tile unit-stretch is-' + unitData.faction_name" v-for="unitData in unitStates">
    		<img class="is-rounded" :src="'/img/' + unitData.img_file_name" @click="unitClick(unitData.unique_id)" />
    	</figure>
    `
}).mount("#gameboard")