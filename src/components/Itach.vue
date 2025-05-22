<template>
  <div class=" box ">
      <form >
              <div class= "field">
                 <select v-model= "selected">
                        <option value="" >Select Number of Set Top Boxes  </option>
                        <option v-for= "(item,index) in count" :key= "index" >{{item+1}}</option>
                 </select>
                 <p v-if = "selected" class="center-align" ><i class="material-icons center-align" >settings_remote</i> {{selected}}</p>
                 <p v-else class="center-align" ><i class="material-icons center-align" >settings_remote</i> {{stbQty[0]}}</p>
                              
             </div>
            <h5>Add Global Cache Itach</h5>
            <div class="field">
                <!-- <label for="Video Input"></label> -->
                <div class = 'inputDiv' > 
                      <input id = 'input' name="input" v-model= "itachIP" placeholder="IP Address of Itach (ex. 192.168.1.xx)" type="text" required maxlength="15">
                      <span class = "add"><i class="material-icons" v-on:click= "add">add</i></span>
                </div>
            </div>

          <div class = 'listDiv'>
                   <div class = "gridItem" v-for="(item,index) in itachIPs" :key="index">
                      <label v-bind:for= "itachIPs[index]">Global Cache Itach {{index+1}}.</label>
                      <input class = 'inputFont' type="text" name = "itachIPs[index]" v-model= "itachIPs[index]" maxlength="15"  @blur="validateItem(index)">
                      <p class="feedback center-align" v-if="feedbackMessages[index]">{{ feedbackMessages[index] }}</p>
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
    name: 'Itach',
    props:['itachIPs','stbQty'],
    watch:{
      itachIPs: function() {
         // this.$emit('msg-itachIPsUpdated',this.itachIPs)
      }
    },
    data(){
        return{
          itachIP:null,
          itachIPs: [],
          stbQty:[],
          selected:'',
          count: [...Array(24).keys()],
          feedbackMessages: []    // <-- per-item feedback
        }
    },
    methods: {

      isValidIP(ip) {
        const ipv4Regex = /^(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}$/;
        return ipv4Regex.test(ip);
      },
      add(){
          if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(this.itachIP)){
                  this.itachIPs.push(this.itachIP)
                  this.itachIP = ''

          }else{
                alert('Enter Valid IP Address')
          }
      },
      trash(index){
        this.itachIPs.splice(index,1)
      },
      validateItem(index) {
          const ip = this.itachIPs[index] || '';
          if (!this.isValidIP(ip)) {
            this.$set(this.feedbackMessages, index, 'Invalid IP format');
          } else {
            this.$set(this.feedbackMessages, index, '');
          }
      },
      save(e){
          e.preventDefault()
          // Check for invalid IPs
          let hasInvalid = false;
          this.itachIPs.forEach((ip, index) => {
            if (!this.isValidIP(ip)) {
              this.$set(this.feedbackMessages, index, 'Invalid IP format');
              hasInvalid = true;
            } else {
              this.$set(this.feedbackMessages, index, '');
            }
          });

          if (hasInvalid) {
            alert('Please correct invalid IP addresses before saving.');
            return; // Stop the save process
          }

          M.toast({ html: `Saving updates`, classes: "rounded blue" });
          
          const serverURL = `${location.hostname}:3000`        

          // Read user inputs and save 
          let itachAddresses = {}
          this.itachIPs.forEach((item,index)=>{
             itachAddresses[`itach${index+1}_ipaddress`] = item ;
          })
          // Add the number of settop boxes
          itachAddresses.set_top_box_count = this.selected
          // Send to Express to save in 'UserItachIPs.txt'
          fetch(`http://${serverURL}/write/UserItachIPs/${JSON.stringify(itachAddresses)}`)
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
  grid-template-columns:repeat(5, 1fr);
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