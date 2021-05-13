<template>
  <div class="video-wall-config box">

      <form >
            <h5>Set Favorite Channels</h5>
              <!-- <h5>{{favChNames[0]}}</h5> -->
             <div class= "field">
                 <select v-model= "selected">
                        <option value="" >Set Channel Number</option>
                        <option v-for= "(item,index) in channels" :key= "index" >{{item+1}}</option>
                 </select>
                 <div class = "center-align"> <button v-on:click = "add" class="waves-effect green waves-light btn"> <i class="material-icons left">arrow_downward</i>Add</button></div>
             </div>

         <div class = 'listDiv'>
                   <div class = "gridItem" v-for="(item,index) in favChNames" :key= "index"  >
                      <label class = "chip">
                        {{favChNames[index]}}
                      </label>
                      <div>
                          <p>Channel-{{favChStations[index]}}</p>
                      </div>

                      <input class = 'inputFont' v-bind:class = "errorFeedback" type="text" v-model = "favChNames[index]"  placeholder="Enter Station Name"  maxlength="10" >
                      <span class = "trash"><i class="material-icons" v-on:click= "trash(index)">delete_forever</i></span>
                  </div>
          </div>

          <div class="right-align">
                <button v-on:click = "cancel" class="waves-effect red waves-light btn">Cancel</button>
                <button v-on:click = "save" class="waves-effect waves-light btn blue">Update/Save</button>
          </div>

      </form>
        
  </div>

</template>

<script>

export default {
    name: 'Favoritechannels',
    props:["favChNames","favChStations" ],
    watch:{

    },
    data(){
        return{
            channels: [...Array(999).keys()],
            selected: '',
            favChNames:[],
            favChStations:[]
      }
    },

    methods: {
  
      add(e){
        e.preventDefault()
        this.favChNames.push('')
        this.favChStations.push(this.selected)
       },
      trash(index){
        this.favChNames.splice(index,1)
        this.favChStations.splice(index,1)
      },
      edit(index){
        console.log(index)
      },
      save(e){
          e.preventDefault()
          const serverURL = `${location.hostname}:3000`

          if(this.favChNames.includes('')){
               alert("Enter unique name for each channel")
          }else{
            let irFavChannels = {}
            this.favChNames.forEach((item,index)=>{
                  irFavChannels[`fav_ch_name_${index+1}`] = this.favChNames[index]
                  irFavChannels[`fav_ch_${index+1}`] = this.favChStations[index]
            })
            console.log('ir favorites', irFavChannels)
            // Send to Express to save in 'UserFavChannels.txt'
            fetch(`http://${serverURL}/write/UserFavChannels/${JSON.stringify(irFavChannels)}`)
            .then((data)=>{
              this.$router.push({name:'home'})
            })
            .catch(error => console.log(error));
            }

    },
      cancel(e){
        this.$router.push({ name: `home`})
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
  width:70%;
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
  width:80%;
  /* position:relative;
  margin:10px */
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
    transform: scale(.9);
    
}
.edit{
    position:absolute;
    right: 30px;
    top: 2px;
    cursor: pointer;
    color: black;
    transform: scale(.9);
}


</style>