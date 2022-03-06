<template>

  <div class="zones">
        <div class = 'grid-container'>
            <div v-for="(item, index) in tvsInZone" :key="index" class='grid-item'>
              <div data-target="slide-out" @click= "emitMsg(item)" class="btn-large sidenav-trigger" style= 'color:black'><small>{{item.name}}</small><span>P{{item.rxId + snmpStatus.txCount}}</span></div>
              <div class = 'feedbackRX'>{{sourceNames[snmpStatus.PortVlanMembership[item.rxId-1+snmpStatus.txCount] -2]}}</div>
            </div>
        </div>
        <div id = "allRX">
              <div data-target="slide-out" @click= "emitMsg({name:'',rxId: `zone${zone}`, zone:tvsInZone[0].zone, zoneId:''})" class=" btn-large all sidenav-trigger"><i class="material-icons large">all_inclusive</i><strong> all {{tvsInZone[0].zone}} TVs</strong></div>
        </div>
        <!-- Floating Action Button -->
          <div class="fixed-action-btn">
              <a class="btn-floating btn-large blue">
                <router-link to="/"><i class="large material-icons">home</i></router-link>
              </a>
          </div>
  </div>
</template>

<script>

export default {
  name: 'Zones',
  props:['snmpStatus','zoneNames','tvNames','tvNamesZones','zones','sourceNames','zoneNumber'],
  data () {
    return {
      zone: this.zoneNumber      // Enter Zone here
    }
  },
  computed:{
      tvsInZone: function(){
         // Filter all the TVs that are in Zone
         this.zoneTVs = this.tvNamesZones.filter((item,index) => item.zoneId == this.zone )
         console.log(this.zoneTVs)
         return (this.zoneTVs)
      }
  },
  methods:{
    emitMsg(item){
        console.log(item);
        this.$emit('msg-rxSelected', {rx:item})

    },


  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.zones{
  display:flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  width:100%;
  height:100vh;
}
.grid-container {
  color:white;
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  justify-content: center;
  align-items: center ;
  grid-gap: 5px;
  width:90%;
  height:80vh;
  position: relative; 
}
#allRX{
  width:30%;
}

.grid-item{
  display:flex;
  flex-direction: column;
  align-items: center;
  /* border:1px solid green; */
}
.btn-large{
  background-color:white;
  border-radius: 4px;
  width:100%;
  padding:2px;
  position:relative;
}
.all{
  color: black;
  border-radius: 10px;
}
small{
    text-transform: capitalize;
    color:black
}
span{
  position:absolute;
  color:grey;
  padding:0px;
  top:-20px;
  right:0px;
  transform: scale(.7);
}
.btn-large:hover{
  background-color:#2196f3  !important ;
  color:white !important;
}

</style>