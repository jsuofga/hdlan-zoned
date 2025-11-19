<template>
  <div class="name-outputs box ">

    <div class = 'formContainer'>
        <h5 class = "center-align">Add Displays </h5>
        <div class = 'zoneMenu' > 
         <label class="center-align"><strong>Pick zone for display</strong> </label>
          <div class = 'zoneSelect'>
              <p @click= "zoneSelect(item,index)" v-for="(item,index) in localZoneNames" :key="index">
                  <label>
                    <input name="group1" type="radio"/>
                    <span>{{item}}</span>
                  </label>
              </p>
          </div>
        </div>

        <div class = 'field inputDiv' >
              <input id = 'input' name="input" v-model= "tvName" placeholder="Enter Name of TV to add" type="text" maxlength="10">
              <span class = "add"><i class="material-icons" v-on:click= "add">add</i></span>
        </div>

        <div class = 'listDiv'>
              <div class = "gridItem" v-for="(item,index) in localtvNames" :key="index">
                  <p>RX{{index+1}} @ Port {{localUserSwitchConfig.TXports + (index+1)}}</p>
                  <p>{{localtvNames[index]}}</p>
                  <span class = "edit"><i class="material-icons modal-trigger" href="#modal3" v-on:click= "edit(index)">edit</i></span>
                  <small>Zone-{{zones[index]}}</small>
                  <span class = "trash"><i class="material-icons" v-on:click= "trash(index)">delete_forever</i></span>
              </div>
        </div>

        <div class="field center-align">
                <button v-on:click = "cancel" class="waves-effect red waves-light btn">Cancel</button>
                <button v-on:click = "save" class="waves-effect waves-light btn blue ">Update/Save</button>
        </div> 

    </div >
              <!-- Modal Structure -->
              <div id="modal3" class="modal">
                <div class="modal-content">
                  <h4 class = "center-align" >TV {{id + 1}}</h4>
                    <label v-bind:for= "localtvNames[id]">TV{{id+1}} Name.</label>
                    <input class = 'inputFont' type="text" name = "localtvNames[id]" v-model= "localtvNames[id]" maxlength="10">
   
                  <div class = 'ModalzoneSelect'>
                    <p @click= "zoneSelect(item,index)" v-for="(item,index) in localZoneNames" :key="index">
                        <label>
                          <input name="group1" type="radio"/>
                          <span>{{item}}</span>
                        </label>
                    </p>
                  </div>

                </div>
                <div class="modal-footer">
                    <a class= "modal-close waves-effect waves-light btn blue">OK</a>
                </div>
              </div>

  </div>

</template>

<script>

export default {
    name: 'Name_outputs',
    props:['zones','zonesId','zoneNames','tvNames','UserSwitchConfig'],
    watch:{
      // ---  Watcher for zones Prop ---
        zones: {
            handler(newZones) {
                if (newZones && newZones.length > 0) {
                    this.localZones = [...newZones]; // Create local copy
                }
            },
            immediate: true
        },

        // ---  Watcher for zonesId Prop ---
        zonesId: {
            handler(newZonesId) {
                if (newZonesId && newZonesId.length > 0) {
                    this.localZonesId = [...newZonesId]; // Create local copy
                }
            },
            immediate: true
        },
        tvNames: {
            handler(newTvNames) {
                if (newTvNames && newTvNames.length > 0) {
                    this.localtvNames = [...newTvNames]; // Create local copy
                }
            },
            immediate: true
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
          UserSwitchConfig: {
            handler(newUserSwitchConfig) {
                // Check 1: Ensure it's not null/undefined
                // Check 2: Ensure it has keys (i.e., it's not just {})
                if (newUserSwitchConfig && Object.keys(newUserSwitchConfig).length > 0) {
                    // Update the local data with a deep copy of the object's properties
                    // Use the spread operator for a shallow copy of properties
                    this.localUserSwitchConfig = { ...newUserSwitchConfig }; 
                }
            },
            immediate: true
    }
    },
    data(){
        return{
          tvName: null,
          zone:null,
          id:'',  // RX selected for editing . ID = 0 is RX1, ID = 1 is RX2
           //  Create a local copy of the prop
          localZones: [],
          localZonesId:[],
          localtvNames:[],
          localZoneNames:[],
          localUserSwitchConfig:{}
          
        }
    },
    methods: {
      zoneSelect(item,index){
          // console.log('zoneSelect',index)
          this.zoneId = index+1
          this.zone = item  
          this.localZones[this.id] = this.zone
          this.localZonesId[this.id] = index +1
          this.$forceUpdate()
      },
      add(){
          if(this.localtvNames.length < this.localUserSwitchConfig.RXports){
           this.localtvNames.push(this.tvName)
           this.localZones.push(this.zone)
           this.localZonesId.push(this.zoneId)
           this.tvName = ''
          //if inputs exceeds number of rxCount on switch
        }else{
          alert('Exceeded number of RX ports')
          this.tvName  = ''
        }
      },
      edit(index){
        //this.tvNames.splice(index,1)
        // console.log(index)
        this.id = index
      },
      trash(index){
        this.localtvNames.splice(index,1)
        //console.log(index)
      },
      save(e){
          e.preventDefault()
          M.toast({ html: `Saving updates`, classes: "rounded blue" });

          const serverURL = `${location.hostname}:3000`
          // Read user inputs and save
          let tvNamesZones = []
          this.localtvNames.forEach((item,index)=>{
             let tvAndzone = {rxId: index+1, name:item, zoneId: this.localZonesId[index], zone:this.localZones[index]}
             tvNamesZones.push(tvAndzone) 
          })
          console.log(tvNamesZones)
          this.$emit('msg-tvNamesZonesUpdated', tvNamesZones)
   
          //Send to Express to save in 'UserTvNames.txt'
          fetch(`http://${serverURL}/write/UserTvNames/${JSON.stringify(tvNamesZones)}`)
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

.box{
   display: flex;
   justify-content: center;
   /* border:1px solid red; */
   width:100%;
}
.formContainer{
  display:flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: white;
  border-radius:10px;
  width:100%;
}
.field{
  width:80%;
  margin:20px;
}
.zoneMenu{
  display:flex;
  flex-direction:column;
  justify-content: center;
  width:80%;
  margin-bottom:20px;
}
.zoneSelect{
  display:grid;
  grid-template-columns:repeat(4, 1fr);
  border:1px solid lightgray;
  border-radius: 4px;
  width:100%;

}
.ModalzoneSelect{
  display:grid;
  grid-template-columns:repeat(4, auto);

}
#input{
  border:1px solid lightgray;
  border-radius: 4px;
}
input[type=text]:focus{
  border-bottom: 1px solid #2196f3 !important ;
} 
.btn{
  margin: 30px;
}
.feedback{
  color:red
}
.inputDiv{
    position:relative;
    margin: 2px;
}
.listDiv{
    display:grid;
    grid-template-columns:repeat(10, 1fr);
    width:100%;
    margin:10px;

}
.gridItem{
  display:flex;
  flex-direction: column;
  align-items: center;
  padding:2px;
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
.edit{
    position:absolute;
    right: 0px;
    top: 0px;
    cursor: pointer;
    color: black;
    transform: scale(.8);
}
.trash{
    position:absolute;
    left: 2px;
    top: 2px;
    cursor: pointer;
    color: black;
    transform: scale(.8);
}
p{ 
  margin:10px;
  padding:5px
}

[type="radio"]:checked + label:after,
[type="radio"].with-gap:checked + label:after {
  background-color: #2196f3 !important;
}

</style>