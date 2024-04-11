<template>
 <div class="home">
      <!-- <div v-if= "oneZoneOnly === 0" class = "welcome"> -->
      <div v-if= "zoneNamesToDisplay.length === 0" class = "welcome">
        <h3>Welcome</h3>
        <h3>Goto settings to add displays to system</h3>
          
      </div>
      <!-- <div v-else-if= "oneZoneOnly === 1" class = "single-zone" > -->
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

</div>

</template>

<script>
export default {
  name: 'Home',
  props: ['snmpStatus','zoneNamesToDisplay','userPresetsExist','sourceNames','tvNames'],
  data () {
    return {

    }
  },
  computed:{
      // oneZoneOnly: function(){
      //   console.log("length:",this.zoneNamesToDisplay.length)
      //    if(this.zoneNamesToDisplay.length == 0){
      //      return (0)
      //    }else if (this.zoneNamesToDisplay.length == 1){
      //      return (1)
      //    }
      //    else{
      //      return (false)
      //    }
      // }
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

  },

  //Life Cycle Hooks
  mounted(){
        M.AutoInit() // For Materialize to work!
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
  position:absolute;
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

</style>
