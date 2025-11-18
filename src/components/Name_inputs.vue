<template>
  <div class="name-inputs box ">
      <form >
            <h5>Add Video Input </h5>
            <div class="field">
                <div class = 'inputDiv' > 
                      <input id = 'input' name="input" v-model= "sourceName" placeholder="Enter Name of Video Input to add" type="text" required maxlength="10">
                      <span class = "add"><i class="material-icons" v-on:click= "add">add</i></span>
                </div>
            </div>

          <div class = 'listDiv'>
                   <div class = "gridItem" v-for="(item,index) in localSourceNames" :key="index">
                      <label v-bind:for= "localSourceNames[index]">TX{{index+1}}</label>
                      <input class = 'inputFont' type="text" name = "localSourceNames[index]" v-model= "localSourceNames[index]" maxlength="10">
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
    name: 'Name_inputs',
    props:['sourceNames','snmpStatus'],
    watch:{
      localSourceNames: function() {
          this.$emit('msg-sourceNamesUpdated',this.localSourceNames)
      }
    },
    data(){
        return{
          // 1. Create a local copy of the prop
          localSourceNames: [...this.sourceNames], // Use spread syntax for a shallow copy
          sourceName: '' // Initialize the input model
        }
    },
    methods: {
      
      add(){
        if(this.snmpStatus.txCount == 0){
          // switch configured as RX only switch. 
           this.localSourceNames.push(this.sourceName)
           this.sourceName = ''
        }else{
           if(this.localSourceNames.length < this.snmpStatus.txCount){
           this.localSourceNames.push(this.sourceName)
           this.sourceName = ''
        //if inputs exceeds number of txPorts on switch
          }else{
            alert('Exceeded number of TX ports')
            this.sourceName = ''
          }
        }

      },
      trash(index){
        this.localSourceNames.splice(index,1)
        //console.log(index)

      },
      save(e){
          e.preventDefault()
          M.toast({ html: `Saving updates`, classes: "rounded blue" });
          
          const serverURL = `${location.hostname}:3000`
          //console.log(this.sourceNames)

          // Read user inputs and save 
          let videoInputNames = {}
          this.localSourceNames.forEach((item,index)=>{
             videoInputNames[`in${index+1}`] = item ;
          })
          console.log('ir favorites', videoInputNames)
          // Send to Express to save in 'UserInputNames.txt'
          fetch(`http://${serverURL}/write/UserInputNames/${JSON.stringify(videoInputNames)}`)
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
        // M.AutoInit() // For Materialize to work!
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
  grid-template-columns:repeat(10, 1fr);
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