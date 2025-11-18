<template>
  <div id="app">
    <Navbar v-bind:snmpStatus= "snmpStatus" 
        v-bind:zoneNames = "zoneNames" 
        v-bind:zoneNumber = "zoneNumber" 
        v-bind:pingControllerStatus=  "pingControllerStatus"
    />
    <Sidenav @msg-txSelected= "tx" @msg-remoteSelected= "remoteControl" v-bind:rxSelected= "rxSelected" v-bind:sourceNames= "sourceNames" v-bind:itachIPs = "itachIPs"  v-bind:stbQty = "stbQty"  v-bind:multiviewerIPs = "multiviewerIPs"  v-bind:mavQty = "mavQty" v-bind:tvNamesZones = "tvNamesZones"  v-bind:UserSwitchConfig  = "UserSwitchConfig"   /> 
    <router-view 
        @msg-switchIp= "switchIp"
        @msg-rxSelected= "rx" 
        @msg-zoneSelected= "zoneSelected" 
        @msg-sourceNamesUpdated= "sourceNamesUpdated"
        @msg-tvNamesZonesUpdated= "tvNamesZonesUpdated" 
        v-bind:zones = "zones"  
        v-bind:zonesId = "zonesId" 
        v-bind:zoneNames = "zoneNames"  
        v-bind:zoneNamesToDisplay = "zoneNamesToDisplay"  
        v-bind:zoneNumber = "zoneNumber" 
        v-bind:sourceNames = "sourceNames" 
        v-bind:tvNames = "tvNames" 
        v-bind:tvNamesZones = "tvNamesZones" 
        v-bind:snmpStatus= "snmpStatus" 
        v-bind:switchIpAddress= "switchIpAddress"
        v-bind:userPresetsExist= "userPresetsExist"
        v-bind:itachIPs = "itachIPs" 
        v-bind:stbQty = "stbQty" 
        v-bind:multiviewerIPs = "multiviewerIPs" 
        v-bind:mvQty = "mvQty" 
        v-bind:favChNames  = "favChNames" 
        v-bind:favChStations  = "favChStations" 
        v-bind:remote  = "remote" 
        v-bind:UserSwitchConfig  = "UserSwitchConfig" 
     
    />
    <Status @msg-status= "status" @msg-sourceNamesUpdated= "sourceNamesUpdated" @msg-tvNamesZonesUpdated= "tvNamesZonesUpdated" @msg-pingController= "pingController" />

  </div>
</template>

<script>

import M from 'materialize-css'
import Sidenav from '@/components/Sidenav'
import Navbar from '@/components/Navbar'
import Home from '@/components/Home'
import Zones from '@/components/Zones'
import Ipaddress from '@/components/Ipaddress'
import Status from '@/components/Status'
import Name_inputs from '@/components/Name_inputs'
import Name_outputs from '@/components/Name_outputs'
import Dashboard from "@/components/Dashboard"
import Timer from "@/components/Timer"
import Capacitycontrol from "@/components/Capacitycontrol"
import Update from "@/components/Update"
import RemoteControl from "@/components/RemoteControl"
import Itach from "@/components/Itach"
import MultiViewer from "@/components/Multiviewer"
import Favoritechannels from "@/components/Favoritechannels";

export default {
  name: 'App',
  components:{
    Navbar,
    Home,
    Sidenav,
    Zones,
    Ipaddress,
    Status,
    Name_inputs,
    Name_outputs,
    Dashboard,
    Timer,
    Capacitycontrol,
    Update,
    RemoteControl,
    Itach,
    Favoritechannels,
    MultiViewer

  },
  watch:{
     //$route:'get_tvZoneAssignment'
       $route:'readFromSever'
  },
  data () {
    return {
     rxSelected : '',
     txSelected :'',
     switchIpAddress: '',
     serverIpAddress: '',
     snmpStatus:{},
     sourceNames:[],
     tvNamesZones:[],
     tvNames:[],     
     zoneNames:[],  // complete list of zone names created
     zones:[],      //zone that each RX is assigned to
     zonesId:[],
     zoneNamesToDisplay: [],  //zone names that are actually assigned to tv
     zoneNumber: '', // zone selected 0-xxx to show on Navbar Title
     userPresetsExist:[false,false,false], // [userPreset1,userPreset2.userPreset3 ] true / false,
     pingControllerStatus:'ok',
     itachIPs:[],
     stbQty: [], // Number of set top boxes to be controlled by Itach 
     multiviewerIPs:[],
     mvQty: [], // Number of multiviewers
     favChNames:[], //
     favChStations:[], //
     remote: '' ,// remote control selected
     UserSwitchConfig: {} //UserSwitchConfig.txt
  }
},

  methods:{
    rx(payload){
      console.log('RX selected =', payload)
      this.rxSelected = payload.rx
    },
    tx(payload){
      console.log('TX selected =', payload)
      this.txSelected = payload.tx
    },
    remoteControl(payload){
      console.log('Remote Control Selected =', payload.remote)
      this.remote = payload.remote
    },
    switchIp(payload){
      // console.log('Switch IP Address =', payload.switchIp)
      this.switchIpAddress = payload.switchIp
    },
    status(payload){
       console.log('status  =', payload)
       this.snmpStatus = payload
       this.serverIpAddress = payload.NodeRedIPAddress 
       console.log('ip  =', this.serverIpAddress)
    },
    pingController(payload){
       console.log('ping controller  =', payload)
       this.pingControllerStatus = payload
    },
    sourceNamesUpdated(payload){
      //  console.log('sourceNames  =', payload)
      //  this.sourceNames = payload
    },
    tvNamesZonesUpdated(payload){
      //  console.log('tvNamesZones =', payload)
      //  this.tvNamesZones = payload
    },
    zoneSelected(payload){
      //this.zoneNumber = payload.zoneId
      this.zoneNumber = payload.zoneId + 1
    },
    async readFromSever(){
        console.log('route changed')
        await this.get_zoneNames()
        await this.get_tvZoneAssignment()
        await this.get_sourceNames()
        await this.get_UserPresets()
        await this.get_UserItachIPs()
        await this.get_UserFavChannels()
   //     await this.get_UserMultiViewerIPs() //
        await this.get_UserSwitchConfig()
    },
    get_zoneNames(){
         const serverURL = `${location.hostname}:3000`
         this.zoneNames=[]
        // Read from Server
          fetch(`http://${serverURL}/read/UserZoneNames`, {method: 'GET',})
          .then(response => response.json())
          .then(result => {
             //console.log('ZoneNames Success:', result);
             let item;
             for( item in result){
               this.zoneNames.push(result[item])
             }
              console.log('Zone names = ',this.zoneNames)
          })
          .catch(error => {
            console.error('Error:', error);
          });

    },
    get_tvZoneAssignment(){
        const serverURL = `${location.hostname}:3000`
        this.zones = [],
        this.zonesId = [],
        this.zoneNamesToDisplay = []
        this.tvNamesZones =[]
        this.tvNames = []
       
      // Read from Server
        fetch(`http://${serverURL}/read/UserTvNames`, {method: 'GET',})
        .then(response => response.json())
        .then(result => {
          console.log('Success:', result);
            let item;
            for( item in result){
              this.zones.push(result[item].zone)
              this.zonesId.push(result[item].zoneId)
              this.tvNames.push(result[item].name)
              this.tvNamesZones.push(result[item])
            }
            this.zoneNamesToDisplay = this.zoneNames
            //check if if a RX is assigned to zone in zoneNames and save in zoneNamesToDisplay. 
            // this.zoneNames.forEach(item =>{
            //   if(this.zones.includes(item)){
            //     this.zoneNamesToDisplay.push(item)
            //   }
            // })
            console.log( this.zones)
            console.log( this.zonesId)
            console.log( this.zoneNamesToDisplay)
            console.log( this.tvNamesZones)
            console.log( this.tvNames)
        })
        .catch(error => {
          console.error('Error:', error);
        });
    },
    get_sourceNames(){
        this.sourceNames = []
        const serverURL = `${location.hostname}:3000`
        // Read from Server
          fetch(`http://${serverURL}/read/UserInputNames`, {method: 'GET',})
          .then(response => response.json())
          .then(result => {
            console.log('Success:', result);
             let item;
             for( item in result){
               this.sourceNames.push(result[item])
             }
              console.log(this.sourceNames)
          })
          .catch(error => {
            console.error('Error:', error);
          });
         
    },
    get_UserPresets(){
      const serverURL = location.hostname
      //Check if User Preset exist.
      // Check if Presets1,2,3 were created by user.
            for(let i=0;i<=2;i++){
                fetch(`http://${serverURL}:3000/read/UserPreset${i+1}`,{method: 'GET',})
                .then(response => response.json())
                .then(result => {
                  if(Object.keys(result).length == 0){
                    this.userPresetsExist[i] = false

                  //Preset exist
                  }else{
                    this.userPresetsExist[i] = true
                  }
                })
                .catch(error => {
                  console.error('Error:', error);
                });

            }
            //console.log('UserPresets Exist:', this.userPresetsExist)
    },
      get_UserItachIPs(){
        this.itachIPs = []
        this.stbQty = []
        const serverURL = `${location.hostname}:3000`
        // Read from Server
          fetch(`http://${serverURL}/read/UserItachIPs`, {method: 'GET',})
          .then(response => response.json())
          .then(result => {
            console.log('Success:', result);
             let item;
             for( item in result){
               this.itachIPs.push(result[item])
             }
              this.stbQty = [...this.itachIPs.slice(-1)]
              this.itachIPs = [...this.itachIPs.slice(0,-1)]
              
          })
          .catch(error => {
            console.error('Error:', error);
          });
    },
    get_UserMultiViewerIPs(){
        this.multiviewerIPs = []
        this.mvQty = []
        const serverURL = `${location.hostname}:3000`
        // Read from Server
          fetch(`http://${serverURL}/read/UserMultiViewerIPs`, {method: 'GET',})
          .then(response => response.json())
          .then(result => {
            console.log('Success:', result);
             let item;
             for( item in result){
               this.multiviewerIPs.push(result[item])
             }
              this.mvQty = [...this.multiviewerIPs.slice(-1)]
              this.multiviewerIPs = [...this.multiviewerIPs.slice(0,-1)]
              
          })
          .catch(error => {
            console.error('Error:', error);
          });
    },
      get_UserFavChannels(){
        this.favChNames= []
        this.favChStations= []
        const serverURL = `${location.hostname}:3000`
        // Read from Server
          fetch(`http://${serverURL}/read/UserFavChannels`, {method: 'GET',})
          .then(response => response.json())
          .then(result => {
             console.log("journey",result)
              let index = 0
              let item
              for(item in result){
                if(index % 2 != 0){
                  this.favChStations.push(result[item])
                }else{
                  this.favChNames.push(result[item])
                }
                index++
              }
          })
          .catch(error => {
            console.error('Error:', error);
          });
          
        console.log("names:", this.favChNames)
        console.log("stations:", this.favChStations)
    },
    get_UserSwitchConfig(){
        const serverURL = `${location.hostname}:3000`
        // Read from Server
          fetch(`http://${serverURL}/read/UserSwitchConfig`, {method: 'GET',})
          .then(response => response.json())
          .then(result => {
            console.log('Success:', result);
            this.UserSwitchConfig = result
          })
          .catch(error => {
            console.error('Error:', error);
          });
    },

  },

  //Lifecycle Hooks
  created(){
    this.readFromSever()
  },
  mounted () {
    M.AutoInit() //Materialize Init
    //this.readFromSever()
  },
}

</script>

<style>
#app {
  background-color: #2c3e50;
  /* box-sizing: border-box;  */
 

}
</style>
