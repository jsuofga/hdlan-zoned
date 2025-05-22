<template>

  <div class="ipaddress container">
     
      <form >
            <h5>Cisco Switch IP Address</h5>
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
        feedbackMessage: null
    }
  },
  methods:{
    cancel(e){
        e.preventDefault()
        this.$router.push({name:'home'})
    },

    isValidIP(ip) {
      // Regex for IPv4 validation
      const ipv4Regex = /^(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}$/;
      return ipv4Regex.test(ip);
    },

    connect(e){
      e.preventDefault()

      if (!this.ipAddress) {
        this.feedbackMessage = "Enter IP address for Cisco Switch!"
        return;
      }
      if (!this.isValidIP(this.ipAddress)) {
        this.feedbackMessage = "Invalid IP address format. Please use format like 192.168.1.128.";
        return;
      }

      const serverURL = location.hostname
      
      //Save IP address of Cisco Switch to server
      if(this.ipAddress){
        this.$emit('msg-switchIp',{switchIp:this.ipAddress})
        // Save switch config to server
        let sg350Config = {"ip":"","TXports":this.snmpStatus.txCount ,"RXports":this.snmpStatus.rxCount }  //
        sg350Config['ip'] = this.ipAddress
        
        //console.log(`http://${serverURL}/write/UserSwitchConfig/${JSON.stringify(sg350Config)}`)
        fetch(`http://${serverURL}:3000/write/UserSwitchConfig/${JSON.stringify(sg350Config)}`)
        .then(()=> {
          this.$router.push({name:'dashboard'})
        })
        .catch(error => console.log(error));
      }else{
        this.feedbackMessage = "Enter IP address for Cisco SG350 Switch!"
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