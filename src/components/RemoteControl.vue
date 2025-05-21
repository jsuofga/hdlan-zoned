 <template>

  <div class="remote-control">
        <h6 class="center-align white-text">Remote for {{remoteName}}</h6>
        <div v-if ="remote !=5" class = 'grid-container1'>
            <div class = 'grid-item1'><i id = "power-on" @click= "otherBtnPressed('on')" class="material-icons">power_settings_new</i></div>
            <div class = 'grid-item1'></div>
            <div class = 'grid-item1'><i  @click = "otherBtnPressed('cursor_up')" class="material-icons btn-icons">expand_less</i></div>
            <div class = 'grid-item1'></div>
            <div class = 'grid-item1'><i id = "power-off"  @click = "otherBtnPressed('off')" class="material-icons">power_settings_new</i></div>
            <div class = 'grid-item1'></div>
            <div class = 'grid-item1'><i id ='cursor-left'  @click = "otherBtnPressed('cursor_left')" class="material-icons btn-icons rotate-cw">expand_less</i></div>
            <div class = 'grid-item1'><div  @click = "otherBtnPressed('cursor_enter')" class = 'roundBtn'>Select</div></div>
            <div class = 'grid-item1'><i id ='cursor-right'  @click = "otherBtnPressed('cursor_right')" class="material-icons btn-icons ">expand_less</i></div>
            <div class = 'grid-item1'></div>
            <div class = 'grid-item1'></div>
            <div class = 'grid-item1'></div>
            <div class = 'grid-item1'><i  @click = "otherBtnPressed('cursor_down')" class="material-icons btn-icons">expand_more</i></div>
            <div class = 'grid-item1'></div>
            <div class = 'grid-item1'></div>
        </div>
        <div  v-if ="remote !=5" class = 'grid-container2'>
            <div class = 'grid-item2'><a  @click = "otherBtnPressed('guide')" class="waves-effect waves-light btn">Guide</a></div>
            <div class = 'grid-item2'><div @click = "numberBtnPressed(1)" class = 'roundBtn'>1</div></div>
            <div class = 'grid-item2'><div @click = "numberBtnPressed(2)" class = 'roundBtn'>2</div></div>
            <div class = 'grid-item2'><div @click = "numberBtnPressed(3)" class = 'roundBtn'>3</div></div>
            <div class = 'grid-item2'><i  @click = "otherBtnPressed('ch_up')" class="material-icons btn-icons">expand_less</i></div>
            <div class = 'grid-item2'><a  @click = "otherBtnPressed('menu')" class="waves-effect waves-light btn">Menu</a></div>
            <div class = 'grid-item2'><div @click = "numberBtnPressed(4)" class = 'roundBtn'>4</div></div>
            <div class = 'grid-item2'><div @click = "numberBtnPressed(5)" class = 'roundBtn'>5</div></div>
            <div class = 'grid-item2'><div @click = "numberBtnPressed(6)" class = 'roundBtn'>6</div></div>
            <div class = 'grid-item2'>Channel</div>
            <div class = 'grid-item2'></div>
            <div class = 'grid-item2'><div @click = "numberBtnPressed(7)" class = 'roundBtn'>7</div></div>
            <div class = 'grid-item2'><div @click = "numberBtnPressed(8)" class = 'roundBtn'>8</div></div>
            <div class = 'grid-item2'><div @click = "numberBtnPressed(9)" class = 'roundBtn'>9</div></div>
            <div class = 'grid-item2'><i  @click = "otherBtnPressed('ch_down')" class="material-icons btn-icons">expand_more</i></div>
           <div class = 'grid-item2'><a  @click = "otherBtnPressed('exit')" class="waves-effect waves-light btn">Exit</a></div>
            <div class = 'grid-item2'></div>
            <div class = 'grid-item2'><div @click = "numberBtnPressed(0)" class = 'roundBtn'>0</div></div>
            <div class = 'grid-item2'></div>
            <div class = 'grid-item2'><a  @click = "otherBtnPressed('enter')" class="waves-effect waves-light btn">Enter</a></div>
        </div>

        <!-- ROKU  -->
        <div v-else class = 'grid-container1'>
          <div class = 'grid-item1'></div>
          <div class = 'grid-item1'></div>
          <div class = 'grid-item1'></div>
          <div class = 'grid-item1'><i @click = "otherBtnPressed('menu_home')" class="material-icons btn-icons-small">home</i></div>
          <div class = 'grid-item1'></div>
          <div class = 'grid-item1'><i id = "power-on" @click= "BtnPressed('on')" class="material-icons">power_settings_new</i></div>
          <div class = 'grid-item1'></div>
          <div class = 'grid-item1'><i @click = "otherBtnPressed('cursor_up')" class="material-icons btn-icons">expand_less</i></div>
          <div class = 'grid-item1'></div>
          <div class = 'grid-item1'><i id = "power-off"  @click = "otherBtnPressed('off')" class="material-icons ">power_settings_new</i></div>
          <div class = 'grid-item1'></div>
          <div class = 'grid-item1'><i id ='cursor-left'  @click = "otherBtnPressed('cursor_left')" class="material-icons btn-icons">expand_less</i></div>
          <div class = 'grid-item1'><div  @click = "otherBtnPressed('cursor_enter')" class = 'roundBtn'>Select</div></div>
          <div class = 'grid-item1'><i id ='cursor-right'  @click = "otherBtnPressed('cursor_right')" class="material-icons btn-icons ">expand_less</i></div>
          <div class = 'grid-item1'></div>
          <div class = 'grid-item1'></div>
          <div class = 'grid-item1'></div>
          <div class = 'grid-item1'><i @click = "otherBtnPressed('cursor_down')" class="material-icons btn-icons">expand_more</i></div>
          <div class = 'grid-item1'></div>
          <div class = 'grid-item1'></div>
        </div>

        <div class = 'grid-container3'>
            <div v-for="(item, index) in favChNames" :key="index" class = 'grid-item3'> <a @click = "favoriteBtnPressed(index)" class="waves-effect waves-light btn-favs">{{favChNames[index]}}<span>{{favChStations[index]}}</span></a></div>
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
  name: 'RemoteControl',
  props:['sourceNames',"favChNames","favChStations","remote"],
  data () {
    return {
      remote: ''  ,    //
      numberPressed: null,
      btnPressed: null,
      // favChNames:[],
      // favChStations:[]
    }
  },
  computed:{
    remoteName: function(){
      return this.sourceNames[this.remote-1]
    },

    unit: function () {
      return (Math.trunc(this.remote / 4) + 1)  // itach unit number ( 3 ports per unit)
    },
    port:function () { //itach port number
      if((this.remote % 3) != 0){
        return ((this.remote % 3))  //itach port number
      }else{
        return (3)  //itach port number
      }
    },
  },
  methods:{
      numberBtnPressed(_number){
         this.numberPressed = `btn_${_number}`
         const serverURL = `${location.hostname}:1880`
         M.toast({ html: `IR sent `, classes: "rounded blue" })
         console.log(`http://${serverURL}/sendir/unit/${this.unit}/port/${this.port}/ir/${this.numberPressed}`)
         fetch(`http://${serverURL}/sendir/unit/${this.unit}/port/${this.port}/ir/${this.numberPressed}`)
      },
      otherBtnPressed(_button){
          this.btnPressed =`btn_${ _button}`
          const serverURL = `${location.hostname}:1880`
          M.toast({ html: `IR sent `, classes: "rounded blue" })
          console.log(`http://${serverURL}/sendir/unit/${this.unit}/port/${this.port}/ir/${this.btnPressed }`)
          fetch(`http://${serverURL}/sendir/unit/${this.unit}/port/${this.port}/ir/${this.btnPressed }`)
      },
      favoriteBtnPressed(_favorite){
          let favCh = this.favChStations[_favorite]
          const serverURL = `${location.hostname}:1880`
          M.toast({ html: `IR sent `, classes: "rounded blue" })
          console.log(`http://${serverURL}/sendir/unit/${this.unit}/port/${this.port}/irfavorite/${favCh}`)
          fetch(`http://${serverURL}/sendir/unit/${this.unit}/port/${this.port}/irfavorite/${favCh}`)
      },
        
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.grid-container1,.grid-container2,.grid-container3  {
  color:white;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  justify-content: center;
  align-items: center ;
  grid-gap: 5px;
  height:25vh;
  padding-left:50px;
  padding-right:50px;
  /* border:1px solid red; */
  margin:5px;
}
.grid-container2{
    height:35vh;
}
.grid-container3 {
 height:25vh;
}

.grid-item1,.grid-item2,.grid-item3{
  display:flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  /* border:1px solid orange; */
}
.grid-item2{
  height: 80%;

}
.grid-item3{
  height: 100%;

}
.btn-icons{
    transform: scale(3)  
}
.btn-icons-small{
    transform: scale(2)  
}
#power-on{
    color:green;
    transform: scale(2)
}
#power-off{
    color:red;
    transform: scale(2)
}
#cursor-left{
    transform:rotate(-90deg) scale(3);
}
#cursor-right{
    transform:rotate(90deg) scale(3);
}
.roundBtn{
   display: flex;
   flex-direction: row;
   justify-content: center;
   align-items: center;
   font-size: 1rem;
   height:50px;
   width:50px;
   border-radius: 50%;
   background-color: rgb(28,28,30) ;
   cursor: pointer
}
.btn-favs{
    display:flex;
     flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: black;
    color:white;
    width:70%;
    height:70%;
    border-radius: 6px;
}
.btn{
    border-radius:6px;
    width:70%
}
i{
  cursor: pointer
}


</style>