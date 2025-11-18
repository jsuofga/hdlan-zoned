<template>
  <div class="timer container">

      <h4 class = 'white-text'>Server Time is {{snmpStatus.serverTime}}</h4>

      <div  class = 'card-container'>
          <!-- <div class="card blue-grey darken-1">
            <div class="card-content white-text">
              <span class="card-title">PoE On Time</span>
              <h4 v-if= "snmpStatus.ontime ==''" class = 'white-text center-align'>None</h4>
              <h4  class = 'green-text center-align'>{{snmpStatus.ontime}}</h4>

            </div>
            <div class="card-action">
                <div id = 'onTime'>
                  <i class="material-icons prefix" style="color:white">alarm_on</i>
                  <input  type="text" class="timepicker" v-model.lazy= 'onTime'  placeholder="Change Power PoE ON time">
                </div>
            </div>
          </div> -->
          <div class="card blue-grey darken-1 card-relative">
            <i class="material-icons white-text card-close-btn" @click="closeCard()">close</i>
            <div class="white-text">
              <h5 class="center-align">PoE Off Time</h5>
              <h5 v-if = "snmpStatus.offtime == undefined" class = 'white-text center-align'>Not Scheduled</h5>
              <h5 v-else-if = "snmpStatus.offtime === ''" class = 'white-text center-align'>Not Scheduled</h5>
              <h5 v-else class = 'blue-text center-align'>Off Time:{{snmpStatus.offtime}}</h5>

            </div>
            <div class="card-action">
                <div id = 'offTime'>
                  <i class="material-icons prefix" style="color:white">alarm_off</i>
                  <input  type="text" class="timepicker" v-model.lazy= 'offTime'  placeholder="Change Power PoE OFF time">
                </div>
            </div>
              <div  id = 'card-btns'>
                <button @click= "clearTimer()" class="waves-effect waves-light btn red ">Clear Time</button>
                <button @click= "save()" class="waves-effect waves-light btn blue ">Save Time</button>
            </div>
          </div>
      
      </div>

        <!-- Floating Action Button -->
      <div class="fixed-action-btn">
          <a class="btn-floating btn-large blue" @click="closeCard()">
              <i class="material-icons">home</i>
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
    }
  },
  computed:{

            
  },
  methods:{

     closeCard(){
      this.$router.push({ name: `home` });
     },
     clearTimer(){
      this.onTime ='',
      this.offTime = '',
      this.save()
     },
     save(e) {
            // Helper function to convert 'HH:MM AM/PM' to 'HH:MM' (24h format).
            // Returns an empty string if input is falsy.
            const convertTo24Hour = (time12h) => {
                if (!time12h) return '';

                const [time, modifier] = time12h.split(" ");
                let [hour, minute] = time.split(":");
                let h = parseInt(hour, 10);

                // Handle AM/PM conversion
                if (modifier === "PM" && h !== 12) {
                    h += 12;
                } else if (modifier === "AM" && h === 12) {
                    h = 0; // Midnight (12 AM) is 00
                }

                // Format with zero padding
                const hourStr = h.toString().padStart(2, '0');
                const minuteStr = minute.padStart(2, '0');

                return `${hourStr}:${minuteStr}`;
            };

            // Determine the final 24-hour times (or empty strings if no time was picked)
            const finalOnTime = convertTo24Hour(this.onTime);
            const finalOffTime = convertTo24Hour(this.offTime);

            const serverURL = location.hostname;

            // Create the configuration object
            const sg350Config = {
                model: this.snmpStatus.model,
                ip: this.snmpStatus.SwitchIPAddress,
                TXports: this.snmpStatus.txCount,
                RXports: this.snmpStatus.rxCount,
                onTime: finalOnTime,
                offTime: finalOffTime,
            };

            // Perform the API calls
            fetch(`http://${serverURL}:3000/write/UserSwitchConfig/${JSON.stringify(sg350Config)}`)
                .then(() => {
                   
                    // Trigger the schedex node timer update
                    fetch(`http://${serverURL}:1880/timer/poe`);

                    // Show confirmation message
                    if(this.timeOff =='' ){
                          M.toast({ html: `Cleared Timer`, classes: "rounded blue" });
                    }else{
                         M.toast({ html: `Saved PoE Off time to ${this.offTime}`, classes: "rounded blue" });
                    }
                   
                    // Go to Home page after delay
                    setTimeout(() => {
                        this.$router.push({ name: `home` });
                    }, 5000);
                })
                .catch(error => console.error("Error saving switch config:", error));
        }
      
      
  },
  created(){

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
.card-content{
  display:flex;
  justify-content: center;
}
.card-relative {
    position: relative; /* Makes this the reference point for absolute positioning */
}

.card-close-btn {
    position: absolute;
    top: 5px;   /* Adjust these values for final positioning */
    left: 5px;  /* Adjust these values for final positioning */
    cursor: pointer;
    font-size: 24px; /* Optional: Adjust size */
    z-index: 10;     /* Ensures the button is above other card content */
    padding: 5px;    /* Optional: Gives a small click target area */
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
#card-btns{
  display: flex;
  flex-direction: row;
  justify-content: space-around;

}



</style>