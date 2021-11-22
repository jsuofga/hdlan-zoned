<template>
  <div class="timer container">
       <div class = 'checkbox-container'>
            <p>
              <label>
                <input id = 'check-box' @change = "CheckAlwaysOn" type="checkbox" v-model= "AlwaysOnChecked" />
                <span>PoE Always On</span>
              </label>
            </p>
      </div>
      
      <h4 class = 'white-text'>Server Time is {{snmpStatus.serverTime}}</h4>

      <div class = 'card-container'>
          <div class="card blue-grey darken-1">
            <div class="card-content white-text">
              <span class="card-title">PoE Scheduled On Time</span>
              <h4 v-if= "on24_7" class = 'white-text center-align'>Always ON 24/7</h4>
              <h4 v-if= "scheduled" class = 'green-text center-align'>{{onTime}}</h4>
              <h4 v-if= "!scheduled" class = 'green-text center-align'>{{snmpStatus.ontime}}</h4>

            </div>
            <div class="card-action">
                <div id = 'onTime'>
                  <i class="material-icons prefix" style="color:white">alarm_on</i>
                  <input  type="text" class="timepicker" v-model.lazy= 'onTime'  placeholder="Change Power PoE ON time">
                </div>
            </div>
          </div>
          <div class="card blue-grey darken-1">
            <div class="card-content white-text">
              <span class="card-title">PoE Scheduled Off Time</span>
              <h4 v-if= "on24_7" class = 'white-text center-align'>Never Off</h4>
              <h4 v-if= "scheduled" class = 'red-text center-align'>{{offTime}}</h4>
              <h4 v-if= "!scheduled" class = 'red-text center-align'>{{snmpStatus.offtime}}</h4>
            </div>
            <div class="card-action">
                <div id = 'offTime'>
                  <i class="material-icons prefix" style="color:white">alarm_off</i>
                  <input  type="text" class="timepicker" v-model.lazy= 'offTime'  placeholder="Change Power PoE OFF time">
                </div>
            </div>
          </div>
      </div>

        <!-- Floating Action Button -->
    <div class="fixed-action-btn">
        <a class="btn-floating btn-large blue" @click = "save">
           save
        </a>
    </div>

  </div>


</template>

<script>

export default {
  name: 'Timer',
  props:['snmpStatus'],
  data () {
    return {
        onTime:'',
        offTime:'',
        AlwaysOnChecked: ''
    }
  },
  computed:{
      on24_7:function(){
          let PoEAlwaysOn = ''
          if(this.snmpStatus.ontime == '' && this.snmpStatus.offtime == '' && this.onTime == '' && this.offTime == ''  ){
            PoEAlwaysOn = true
            this.AlwaysOnChecked = true 

          }else if(this.AlwaysOnChecked== true){
            PoEAlwaysOn = true
          }
          else{
            PoEAlwaysOn = false
            this.AlwaysOnChecked = false
          }
        return  PoEAlwaysOn
      },
      scheduled:function(){
          let schedule= ''
          if(this.onTime == '' && this.offTime == '' ){
            schedule = false
           
          }else{
            schedule = true
            this.AlwaysOnChecked= false
          }
        return schedule
      },

      
  },
  methods:{
      CheckAlwaysOn(){
        console.log('Check Box status', this.AlwaysOnChecked)

        if(this.AlwaysOnChecked = true){
          //show  "Always ON 24/7" immediately
          //clear inputs
          this.onTime ='',
          this.offTime =''

          //Read UserSwitchConfig
          const serverURL = location.hostname
              // Save switch config to server
              let sg350Config = {"model":"","ip":"","TXports":"" ,"RXports":"","onTime":'',"offTime":''}  //
              sg350Config['model'] = this.snmpStatus.model
              sg350Config['ip'] = this.snmpStatus.SwitchIPAddress
              sg350Config['TXports'] = this.snmpStatus.txCount
              sg350Config['RXports'] = this.snmpStatus.rxCount
              sg350Config['onTime'] =  ''
              sg350Config['offTime'] = ''
              
              fetch(`http://${serverURL}:3000/write/UserSwitchConfig/${JSON.stringify(sg350Config)}`)
              .then(()=> {
                
                // Trigger and programmatically set on and off time in schedex node  
                fetch(`http://${serverURL}:1880/timer/poe`)

              })
              .catch(error => console.log(error));

        }else{
          // do nothing
        }


      },
      save(e){
        
          //check if user picked a time
          //No time picked
          if(this.onTime == ''|| this.offTime ==''){
             const serverURL = `${location.hostname}:1880`

            // Show modal
              M.toast({ html: `Saved`, classes: "rounded blue" })
                
            // Send PoE On command
            fetch( `http://${serverURL}/poe/on`)

            // Go to Home page
              setTimeout(()=>{
                this.$router.push({ name: `home`})
              },5000)

          // A new time has been picked
          }else{
             //convert to 24 hour time
                  let [onTime, onTime_modifier] = this.onTime.split(" ")
                  let [onTimeHour, onTimeMinute]= onTime.split(":")
                  let [offTime, offTime_modifier] = this.offTime.split(" ")
                  let [offTimeHour, offTimeMinute]= offTime.split(":")
                  let onTimeHour_str = ''
                  let onTimeMinute_str = ''
                  let offTimeHour_str = ''
                  let offTimeMinute_str = ''

                  // On PoE Time
                  if(onTime_modifier =="PM"){
                      onTimeHour =   ((parseInt(onTimeHour) % 12) + 12).toString()
                      onTimeMinute = parseInt(onTimeMinute).toString()
                    
                  }else{
                      onTimeHour =   parseInt(onTimeHour).toString()
                      onTimeMinute = parseInt(onTimeMinute).toString()
                  }
                  onTimeHour_str = onTimeHour.padStart(2,'0')
                  onTimeMinute_str = onTimeMinute.padStart(2,'0')
                  
                  // Off PoE Time
                  if(offTime_modifier =="PM"){
                      offTimeHour = ((parseInt(offTimeHour) % 12) + 12).toString()
                      offTimeMinute = parseInt(offTimeMinute).toString()
                  }else{
                      offTimeHour =   parseInt(offTimeHour).toString()
                      offTimeMinute = parseInt(offTimeMinute).toString()
                  }
                  offTimeHour_str = offTimeHour.padStart(2,'0')
                  offTimeMinute_str = offTimeMinute.padStart(2,'0')
                  
                  //Read UserSwitchConfig
                    const serverURL = location.hostname
                    // Save switch config to server
                    let sg350Config = {"model":"","ip":"","TXports":"" ,"RXports":"","onTime":'',"offTime":''}  //
                    sg350Config['model'] = this.snmpStatus.model
                    sg350Config['ip'] = this.snmpStatus.SwitchIPAddress
                    sg350Config['TXports'] = this.snmpStatus.txCount
                    sg350Config['RXports'] = this.snmpStatus.rxCount
                    sg350Config['onTime'] = `${onTimeHour_str}:${onTimeMinute_str}`
                    sg350Config['offTime'] = `${offTimeHour_str}:${offTimeMinute_str}`
                    
                    fetch(`http://${serverURL}:3000/write/UserSwitchConfig/${JSON.stringify(sg350Config)}`)
                    .then(()=> {
                      
                      // Trigger and programmatically set on and off time in schedex node  
                      fetch(`http://${serverURL}:1880/timer/poe`)

                    // Show modal
                      M.toast({ html: `Saved`, classes: "rounded blue" })

                    // Go to Home page
                      setTimeout(()=>{
                        this.$router.push({ name: `home`})
                      },5000)
                

                    })
                    .catch(error => console.log(error));
          }
      },
      
  },
   mounted(){
        M.AutoInit() // For Materialize to work!
  }

}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
*{
  box-sizing: border-box;
}
.timer{
  display: flex; /*none or flex*/
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height:80vh;

}
.checkbox-container{
  display: flex; /*none or flex*/
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width:80%;
  height:100vh;
}

.card-container{
  display: flex; /*none or flex*/
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height:100vh;
  margin-top:10px;
}
.card{
  margin-left: 25px;
  margin-right: 25px;
}

::placeholder {
  color: white;
}
label{
    color: white
}
div{
    margin-top: 25px;
    margin-bottom: 25px
}
input{
    color: white;
}



</style>