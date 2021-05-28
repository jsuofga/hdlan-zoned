<template>

  <div class="ipaddress container">
     
      <form >
          <form id = 'switch-brand' action="#" >
            <h5>Choose Switch Model </h5>
            <p>
              <label>
                <input  @click= "pickSwitch('Cisco')" name="group1" type="radio"    />
                <span>Cisco SG350</span>
              </label>
            </p>
            <p>
              <label>
                <input  @click= "pickSwitch('Ubiquiti')" name="group1" type="radio"  />
                <span>Ubiquiti Edge</span>
              </label>
            </p>
          
       </form>

            <h5>{{switchPicked}} Network Switch IP Address</h5>
            <h6>{{snmpStatus.model}}</h6>
            <!-- <h6 class = 'red-text'>Re-power Cisco SG350 before proceeding </h6> -->
            <div class="field">
                <label for="IP Address"></label>
                <p></p>
                <input name="IP Address" v-model= "ipAddress" placeholder="Enter IP Address(Ex 192.168.1.128)" type="text" required>
            </div>
 
            <p  class = 'feedback center-align' v-if= "feedbackMessage">{{feedbackMessage}}</p>

            <div class="field center-align">
                <button v-on:click = "cancel" class="waves-effect red waves-light btn">Cancel</button>
                <button v-on:click = "connect" class="waves-effect waves-light btn blue">Connect</button>
            </div>
       
        </form>

  </div>
</template>

<script>

export default {
  name: 'Ipaddress',
  props:['snmpStatus'],
  data () {
    return {
        ipAddress : this.snmpStatus.SwitchIPAddress,
        feedbackMessage: null,
        switchPicked:''
    }
  },
  methods:{
    pickSwitch(_type){
        console.log(_type)
        this.switchPicked = _type
    },

    cancel(e){
        e.preventDefault()
        this.$router.push({name:'home'})
    },

    connect(e){
      e.preventDefault()
       const serverURL = location.hostname
           
      //Save IP address of Cisco Switch to server
      if(this.ipAddress){
        this.$emit('msg-switchIp',{switchIp:this.ipAddress})
        // Save switch config to server
        let switchConfig = {"brand": "", "ip":"","TXports":this.snmpStatus.txCount ,"RXports":this.snmpStatus.rxCount }  //
        switchConfig['brand'] = this.switchPicked
        switchConfig['ip'] = this.ipAddress
        
        console.log(`http://${serverURL}/write/UserSwitchConfig/${JSON.stringify(switchConfig)}`)
        fetch(`http://${serverURL}:3000/write/UserSwitchConfig/${JSON.stringify(switchConfig)}`)
        .then(()=> {

          if(this.switchPicked == 'Cisco'){
            this.$router.push({name:'dashboard'})
          }else if(this.switchPicked == 'Ubiquiti' ){
            this.$router.push({name:'dashboardUbiquiti'})
          }

        })
        .catch(error => console.log(error));
      }else{
        this.feedbackMessage = `Enter IP address for ${this.switchPicked} Switch!`
      }
    },
  },

}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.container{
  display: flex; /*none or flex*/
  justify-content: center;
  align-items: center;
  height:100vh;
}
form{
  display:flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: white;
  height: 50%;
  width:80%;
  height:50vh;
}
.field{
  width:80%
}
.btn{
  margin: 30px;
}
.feedback{
  color:red
}
input[type=text]:focus{
  border-bottom: 1px solid #2196f3 !important ;
}

</style>