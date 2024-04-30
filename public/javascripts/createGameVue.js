import {createApp, ref} from 'vue'



createApp({
    data() {
        return {
            message: 'You are playing with.',
            gameId: 0,
            readiness: 0,
            readinessPoller: null
        }
    },
    setup(){
        
    },
    created(){
        this.gameId = document.getElementById("gameId").value
        this.checkForStart()
        this.readinessPoller = setInterval(this.checkForStart, 5000)
    },
    mounted(){
        
        this.getPlayerList()
        this.getReadiness()
    },
    methods: {
        getPlayerList(){
            axios.get("/game/getPlayerList/?gameid=" + this.gameId).then((response) => {
                this.message = response.data
            }).catch((error)=>{
                console.log("error on player list aquisition: " + error.response.data)
                console.log(error.data)
                this.message = "Player List can not be shown"
            })
        },
        setPlayerReady(){
            axios.post("/game/readyPlayer", {gameid: this.gameId}).then((response) => {
                this.readiness = response.data.readiness
            }).catch((error)=>{
                console.log("we got a set ready error:" + error.response.data)
                console.log(error)
            })
        },
        setPlayerUnReady(){
            axios.post("/game/unreadyPlayer", {gameid: this.gameId}).then((response) => {
                this.readiness = response.data.readiness
            }).catch((error)=>{
                console.log("we got a set unready error: " + error.response.data)
                console.log(error)
            })
        },
        getReadiness(){
            axios.get("/game/getReadiness/?gameid="  + this.gameId).then((response) => {
                this.readiness = response.data.readiness
            }).catch((error)=>{
                console.log("we got a get readiness error: " + error.response.data)
                console.log(error)
            })
        },
        checkForStart(){
            axios.get("/game/getStart/?gameid=" + this.gameId).then((response) => {
                const isReadyToStart = response.data.readiness
                if(isReadyToStart ==1){
                    window.location.href="/game/gameboard/?gameid=" + this.gameId
                }
            }).catch((error)=>{
                console.log("we got a game start error: " + error.response.data)
                console.log(error)
            })
        }
    },
    template: `
    <div class="columns">
        <div class="column"></div>
        <div class="column is-one-fifth has-text-centered"><a href="/game/serverList" class="button is-large">Quit</a></div>
        <div class="column"></div>
    </div>
    <div class="columns">
        <div class="column" v-if="message[0]"><div class="notification is-danger has-text-centered title">{{message[0].player_name}}</div></div>
        <div class="column is-one-fifth"> <div class="notification has-text-centered title"> VS </div> </div>
        <div class="column" v-if="message[1]"><div class="notification is-link has-text-centered title">{{message[1].player_name}}</div></div>
    </div>
    <div class="columns">
        <div class="column"></div>
        <div class="column is-one-fifth has-text-centered">
            <div class="icon-text button is-large" v-on:click="setPlayerReady" v-if="readiness==0">
                <span>Ready</span>
                <span class="icon has-text-danger is-small"><i class="fas fa-solid fa-circle-xmark"></i></span>
            </div>
            <div class="icon-text button is-large" v-on:click="setPlayerUnReady" v-if="readiness==1">
                <span>Unready</span>
                <span class="icon has-text-success is-small"><i class="fas fa-solid fa-check"></i></span>
            </div>
        </div>
        <div class="column"></div>
    </div>
    `
    
}).mount('#playerList')