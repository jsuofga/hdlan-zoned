<template>
  <div class="name-zones box ">
     
      <form >
            <h5>Create Zones </h5>
            <div class="field">
                <!-- <label for="Video Input"></label> -->
                <div class = 'inputDiv' > 
                      <input id = 'input' name="input" v-model= "zoneName" placeholder="Enter Name of Zone/Group " type="text" required maxlength="10">
                      <span class = "add"><i class="material-icons" v-on:click= "add">add</i></span>
                </div>
            </div>

          <div class = 'listDiv'>
                   <div class = "gridItem" v-for="(item,index) in localZoneNames" :key="index">
                      <label>Zone{{index+1}}.</label> 
                      <input class = 'inputFont' type="text" name = "localZoneNames[index]" v-model= "localZoneNames[index]" maxlength="10"> 
                      <span class = "trash"><i class="material-icons" v-on:click= "trash(index)">delete_forever</i></span>
                  </div>
          </div>

          <div class="field center-align">
                <button v-on:click = "cancel" class="waves-effect red waves-light btn">Cancel</button>
                <button v-on:click = "save" class="waves-effect waves-light btn blue">Update/Save</button>
          </div>

      </form>

  </div>

</template>

<script>

export default {
    name: 'Name_zones',
      props:['zonesId','zoneNames','tvNames'],
   
    watch:{
      localZoneNames: function() {
          this.$emit('msg-zoneNamesUpdated',this.localZoneNames)
      },

      // Watches the incoming prop
        zoneNames: {
            handler(newZoneNames) {
                // When the prop changes (i.e., when data finally arrives)
                if (newZoneNames && newZoneNames.length > 0) {
                    // Update the local data with a copy of the new data
                    this.localZoneNames = [...newZoneNames];
                }
            },
            immediate: true // Run the watcher once immediately on component load
        },
        // --- Watcher for zonesId Prop ---
        zonesId: {
            handler(newZonesId) {
                if (newZonesId && newZonesId.length > 0) {
                    this.localZonesId = [...newZonesId];
                }
            },
            immediate: true
        },
        // --- Watcher for tvNames Prop ---
        tvNames: {
            handler(newTvNames) {
                if (newTvNames && newTvNames.length > 0) {
                    this.localtvNames = [...newTvNames];
                }
            },
            immediate: true
        }
    },
    data(){
        return{
          zoneName: '',
          localZoneNames: [],
          localZonesId: [],
          localtvNames: []
        }
    },
    methods: {
      add(){
        //Check to make sure only maxium Zones created
        if(this.localZoneNames.length < 8){
          this.localZoneNames.push(this.zoneName)
          this.zoneName = ''
        //if zone exceed 8
        }else{
          alert('Max allowed zones is 8')
          this.zoneName = ''
        }
      },
      trash(index){
        this.localZoneNames.splice(index,1)
        //console.log(index)
      },
      save(e){
          e.preventDefault()
          M.toast({ html: `Saving updates`, classes: "rounded blue" });
          const serverURL = `${location.hostname}:3000`
          // Read user inputs and save 
          let zoneInputNames = {}
          this.localZoneNames.forEach((item,index)=>{
             zoneInputNames[`zone${index+1}`] = item ;
          })
       
          let tvNamesZones = []
          this.localtvNames.forEach((item,index)=>{
             let tvAndzone = {rxId: index+1, name:item, zoneId: this.localZonesId[index], zone:zoneInputNames[`zone${this.localZonesId[index]}`]}
             tvNamesZones.push(tvAndzone) 
          })
          
          this.$emit('msg-tvNamesZonesUpdated', tvNamesZones)

          //Send to Express to save in 'UserTvNames.txt'
          fetch(`http://${serverURL}/write/UserTvNames/${JSON.stringify(tvNamesZones)}`)
          .then((data)=>{

          })
          .catch(error => console.log(error));

          // Send to Express to save in 'UserZoneNames.txt'
          fetch(`http://${serverURL}/write/UserZoneNames/${JSON.stringify(zoneInputNames)}`)
          .then((data)=>{
            this.$router.push({name:'home'})
          })
          .catch(error => console.log(error));
   
      },
      cancel(e){
          e.preventDefault()
          this.$router.push({name:'home'})
      }
  },
  //Life Cycle Hooks
    mounted(){
        M.AutoInit() // For Materialize to work!
        window.scrollTo(0, 0) //Top of page
    }
}   

</script>

<style scoped>

.container{
  display: flex;
  width:90%; 
  /* justify-content: center; */
  align-items: center;
}

.box{
   display: flex;
   justify-content: center;
   /* border:1px solid red; */
   width:100%;
}
form{
  display:flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: white;
  border-radius:10px;
  width:90%;
}
#input{
  border:1px solid lightgray;
  border-radius: 4px;
}
input[type=text]:focus{
  border-bottom: 1px solid #2196f3 !important ;
} 
.field{
  width:50%;
}
.btn{
  margin: 30px;
}
.feedback{
  color:red
}
.inputDiv{
    position:relative;
}
.listDiv{
    display:grid;
    grid-template-columns:repeat(4, 1fr);
    position:relative;
    margin:10px
}
.gridItem{
  padding:5px;
  position:relative;
  border:1px solid lightgray;
  margin:1px;
  border-radius: 4px;
}
.inputFont{
  font-size: 14px !important;
}
.add{
    position:absolute;
    right: 10px;
    top: 10px;
    cursor: pointer;
}
.trash{
    position:absolute;
    right: 2px;
    top: 2px;
    cursor: pointer;
    color: black;
    transform: scale(.8);
}

</style>