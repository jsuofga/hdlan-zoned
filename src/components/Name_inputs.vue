<template>
  <div class="name-inputs box ">
      <form >
            <h5>Add Video Input </h5>
            
            <div class="field">
                <div class = 'inputDiv' > 
                      <input id = 'input' name="input" v-model= "sourceName" placeholder="Enter Name of Video Input to add" type="text" required maxlength="10">
                      <div class = "add waves-light " @click = "add()"><i class="material-icons waves-effect left">add</i>Add Input</div>
                </div>
            </div>
            <div v-if = "inputNameError != ''" class = 'red-text'>{{inputNameError}}</div>
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
      },
      sourceNames: {
            handler(newSourceNames) {
                // Only update the local copy if the incoming data is non-empty
                if (newSourceNames && newSourceNames.length > 0) {
                    this.localSourceNames = [...newSourceNames];
                }
            },
            // CRITICAL: Runs immediately on component load to catch initial/async data
            immediate: true 
        },
        snmpStatus: {
            handler(newsnmpStatus) {
                // Only update the local copy if the incoming data is non-empty
              if (newsnmpStatus && Object.keys(newsnmpStatus).length > 0) { 
                  this.localsnmpStatus = {...newsnmpStatus};
              }
            },
            // CRITICAL: Runs immediately on component load to catch initial/async data
            immediate: true 
        },
    },
    data(){
        return{
          // 1. Create a local copy of the prop
          localSourceNames: [], // Use spread syntax for a shallow copy
          localsnmpStatus:{},
          sourceName: '', // Initialize the input model
          inputNameError: ''
        }
    },
    methods: {
      
      add(){
       
       // Reset error message at the start of the attempt
        this.inputNameError = '' 
        
        const name = this.sourceName.trim() // Trim whitespace (as discussed earlier)

        // --- 1. Check for Empty Input ---
        if (!name) {
            this.inputNameError = 'Input name cannot be empty.'
            this.sourceName = '' // Clear input
            return
        }

        // --- 2. Check for Duplicate Name (Case-insensitive) ---
        // Maps existing names to lowercase, then checks if the new name (also lowercase) is included.
        if (this.localSourceNames.map(n => n.toLowerCase()).includes(name.toLowerCase())) {
            this.inputNameError = `A video input named "${name}" already exists.`
            this.sourceName = '' // Clear input
            return
        }
        
        // --- 3. Check for Max Limit ---
        const maxTxCount = this.localsnmpStatus.txCount;

        // If switch is TX/RX switch (txCount > 0)
        if (maxTxCount > 0) {
            if (this.localSourceNames.length < maxTxCount) {
                // Success
                this.localSourceNames.push(name)
                this.sourceName = ''
            } else {
                // Limit exceeded
                this.inputNameError = `Exceeded maximum of ${maxTxCount} available TX ports.`
                this.sourceName = ''
            }
        
        // If switch is configured as RX only switch (txCount == 0)
        } else if (maxTxCount == 0) {
            // Note: If maxTxCount is 0, typically you shouldn't be adding sources. 
            // Since your original code allowed adding inputs here, we'll keep it, 
            // but log a warning or suggest removing the ability to add inputs if txCount is 0.
            this.inputNameError = 'Warning: Switch configured as RX-only, input limit not applied.'
            this.localSourceNames.push(name)
            this.sourceName = ''
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
    top: 10%;
    cursor: pointer;
    color:white;
    border-radius: 6px;
    padding: 5px;
    background-color:#2196f3
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