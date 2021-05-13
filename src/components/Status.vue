<template>
  <div class="status">
      <!-- <h5>Status</h5>-->
  </div>
</template>

<script>
export default {
  name: 'Status',
 
  data () {
    return {
        status : {},  // Cisco switch Status. Example:{model: "SG350-52P", NodeRedIPAddress: "192.168.1.76", SwitchPingTest: "ok", SwitchIPAddress: "192.168.1.68", PoE: 0, …}
        sourceNames:[],
        tvNames:[],
        zoneNames:[],
        pingController:null
    }
  },
  methods:{
     
      getStatus(){
        const serverURL_ciscoStat = `${location.hostname}:1880/ciscoStat`
        fetch(`http://${serverURL_ciscoStat}`)
        .then(function(response) {
            return response.json();
        })
        .then((myJson)=> {
         // console.log(myJson)
          this.status = myJson
          this.$emit('msg-status',this.status)
          this.$emit('msg-pingController','ok')
        })
        .catch(()=> {
            //console.log('ERROR!'); 
          this.$emit('msg-pingController','fail')
        })
          
      },

      getUserInputNames(){
        
          const serverURL = `${location.hostname}:3000`

        // Read from Server
          fetch(`http://${serverURL}/read/UserInputNames`, {
            method: 'GET',
          })
          .then(response => response.json())
          .then(result => {
            console.log('Success:', result);
             let item;
             for( item in result){
                this.sourceNames.push(result[item])
             }
              //console.log(this.sourceNames)
              this.$emit('msg-sourceNamesUpdated',this.sourceNames)
          })
          .catch(error => {
            console.error('Error:', error);
          });

      },
        getUserTvZoneNames(){
          const serverURL = `${location.hostname}:3000`

        // Read from Server
          fetch(`http://${serverURL}/read/UserTvNames`, {
            method: 'GET',
          })
          .then(response => response.json())
          .then(result => {
            //console.log('Success:', result);
            this.$emit('msg-tvNamesZonesUpdated',result)
          })
          .catch(error => {
            console.error('Error:', error);
          });

      }
},
  
  created(){
      this.getStatus()
      this.getUserInputNames()
      this.getUserTvZoneNames()
      setInterval(this.getStatus, 10000)
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.status{
    display:flex;
    justify-content: center;
    height:100vh;
}

</style>


