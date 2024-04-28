import {createApp, ref} from 'vue'
//import VersusComponent from "./versusComponent.vue"



createApp({
    data() {
        return {
            message: 'You are playing with.'
        }
    },
    setup(){
        
    },
    created(){
        
    },
    mounted(){
        this.getPlayerList(document.getElementById("gameId").value)
    },
    methods: {
        getPlayerList(gameId){
            axios.get("/game/getPlayerList/?gameid=" + gameId).then((response) =>{
                this.message = response.data
            }).catch((error)=>{
                console.log("error on player list aquisition")
                console.log(error.data)
                this.message = "Player List can not be shown"
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
        <div class="column is-one-fifth has-text-centered"><div class="button is-large">Ready</div></div>
        <div class="column"></div>
    </div>
    `
    
}).mount('#playerList')