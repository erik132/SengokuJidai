import {createApp, ref} from 'vue'



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
                this.message = "Player List can not be shown";
            })
        }
    }
}).mount('#playerList')