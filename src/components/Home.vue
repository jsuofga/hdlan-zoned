<template>
 <div class="home">


    <!-- This banner appears only when PoE Power is 0 (off) -->
    <div v-if= "snmpStatus.PoE === 0 && /-.*p/i.test(snmpStatus.model)"  id="poe-off-banner">
        <h5 >PoE Power is OFF</h5>
        <button @click="PoE('on')" class="waves-effect waves-light btn green ">
            TURN PoE ON
        </button>
        <h5 v-if = "showWaiting" class = "red-text"> Wait. PoE Power Turning On</h5>
    </div>
    <!-- END NEW BANNER -->
      
      <div v-if= "zoneNamesToDisplay.length === 0" class = "welcome">
        <h3>Welcome</h3>
        <h3>Goto settings to add displays to system</h3>
          
      </div>
      <div v-else-if= "zoneNamesToDisplay.length === 1" class = "single-zone" >
            <div @click= "showZone(item,index)" class = "waves-effect waves-light roundBtn btn-large" v-for="(item,index) in zoneNamesToDisplay" :key="index">{{zoneNamesToDisplay[index]}}</div>
            <div @click= "switchAll" data-target="slide-out" class="waves-effect waves-light roundBtn btn-large sidenav-trigger">ALL TVs</div>
      </div>
      <div v-else class = "zone" >
          <div @click= "showZone(item,index)" class = "waves-effect waves-light roundBtn btn-large" v-for="(item,index) in zoneNamesToDisplay" :key="index">{{zoneNamesToDisplay[index]}}</div>
          <div @click= "switchAll" data-target="slide-out" class="waves-effect waves-light roundBtn btn-large sidenav-trigger"><i class="material-icons">all_inclusive</i>ALL</div>
     </div>
 
     <!-- Floating Action Button -->
    <div class="fixed-action-btn ">
        <a class="btn-floating btn-large red">
            <small class = 'preset'>Presets</small>
            <!-- <i class="large material-icons">bookmark</i> -->
        </a>
        <ul>
            <li @click= 'mix'><a class="btn-floating orange">Mix</a></li>
            <li @click= 'switchPreset(1)'><a class="btn-floating red"><i class="material-icons">looks_one</i></a></li>
            <li @click= 'switchPreset(2)'><a class="btn-floating blue"><i class="material-icons">looks_two</i></a></li>
            <li @click= 'switchPreset(3)'><a class="btn-floating green darken-1"><i class="material-icons">looks_3</i></a></li>
        </ul>
    </div>

 <div id = 'power' class = 'valign-wrapper' v-if="/-.*p/i.test(snmpStatus.model)">
          <button @click= "PoE('on')" class ="power-btn-relative waves-effect waves-light btn green roundLeft center-align">PoE On <small v-if = "snmpStatus.ontime !== ''" class = 'power-info'>{{snmpStatus.ontime}}</small></button>
          <button @click= "PoE('off')" class="power-btn-relative waves-effect waves-light btn red roundRight center-align">PoE Off <small v-if = "snmpStatus.offtime !== ''" class = 'power-info'>{{snmpStatus.offtime}}</small></button>
  </div> 

</div>

</template>

<script>
export default {
  name: 'Home',
  props: ['snmpStatus','zoneNamesToDisplay','userPresetsExist','sourceNames','tvNames'],
  data () {
    return {
      showWaiting:false
    }
  },
  computed:{

  },
  methods:{
         showZone(item,index){
           let zone = index+1
           this.$emit('msg-zoneSelected', {zoneId: index})
           //this.$router.push({ name: `zone${zone}`})
           this.$router.push({ name: `zones`})
        },
         switchAll(){
          this.$emit('msg-rxSelected', {rx:{rxId:'all'}})
        },
        mix(){
          const serverURL = location.hostname
            // Send API Command to NodeRed to do switching. 
              fetch(`http://${serverURL}:1880/switchRX/mix`)
              .then(() => {
                M.toast({ html: `Switch to Mix Mode `, classes: "rounded orange" })
              })
              .catch(error => console.log(error)); 
        },
         switchPreset(preset){
           const serverURL = location.hostname
           if(this.userPresetsExist[preset-1]){
              // Send API Command to NodeRed to do switching. 
              fetch(`http://${serverURL}:1880/switchRX/UserPreset/${preset}`)
              .then(() => {
                if(preset == 1){
                   M.toast({ html: `Switch to Preset${preset}`, classes: "rounded red" })
                }else if(preset == 2){
                   M.toast({ html: `Switch to Preset${preset}`, classes: "rounded blue" })
                }else {
                   M.toast({ html: `Switch to Preset${preset}`, classes: "rounded green" })
                }
               
              })
              .catch(error => console.log(error)); 
            }else{
                alert(`Preset ${preset} not exist`)
          }
        },

      PoE(on_off){
            const serverURL = `${location.hostname}:1880`
            this.showWaiting = true // Set immediately to show the message

            // Start a minimum 55-second timer for the message display
            const minDisplayTime = 10000; 
            const startTime = Date.now(); 

            // Send the network request
            fetch( `http://${serverURL}/poe/${on_off}`)
            .then(()=> {
                M.toast({ html: `PoE Power ${on_off}`, classes: "rounded blue" })
            })
            .catch(error => console.log(error))
            .finally(() => { 
              // Calculate how long we need to wait to meet the minimum display time
              const elapsedTime = Date.now() - startTime;
              const remainingTime = minDisplayTime - elapsedTime;

              // Wait the remaining time (or 0 if the request took longer than 3s)
              setTimeout(() => {
                  this.showWaiting = false 
              }, Math.max(0, remainingTime)); // Use Math.max to prevent negative time
            });
          }
  },

  //Life Cycle Hooks
  mounted(){
        // M.AutoInit() // For Materialize to work!
        window.scrollTo(0, 0) //Top of page
  }

}
</script>

<style scoped>
.home{
  display:flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height:100vh;
  /* position:absolute; */
}
.welcome{
  color:white;
  display:flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position:relative;
  top:-10%;
}
.single-zone{
    display: grid;
    grid-template-columns: repeat(2,auto);
    grid-column-gap: 50px;
    justify-content: center;
    align-items: center;
    height:100vh;
    /* border:1px solid red ; */
}
.zone{
    display: grid;
    grid-template-columns: repeat(4,auto);
    grid-column-gap: 25px;
    justify-content: center;
    align-items: center;
    height:90vh;
    /* border:1px solid red ; */
}
.roundBtn{
   display: flex;
   flex-direction: row;
   justify-content: center;
   align-items: center;
   /* border:5px solid white; */
   font-size: 1.5rem;
   height:150px;
   width:150px;
   border-radius: 50%;
   background-color: rgb(28,28,30) ;
}
.roundBtn:hover {
  background-color:#2196f3 !important;
}

#power{
  position:absolute;
  left:10px;
  bottom:10px;
}
.power-btn-relative{
  position:relative;
}
.power-info{
  position:absolute;
  right:0.25rem;
  top:-.75rem;
  font-size: 0.5rem;
}

#poe-off-banner{
  background-color: white;
  display:flex;
  position:absolute;
  top:10%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index:10;
  width: 50%;
  height:50vh;
}
.roundLeft{
  /* Rounds the top-left and bottom-left corners */
    border-top-left-radius: 6px;
    border-bottom-left-radius: 6px;
}
.roundRight{
  /* Rounds the top-right and bottom-right corners */
    border-top-right-radius: 6px;
    border-bottom-right-radius: 6px;
}
</style>