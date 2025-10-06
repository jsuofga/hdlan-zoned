 <template>

  <div class="mv">
        <h6 class="center-align white-text">Multiviewer {{multiviewerIPs}}</h6>
        <div class = "grid-container">
          <div class = "grid-item1" @click = "sendCommand('SET_MV_MODE 1')">Mode 1</div>
          <div class = "grid-item1">Button 2</div>
          <div class = "grid-item1">Button 3</div>
          <div class = "grid-item1" @click = "sendCommand('SET_MV_MODE 4')">Mode 4</div>
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
  name: 'MultiViewControl',
  props:["multiviewerIPs"],
  data () {
    return {

  
    }
  },
  computed:{
    remoteName: function(){
      return this.sourceNames[this.remote-1]
    },


  },
  methods:{
      // async sendCommand(_data){
      //    const  data1 = '{CMD=' + _data + '\r\n';
      //    console.log(_data)
      //    M.toast({ html: `IR sent `, classes: "rounded blue" })
      //    console.log(this.multiviewerIPs[0])
      //   try {
      //     const response = await fetch(`http://${this.multiviewerIPs[0]}/cgi-bin/MMX32_Keyvalue.cgi`, {

      //       method: 'POST',
      //       headers: {
      //         'Content-Type': 'application/x-www-form-urlencoded', // adjust as needed
      //       },
      //       body: data1,
      //     });

      //     if (response.ok) {
      //       const result = await response.json(); // or text(), depending on server
      //       console.log(result);
      //     } else {
      //       console.error('HTTP error:', response.status);
      //     }
      //   } catch (error) {
      //     console.error('Fetch error:', error);
      //   }
    
      // },
      async sendCommand(_command){
         const serverURL = `${location.hostname}:1880`     
         M.toast({ html: `Command Sent  `, classes: "rounded blue" })
     
        try {
          const response = await fetch(`http://${serverURL}/sendMVcmd/unit/1/command/${_command}`);

          } catch (error) {
        
        }
    
      },

        
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.mv{
  display:flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width:100%;
  height:80vh;
  border:1px solid red
}
.grid-container {
  color:white;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  justify-content: center;
  align-items: center ;
  grid-gap: 1px;
  width:90%;
  height:80vh;
  position: relative; 

}

.grid-item1{
  display:flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  border:1px solid orange;
}

.btn-icons{
    transform: scale(3)  
}

.btn{
    border-radius:6px;
    width:70%
}
i{
  cursor: pointer
}


</style>