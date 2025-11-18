<template>
 <div class="capacity-control">

      <h2 class = 'white-text'>Capacity Control Display</h2>
      <div class = "zone" >
          <div id = 'wait' @click= "wait" class = "waves-effect waves-light roundBtn btn-large" :disabled= "isDisabled"><i v-if= "redlight" class="material-icons large">check</i><span>Wait</span></div>
          <div id = 'enter' @click= "enter" class = "waves-effect waves-light roundBtn btn-large" :disabled= "isDisabled"><i v-if= "greenlight" class="material-icons large">check</i><span>Come In</span></div>
     </div>

     <!-- Floating Action Button -->
      <div class="fixed-action-btn">
          <a class="btn-floating btn-large blue">
              <router-link to="/"><i class=" large material-icons"> home</i></router-link>
          </a>
      </div>

</div>

</template>

<script>
export default {
  name: 'Capacitycontrol',
  props: [],
  data () {
    return {
      greenlight: false,
      redlight: false,
      isDisabled: false
    }
  },
  computed:{

  },
  methods:{
         enter(){
          const serverURL = `${location.hostname}:1880`
          M.toast({ html: `Come In -Sent `, classes: "rounded green" })
          fetch(`http://${serverURL}/showImageHdmi/picture1`)
          this.greenlight = true
          this.redlight = false
          this.isDisabled = true
          setTimeout(()=>{
            this.isDisabled = false
          }, 3000)
         },
         wait(){
          const serverURL = `${location.hostname}:1880`
          M.toast({ html: `Please Wait - Sent `, classes: "rounded red" })
          fetch(`http://${serverURL}/showImageHdmi/picture2`)
          this.greenlight = false
          this.redlight = true
          this.isDisabled = true
          setTimeout(()=>{
            this.isDisabled = false
          }, 3000)

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
.capacity-control{
  display:flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height:100vh;
  position:absolute;
}

.zone{
    display: grid;
    grid-template-columns: repeat(2,auto);
    grid-column-gap: 25px;
    justify-content: center;
    align-items: center;
    height:80vh;
    /* border:1px solid red ; */
}
.roundBtn{
   display: flex;
   flex-direction: row;
   justify-content: center;
   align-items: center;
   border:5px solid white;
   font-size: 2rem;
   height:250px;
   width:250px;
   border-radius: 50%;
   background-color: rgb(28,28,30) ;
}

#enter{
       background-color: green ;
}
#wait{
       background-color: red ;
    
}
:disabled {
  opacity: 0.5;
}


</style>
