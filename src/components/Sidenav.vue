<template>

  <div class="side-nav">

    <ul id="slide-out" class="sidenav">
        <li><a>Select Video Input</a></li>
        
        <li><div class="divider"></div></li>
        <!-- <li @click= "emitMsg(index)" v-for="(item, index) in sourceNames" :key="index">Port{{index+1}}.<a class="waves-effect"><i class="material-icons" >input</i>{{item}}</a><i class="material-icons" >settings_remote</i></li> -->
        <li v-for="(item, index) in sourceNames" :key="index">Port{{index+1}}.<a @click= "emitMsg(index)" class="waves-effect"><i class="material-icons" >input</i>{{item}}</a><div v-if = "index <= stbQty[0] -1" @click= "selectRemote(index)" class = "remote-icon"><i class="material-icons" >settings_remote</i></div></li>

    </ul>

  </div>
</template>

<script>

export default {
  name: 'Sidenav',
  props:['rxSelected','sourceNames','itachIPs','stbQty'],
  data () {
    return {
          sourceNames: []
          
    }
  },
 
  methods:{
      selectRemote(_index){
        this.$emit('msg-remoteSelected',{remote:`${_index+1}`}) // Remote Control selected 
        this.$router.push({ name: `remotecontrol`})
      },
      emitMsg(index){
         
       console.log('this',index)
        const serverURL = `${location.hostname}:1880`
        const rxID = this.rxSelected.rxId
        const rxName = this.rxSelected.name
        const txName = this.sourceNames[index]
        const vlanID = index + 2
        this.$emit('msg-txSelected',{tx:index+1}) // Video Source selected 1-16

        if(rxID != 'all'){
          // Switch 1 RX
           console.log(`http://${serverURL}/switchRX/${rxID}/vlan/${vlanID}`);
          M.toast({ html: `Switch ${rxName} to ${txName} `, classes: "rounded blue" })
          fetch(`http://${serverURL}/switchRX/${rxID}/vlan/${vlanID}`)

        }else{
          // Switch All RX
           console.log(`http://${serverURL}/switchAll/vlan/${vlanID}`)
          M.toast({ html: `Switch ALL to ${txName} `, classes: "rounded blue" })
          fetch(`http://${serverURL}/switchAll/vlan/${vlanID}`)
      
        }

      },

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
li{
  display:flex;
  justify-content: flex-start;
  align-items: center;

}
.remote-icon{
  display:flex;
  justify-content: center;
  cursor: pointer;
}

</style>