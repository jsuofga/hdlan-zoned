<template>
 <div class="update">
        <h5 v-if = "!rebooting" >HDLAN Controller Update</h5>
            <div v-if= "showFileButton"  id="input">
            <input v-on:change= "fileSelect" id="file-select-button" type="file" >
        </div>

        <div v-if= "showUploadButton" class="field center-align">
           <button v-on:click = "upload" class="waves-effect waves-light btn blue"><i class="material-icons left">publish</i>upload</button>
        </div>

        <div v-if= "showProgressBar" id = 'progress-container'>
          <div v-if = "!rebooting" class="progress">
            <div class="determinate blue" v-bind:style= "{width: completion}"></div>
          </div>
          <div v-if = "!rebooting" class ='progressFeedback'>Uploading {{completion}}</div>
          <div v-if = "rebooting"  class="progress">
              <div class="determinate green" v-bind:style= "{width:rebootPercent}"></div>
          </div>
          <div v-if = "rebooting"> Please Wait. Restarting Controller </div>
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

import axios from 'axios';

export default {
  name: 'Update',
  props: [],
  data () {
    return {
      selectedFile: null,
      completion: '0%',
      showFileButton:true,
      showUploadButton: false,
      showProgressBar : false,
      rebooting: false,
      interval: {},
      rebootCompletion: 0,
      rebootPercent:"0%"

    }
  },
  computed:{

  },
  methods:{
    startTimer(){
      // wait for 60 seconds while server reboots, then reload and goto page /
        this.interval = setInterval(() => {
        this.rebootCompletion = this.rebootCompletion === 100 ? 0 : this.rebootCompletion + 1;
        this.rebootPercent = `${this.rebootCompletion.toString()}%`
        if(this.rebootCompletion == 100){
            this.rebooting = false
            this.$router.push('/')
            setTimeout(function() {location.reload()}, 3000);
        }
      }, 600);
    },
    fileSelect(event){
       this.showFileButton = false
       this.showUploadButton = true
      this.selectedFile = event.target.files[0]  // get selected file 
    },
    upload(){
      const serverURL = `${location.hostname}:1880`
      const fd = new FormData();

      // file name and type must be "dist.tar" and a tar file
      if(this.selectedFile == null){
          alert('No file selected')
      }else{
        if((this.selectedFile.type == 'application/x-tar')&&(this.selectedFile.name == 'dist.tar')){
          this.showFileButton = false
          this.showUploadButton = false
          this.showProgressBar = true
          fd.append('image',this.selectedFile)
          axios.post(`http://${serverURL}/update`,fd,{
           onUploadProgress:  uploadEvent => {
            // Do whatever you want with the native progress event
            console.log('upload progress:' + Math.round(uploadEvent.loaded/uploadEvent.total * 100) +'%')
            this.completion = Math.round(uploadEvent.loaded/uploadEvent.total * 100).toString() + '%'
          
          },

          })
          .then(res => {
            // JSON responses are automatically parsed.
            if (res.status === 200) {
              //alert('update request received')
              // M.toast({ html: `UPDATED`, classes: "rounded blue" })
              // this.$router.push({name:'home'})
              // location.reload()

              this.rebooting = true
              this.startTimer()
           
            } else {
              // Handle the user data here...
              alert('fail')
            }
        
          })
          .catch(e => {
            this.errors.push(e)
          })

        }else{
          // file not dist.tar . do nothing
          alert('Wrong file.File should be dist.tar. Please contact info@octavainc.com to get correct file')
        }
      }
      
    }
  },

  //Life Cycle Hooks
  mounted(){
        M.AutoInit() // For Materialize to work!
        window.scrollTo(0, 0) //Top of page
  },
  beforeUnmount(){
    clearInterval(this.interval);
  }

}
</script>

<style scoped>
.update{
  display:flex;
  flex-direction: column;
  color:white;
  justify-content: center;
  align-items: center;
  width: 100%;
  height:80vh;
}
#input{
    /* border:1px solid red; */
    margin-top:50px;
}
#file-select-button{
    padding:50px;
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
