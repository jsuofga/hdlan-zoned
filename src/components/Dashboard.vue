<template>
  <div class="dashboard ">

      <div id = 'vital-stat' class = 'grid-container'>
          <div class = 'grid-item'> Model : {{snmpStatus.model}}</div>
          <div class = 'grid-item'> IP : {{snmpStatus.SwitchIPAddress}}</div>
          <div class = 'grid-item'> Temperature : {{snmpStatus.Temperature}} &#8451;</div>
          <div class = 'grid-item'>Power Supply : {{snmpStatus.PS1Stat}}</div>
          <div class = 'grid-item'> PoE : {{snmpStatus.PoE}} Watts</div>
          <div class = 'grid-item'> PoE Utilization : {{snmpStatus.PoE_Percentage}} %</div>
          <div class = 'grid-item'><span><i class="material-icons tiny ">toys</i>1 : {{snmpStatus.Fan1Stat}}</span></div>
          <div class = 'grid-item'><span><i class="material-icons tiny ">toys</i>2 : {{snmpStatus.Fan2Stat}}</span></div>
          <div class = 'grid-item'><span><i class="material-icons tiny ">toys</i>3 : {{snmpStatus.Fan3Stat}}</span></div>
          <div class = 'grid-item'><span><i class="material-icons small" style = "color:#2196f3">inbox</i></span>Transmitters : {{txCount}}</div>
          <div class = 'grid-item'><span><i class="material-icons small" style = "color:orange">inbox</i></span>Receivers : {{rxCount}}</div>
          <div class = 'grid-item'><span><i class="material-icons small" style = "color:white">inbox</i></span>LAN</div>
      </div>

     <div v-if= "snmpStatus.model !== ''" class = 'sg350'>
        <div v-if= "is52Port" class = 'port1-48'>
            <div class = 'grid-item'  v-for="(item, index) in portS" :key="index" ><i class="material-icons small " v-bind:style= "{color: portsColor[index],opacity: portsActive[index]}" >inbox</i>{{item+1}}</div>
        </div >  
        <div v-else class = 'port1-24'>
            <div class = 'grid-item'  v-for="(item, index) in portS" :key="index" ><i class="material-icons small " v-bind:style= "{color: portsColor[index],opacity: portsActive[index]}" >inbox</i>{{item+1}}</div>
        </div > 
        <div class = 'port-combo-sfp'>
            <div class = 'grid-item'><i class="material-icons small " v-bind:style= "{color: portsColor[portS.length],opacity: portsActive[portS.length]}" >inbox</i>{{portS.length+1}}</div>       
            <div class = 'grid-item'><i class="material-icons small " v-bind:style= "{color: portsColor[portS.length],opacity: portsActive[portS.length]}" >crop_free</i>{{portS.length+1}}b</div>       
            <div class = 'grid-item'><i class="material-icons small " v-bind:style= "{color: portsColor[portS.length+2],opacity: portsActive[portS.length+2]}" >crop_free</i>{{portS.length+3}}</div>       
            <div class = 'grid-item'><i class="material-icons small " v-bind:style= "{color: portsColor[portS.length+1],opacity: portsActive[portS.length+1]}" >inbox</i>{{portS.length+2}}</div>       
            <div class = 'grid-item'><i class="material-icons small " v-bind:style= "{color: portsColor[portS.length+1],opacity: portsActive[portS.length+1]}" >crop_free</i>{{portS.length+2}}b</div>       
            <div class = 'grid-item'><i class="material-icons small " v-bind:style= "{color: portsColor[portS.length+3],opacity: portsActive[portS.length+3]}" >crop_free</i>{{portS.length+4}}</div>       
        </div>
     </div>

    <div id = 'progress-container'>
      <div class="progress">
        <div class="determinate blue" v-bind:style= "{width: completion}"></div>
      </div>
      <div class ='progressFeedback'>Reading switch settings {{completion}}</div>
    </div>


    <button v-if= "showSaveButton" @click= "save" class="waves-effect waves-light btn-large blue" v-bind:disabled= "onOff"><i class="material-icons left">save</i>Save</button>
    <button v-else  @click= "cancel" class="waves-effect waves-light btn-large red"><i class="material-icons left">cancel</i>cancel</button>
    <!-- <button @click= "save" class="waves-effect waves-light btn-large blue" v-bind:disabled= "onOff"><i class="material-icons left">save</i>Save</button> -->


  </div>
</template>

<script>
export default {
  name: 'Dashboard',
  props:['snmpStatus'],
  data () {
    return {
        completion: '0%',
        showSaveButton: true,
        onOff: true
    }
  },
  computed:{
      portS: function(){
        let portS = ''
        if(this.snmpStatus.model =='SG350-52P'){

          portS = [...Array(48).keys()] 
  
        }else{
          portS = [...Array(24).keys()] 
        }
        return portS
      },
      is52Port:function(){
        let is52Port = false
        if(this.snmpStatus.model =='SG350-52P'){
          
          is52Port = true
  
        }else{
          is52Port = false
        }
        return is52Port
      },
      txCount: function(){
        // Count of TX 
        let txCount = ''

        //  SG350-52 with ports 1-48 configured as Vlan2 only
        if([...new Set(this.snmpStatus.PortVlanMembership)].length == 2){
            txCount = 0 // TX = 0
        }else{
            txCount = [...new Set(this.snmpStatus.PortVlanMembership)].length - 1
        }
        return txCount

      },
      rxCount: function(){
        // Count of rx
        let rxCount = ''
        rxCount = this.portS.length - this.txCount
        return rxCount

      },
      portsColor: function() {
            let portsColor = []

            // Cisco Switch configured for TX and RX
            if(this.txCount != 0){
              
                this.snmpStatus.PortVlanMembership.forEach((item,index)=>{
                  
                  //Port 1
                  if(index == 0){
                      portsColor.push('#2196f3')  //TX color is bluish color

                  // Port 2-xxx
                  }else{
                    if(item == 1){
                        portsColor.push('white')
                    }else if (item ==2){
                        portsColor.push('orange')  //RX color orange color
                    }else {
                      portsColor.push('#2196f3')    //TX color is blueish
                    }
                  }
                })

            // Cisco Switch configured for RX only. All ports are configured as vlan2 and vlan 1
            }else{
               this.snmpStatus.PortVlanMembership.forEach((item)=>{
                 if(item == 1){
                     portsColor.push('white')
                 }else{
                     portsColor.push('orange')  //RX color orange color
                 }
                })
            }
          return portsColor
        },

        portsActive: function(){
          let portsActive = []
          this.snmpStatus.PortOperationalStatus.forEach((item)=>{
            //port active
            if(item == 1){
                portsActive.push(1) //set opacity to 1
            //port NOT active
            }else{
                portsActive.push(0.3)  //set opacity to .3
            }
          })
          return portsActive
        },

  },
  methods:{
      save(){
           const serverURL = location.hostname
            // Save switch config to server
            let sg350Config = {"ip":"","TXports":"" ,"RXports":""}  //
            sg350Config['ip'] = this.snmpStatus.SwitchIPAddress
            sg350Config['TXports'] = this.txCount
            sg350Config['RXports'] = this.rxCount
            
            fetch(`http://${serverURL}:3000/write/UserSwitchConfig/${JSON.stringify(sg350Config)}`)
            .then(()=> {

               // set txCount and rxCount in Node Red
              fetch(`http://${serverURL}:1880/count/txrx`)
              
              // Show Home Page
              this.$router.push({name:'home'})
            })
            .catch(error => console.log(error));
       },
      cancel(){
            
            // Show Home Page
              this.$router.push({name:'home'})
      },
},
  created(){

  },
  mounted(){
    //Top of page
    window.scrollTo(0, 0);
       
    //Run progress bar and update every 600ms. Hide Save button until after 1 minute
    let counter = 0
    let timer = setInterval(()=>{
        counter++
        this.completion = `${counter}%`
        if(counter == 100){
          clearInterval(timer)
          if(this.snmpStatus.model !== ''){
            
            this.onOff = false

          //switch not detected
          }else{
            alert("Switch not detected. Please check")
             this.showSaveButton = false
          }
          
        }
    },600)

  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.dashboard{
    display:flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    height:90vh;
    /* border:1px solid orange; */
}

.grid-container {
  color:white;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  align-items: start;
  grid-gap: 10px;
  height:20vh;
  width:90%;
  /* background-color: rgb(28,28,30); */
  border:1px solid  white;
  border-radius:6px;
}
.sg350{
  display:flex;
  flex-direction:row;
  width:90%;
  justify-content: center;
  align-items: center;
  background-color: rgb(28,28,30);
  border:3px solid rgb(28,28,30) ;
  
}
.port1-48{
  color:white;
  display: grid;
  grid-template-columns: repeat(24, 1fr);
  align-items: center;
  grid-gap: 2px;
  width:87.5%;
  height:15vh;
  /* border:1px solid  lightgrey */
}
.port1-24{
  color:white;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  align-items: center;
  grid-gap: 2px;
  width:87.5%;
  height:15vh;
  /* border:1px solid  lightgrey */
}
.port-combo-sfp{
  color:white;
  margin:2px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  align-items: center;
  width:12.5%;
  height:15vh;
  /* border:1px solid yellow */
}
.grid-item{
  display:flex;
  flex-direction: column;
  align-items: center;
  border:1px solid #2c3e50
}
#vital-stat div{
  border:1px none red;
}
.tiny{
  margin-right: 5px;
}
#progress-container{
  display:flex;
  flex-direction:column;
  justify-content: center;
  align-items: center;
  /* border:1px solid red; */
  width: 30%
}
.progress{
  width:100%;
  background-color: white;
}
.progressFeedback{
  color:white;

}

</style>
