<template>
  <div class="dashboard">

     <div id = 'vital-stat' class = 'grid-container'>
          <div class = 'grid-item'> Ubiquiti</div>
          <div class = 'grid-item'> Model : {{snmpStatus.model}}</div>
          <div class = 'grid-item'> IP : {{snmpStatus.SwitchIPAddress}}</div>

          <div class = 'grid-item'><span><i class="material-icons small" style = "color:#2196f3">inbox</i></span>Transmitters : {{txCount}}</div>
          <div class = 'grid-item'><span><i class="material-icons small" style = "color:orange">inbox</i></span>Receivers : {{rxCount}}</div>
          <div class = 'grid-item'><span><i class="material-icons small" style = "color:white">inbox</i></span>LAN</div>
      </div>

     <div v-if= "snmpStatus.model !== ''" class = 'ubnt-edge'>
        <div v-if= "is48Port" class = 'port1-48'>
            <div class = 'grid-item'  v-for="(item, index) in portS" :key="index" ><i class="material-icons small " v-bind:style= "{color: portsColor[index],opacity: portsActive[index]}" >inbox</i>{{(2*item+1)-Math.trunc((2*item+1)/49)*47}}</div>
        </div >  
        <div v-else class = 'port1-24'>
            
            <div class = 'grid-item'  v-for="(item, index) in portS" :key="index" ><i class="material-icons small " v-bind:style= "{color: portsColor[index],opacity: portsActive[index]}" >inbox</i>{{(2*item+1)-Math.trunc((2*item+1)/25)*23}}</div>
        </div > 

        <div v-if= "is48Port"  class = 'port-combo-sfp'>
            <div class = 'grid-item'></div>       
            <div class = 'grid-item'><i class="material-icons small " v-bind:style= "{color: portsColor[portS.length],opacity: portsActive[portS.length]}" >crop_free</i>SFP1+</div>       
            <div class = 'grid-item'><i class="material-icons small " v-bind:style= "{color: portsColor[portS.length],opacity: portsActive[portS.length]}" >crop_free</i>SFP1</div>       
            <div class = 'grid-item'></div>       
            <div class = 'grid-item'><i class="material-icons small " v-bind:style= "{color: portsColor[portS.length+1],opacity: portsActive[portS.length+1]}" >crop_free</i>SFP2+</div>       
            <div class = 'grid-item'><i class="material-icons small " v-bind:style= "{color: portsColor[portS.length+1],opacity: portsActive[portS.length+1]}" >crop_free</i>SFP2</div>       
        </div>
        <div v-else class = 'port-combo-sfp'>
            <div class = 'grid-item'></div>       
            <div class = 'grid-item'><i class="material-icons small " v-bind:style= "{color: portsColor[portS.length],opacity: portsActive[portS.length]}" >crop_free</i>SFP1</div>       
            <div class = 'grid-item'></div>       
            <div class = 'grid-item'></div>       
            <div class = 'grid-item'><i class="material-icons small " v-bind:style= "{color: portsColor[portS.length+1],opacity: portsActive[portS.length+1]}" >crop_free</i>SFP2</div>       
            <div class = 'grid-item'></div>       
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

</div>

</template>

<script>
export default {
  name: 'DashboardUbiquiti',
  props:['snmpStatus'],
  data () {
    return {
        completion: '0%',
        showSaveButton: true,
        onOff: true,
    }
  },
  computed:{
      portS: function(){
        let portS = ''
        if(this.snmpStatus.model =='UBNT-ES48'){
          portS = [...Array(48).keys()] 
        }else if(this.snmpStatus.model =='UBNT-ES24'){
          portS = [...Array(24).keys()] 
      
        }
        return portS
      },
      is48Port:function(){
        let is48Port = false
        if(this.snmpStatus.model =='UBNT-ES48'){
          
          is48Port = true
  
        }else{
          is48Port = false
        }
        return is48Port
      },
      txCount: function(){
        // Count of TX 
        let txCount = ''
        txCount = [...new Set(this.snmpStatus.PortVlanMembership)].length - 1
        return txCount

      },
      rxCount: function(){
        // Count of rx
        let rxCount = ''
        rxCount = this.portS.length - this.txCount - 1
        return rxCount

      },
      portsColor: function() {
            let portsColor = []
            let portsColor_copy = []

            this.snmpStatus.PortVlanMembership.forEach((item,index)=>{
                
                if(index  == 0){
                  portsColor_copy[index] = '#2196f3' // blueish

                }else {  //Even
                
                   if(item == 1){
                     portsColor_copy[index] = 'white'
                   }else if(item == 2){
                     portsColor_copy[index] = 'orange'
                   }else{
                     portsColor_copy[index] = '#2196f3'
                   }

                }
              
            })

          // Re-map portsColor for Ubiquity Port number sytem (Up to down Left to Right)
            
            for(let i = 0; i <= this.snmpStatus.PortVlanMembership.length/2 - 1; i++){
              portsColor[i] = portsColor_copy[2*i]
            }
            for(let i=0;i <= this.snmpStatus.PortVlanMembership.length/2 - 1; i++){
              portsColor[i+12] = portsColor_copy[2*i+1]
            }

          return portsColor
        },

        portsActive: function(){
         
          let portsActive= []
          let portsActive_copy = []

          this.snmpStatus.PortOperationalStatus.forEach((item)=>{
            //port active
            if(item == 100 || item == 1000 ){  //Ubiquit SNMP returs 100 or 1000for active 100 Mbps or 1000Mbps port
                portsActive_copy.push(1) //set opacity to 1
            //port NOT active
            }else{
                portsActive_copy.push(0.3)  //set opacity to .3
            }
          })

          
          // Re-map portsActive for Ubiquity Port number sytem (Up to down Left to Right)
            for(let i = 0; i <= this.snmpStatus.PortVlanMembership.length/2 - 1; i++){
              portsActive[i] = portsActive_copy[2*i]
            }
            for(let i=0;i <= this.snmpStatus.PortVlanMembership.length/2 - 1; i++){
              portsActive[i+12] = portsActive_copy[2*i+1]
            }
          return portsActive
        },

  },
  methods:{

      save(){
           const serverURL = location.hostname
            // Save switch config to server
            let switchConfig = {"brand": "","ip":"","TXports":"" ,"RXports":""}  //
            switchConfig['brand'] = "Ubiquiti"
            switchConfig['ip'] = this.snmpStatus.SwitchIPAddress
            switchConfig['TXports'] = this.txCount
            switchConfig['RXports'] = this.rxCount
            
            fetch(`http://${serverURL}:3000/write/UserSwitchConfig/${JSON.stringify(switchConfig)}`)
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
}
.grid-container {
  color:white;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  align-items: start;
  grid-gap: 10px;
  height:10vh;
  width:90%;
  /* background-color: rgb(28,28,30); */
  border:1px solid  white;
  border-radius:6px;
}
.ubnt-edge{
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
