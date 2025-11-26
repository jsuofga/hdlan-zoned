<template>
  <div class = 'navbar'>

    <nav class="nav-extended">
        <div class="nav-wrapper">
            <div v-if = 'showZoneTitle' class="brand-logo center">{{zoneNames[zoneNumber-1]}}</div>
            <div v-else class="brand-logo center">
                <!-- <img src="@/assets/images/octava_logo_white-200.png">   -->
                <img src="@/assets/images/octava_logo_white-200.png" >  
            </div>
            <ul >
                <li><a @click= "openModal1"><i class="material-icons">menu</i></a></li>
            </ul>
             <span v-if= "snmpStatus.SwitchPingTest === 'fail'" class="new badge red" data-badge-caption="switch not detected!"></span>
             <span v-if= "pingControllerStatus === 'fail'" class="new badge red" data-badge-caption="HDLAN Controller not detected!"></span>
             <!-- <span v-if= "snmpStatus.PoE === 0 " class="new badge red" data-badge-caption="No PoE Power"></span> -->
            <span class="right">AVLAN 112625&nbsp;&nbsp;</span>
        </div>
    </nav>

    <!-- Modal Structure -->
    <div id="modal1" class="modal">

            <br>
            <h5 id='admin-settings-title' class = 'center-align'>Admin Access</h5>
            <div style="padding: 0 20px;">
                <small class='small-text'>
                    Be fair. The Octava Controller Software is licensed, not sold, to you solely for use with the Octava Video Over IP System.
                    You may not publish, copy, any portion of the Software, unless otherwise permitted by law.
                </small>
        </div>
            <div class="modal-content-admin">
                <label for="admin"></label>
                <i class="material-icons prefix blue-icon">persons</i>
                <input name="admin" v-model= "admin" placeholder="Enter admin password" type="text" required autocomplete="off" >
            </div>

            <div class=" center-align">
                <a @click= "closeModal1" class="modal-close waves-effect waves-light btn red">Cancel</a>
                <a @click= "submit" class="modal-close waves-effect waves-light btn blue ">Submit</a>
            </div>
    </div>


<div id="modal2" class="modal">
    <i class="material-icons red-text card-close-btn" @click= "closeModal2">close</i>
    <div class="modal-content-settings center-align ">
        
        <h5 class='center-align  text-darken-3'>System Settings & Presets</h5>
        <div class="row settings-grid">
            
            <div class="col s3">
                <router-link to="/ipaddress" @click.native="closeModal2('synch')">
                    <div class="setting-card waves-effect waves-light">
                        <i class="material-icons small blue-icon">router</i>
                        <span class="card-text">Sync Switch</span>
                    </div>
                </router-link>
            </div>
            <div class="col s3">
                <router-link to="/name-zones" @click.native="closeModal2">
                    <div class="setting-card waves-effect waves-light">
                        <i class="material-icons small blue-icon">edit</i>
                        <span class="card-text">Zones/Groups</span>
                    </div>
                </router-link>
            </div>
            <div class="col s3">
                <router-link to="/name-inputs" @click.native="closeModal2">
                    <div class="setting-card waves-effect waves-light">
                        <i class="material-icons small blue-icon">edit</i>
                        <span class="card-text">Video Inputs</span>
                    </div>
                </router-link>
            </div>
            <div class="col s3">
                <router-link to="/name-outputs" @click.native="closeModal2">
                    <div class="setting-card waves-effect waves-light">
                        <i class="material-icons small blue-icon">edit</i>
                        <span class="card-text">Video Outputs</span>
                    </div>
                </router-link>
            </div>
            
            <div class="col s4">
                <div class="setting-card waves-effect waves-light" @click="savePreset(1); closeModal2()">
                    <i class="material-icons small blue-icon">save</i>
                    <span class="card-text">Save Preset 1</span>
                </div>
            </div>
            <div class="col s4">
                <div class="setting-card waves-effect waves-light" @click="savePreset(2); closeModal2()">
                    <i class="material-icons small blue-icon">save</i>
                    <span class="card-text">Save Preset 2</span>
                </div>
            </div>
            <div class="col s4">
                <div class="setting-card waves-effect waves-light" @click="savePreset(3); closeModal2()">
                    <i class="material-icons small blue-icon">save</i>
                    <span class="card-text">Save Preset 3</span>
                </div>
            </div>
            
            <div class="col s3">
                    <router-link 
                        to= '/timer' 
                        @click="/-.*p/i.test(snmpStatus.model) && poe_timer_node_installed ? closeModal2 : null"
                        :class="{'disabled-link': !/-.*p/i.test(snmpStatus.model) || !poe_timer_node_installed}"
                    >
                        <div class="setting-card waves-effect waves-light">
                            <i class="material-icons small blue-icon">alarm_add</i>
                            <span class="card-text">Timer PoE On/Off</span>
                        </div>
                    </router-link>
            </div>
            <div class="col s3">
                <router-link to="/itach" @click.native="closeModal2">
                    <div class="setting-card waves-effect waves-light">
                        <i class="material-icons small blue-icon">router</i>
                        <span class="card-text">Global Cache Itach</span>
                    </div>
                </router-link>
            </div>
            <div class="col s3">
                <router-link to="/favoritechannels" @click.native="closeModal2">
                    <div class="setting-card waves-effect waves-light">
                        <i class="material-icons small blue-icon">settings_remote</i>
                        <span class="card-text">Channels Favorite</span>
                    </div>
                </router-link>
            </div>
            <div class="col s3">
                <router-link to="/update" @click.native="closeModal2">
                    <div class="setting-card waves-effect waves-light">
                        <i class="material-icons small blue-icon">publish</i>
                        <span class="card-text">Update Software</span>
                    </div>
                </router-link>
            </div>
        </div>
    </div>
</div>

</div>

</template>


<script>

export default {
    name: 'Navbar',
    props:['snmpStatus','zoneNames','zoneNumber','pingControllerStatus'],
    data () {
        return {
            admin:'',
            showZoneTitle: false,
            modalInstance1: null, // Holds the Materialize instance for modal1
            modalInstance2: null, // Holds the Materialize instance for modal2
            poe_timer_node_installed: false
        }
    },
    watch:{
         $route: 'checkRoute'
    },
    methods:{
        checkRoute(){
           
            //If route name is zones
            if(this.$route.name == 'zones'){
                 this.showZoneTitle = true  //Show zone name
            }else{
                this.showZoneTitle = false  //Show logo
            }
        },
        PoE(on_off){
            const serverURL = `${location.hostname}:1880`
            // Send 
            fetch( `http://${serverURL}/poe/${on_off}`)
            .then(()=> {
                M.toast({ html: `PoE Power ${on_off}`, classes: "rounded blue" })
            })
            .catch(error => console.log(error));
        },
        openModal1(){
             this.modalInstance1.open();
             //console.log(this.$route)
        },
        closeModal1(){
            this.modalInstance1.close();
        },
        submit(){
            this.modalInstance1.close();
            if(this.admin =='octava' ||this.admin =='Octava' ){  // take care of table auto cap keyboard!
                this.admin = ''
                this.modalInstance2.open();
            }else{
                alert('No access')
            }
        },
        closeModal2(_input){
            if(_input == 'synch'){
                alert('Please re-power Cisco switch before Synchronizing switch')
                this.modalInstance2.close();
            }else{
                this.modalInstance2.close();
            }
        },
            
        goHome(){
            this.$router.push({ name: `home`})
        },
        savePreset(preset){
            const serverURL = `${location.hostname}:3000`
            let currentScene = {}
          
                // Save current scene 
                for(let i = 0; i < this.snmpStatus.rxCount; i++){
                currentScene[`tv${i+1}`] = this.snmpStatus.PortVlanMembership[i+this.snmpStatus.txCount] -1 // Example, tv1 = 1 (1, denotes source)
                }
           
               //Save to server
                fetch(`http://${serverURL}/write/Preset${preset}/${JSON.stringify(currentScene)}`)
                .then(()=>{
                    M.toast({ html: `Save to Preset${preset}`, classes: "rounded blue" })
                    this.closeModal2()
                })
                .catch(error => console.log(error));

            this.$router.push({ name: `zone1`})  //a hack. forces route to change to zone 1 ->home to force a re-read of server
            this.$router.push({ name: `home`})
        }

    },
    created(){
        // Use an arrow function to maintain 'this' context
        // send api request to Octava Controller to see if the Controller has the updated 'Timer_PoE' flow installed. 
        const get_check_if_node_red_timer_poe_installed = async () => {
               const serverURL = `${location.hostname}:1880`
                try {
                const response = await fetch(`http://${serverURL}/check_if_node_red_timer_poe_installed`);

                if (!response.ok) {
                // Throw an error if the status is not ok (e.g., 404, 500)
                throw new Error(`HTTP error! Status: ${response.status}`);
                }
                // 2. Await the response.text() call to read the body content
                const message = await response.text();
                    if (message === 'node-red-timer-poe-installed') {
                        this.poe_timer_node_installed = true; 
                    } else {
                        this.poe_timer_node_installed = false;
                    }
                } catch (error) {
                    console.error("Fetch failed:", error);
                }
        }

        get_check_if_node_red_timer_poe_installed();

    },
    mounted(){
        M.AutoInit() // For Materialize to work!
    
        const modal1 = document.getElementById('modal1')
        this.modalInstance1 = M.Modal.init(modal1);

        const modal2 = document.getElementById('modal2')
        this.modalInstance2 = M.Modal.init(modal2);
    },
    beforeDestroy() {
    // 1. Check if the instance exists before trying to destroy it.
    if (this.modalInstance1) {
        // Calls Materialize's cleanup function, removing event listeners and memory residue.
        this.modalInstance1.destroy();
        console.log('Modal 1 destroyed successfully.');
    }
    
    // 2. Destroy the second modal instance.
    if (this.modalInstance2 ) {
        this.modalInstance2.destroy();
        console.log('Modal 2 destroyed successfully.');
    }
}

}
</script>

<style scoped>
    .nav-extended{
        /* background-color: rgb(28,28,30); */
        background-color: rgb(66, 66, 66);
    }
    .blue-icon{
        color:#2196f3 !important;
        padding: 10px;
    }
    img{
        width: 100px;
        /* background-color: rgb(28,28,30); */
    }
    .modal{
        height:100vh;
    }
    .modal-content-admin {
        display:flex;
        flex-direction: row;
        justify-content: center ;
        align-items: center ;
        height:30vh
    }
     .modal-content-settings {
        display:flex;
        justify-content:space-evenly ;
        align-items: center ;
    }

    input[type=text]:focus{
     border-bottom: 1px solid #2196f3 !important ;
    }
    .card-relative {
    position: relative; /* Makes this the reference point for absolute positioning */
    }
    .card-close-btn {
        position:absolute;
        top: 10px;    /* Adjust as needed to position from the top edge */
        left: 10px;  /* Adjust as needed to position from the right edge */
        z-index: 1050; 
        cursor: pointer;
    }


.modal-content-settings {
    /* Retain original display flex properties if needed, but the inner grid will control alignment */
    /* display: flex; 
    justify-content:space-evenly ; 
    align-items: center ; */
    display: block; /* Change to block to allow row/col structure */
    padding: 0 20px; /* Add horizontal padding */

}

.settings-grid {
    margin-top: 20px; /* Space below the title */
    display: flex; /* Ensure the row uses flex for equal column spacing */
    flex-wrap: wrap;
    justify-content: center;
}

.settings-grid .col {
    margin-bottom: 20px; /* Space between rows */
    padding: 0 10px !important; /* Adjust column padding */
}

.setting-card {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    min-height: 60px; /* Uniform height for cards */
    padding: 15px 5px;
    border: 1px solid #2196f3; /* Blue border */
    border-radius: 8px;
    cursor: pointer;
    background-color: #f8f8f8; /* Light background for a card feel */
    transition: background-color 0.2s;
}

.setting-card:hover {
    background-color: lightskyblue; /* Hover effect */
    border-color: #0d47a1; /* Darker border on hover */
}

.setting-card a {
    text-decoration: none; /* Remove underline from router-links */
    color: inherit;
}

.card-text {
    font-size: 14px;
    font-weight: 100;
    margin-top: 5px;
    color:black
}

.blue-icon {
    color:#2196f3 !important;
    padding: 0; /* Remove old padding */
}
.disabled-link {
    /* Visually indicate that the link is inactive */
    opacity: 0.6; /* Slight transparency */
    cursor: not-allowed !important; /* Change cursor to 'no entry' sign */
    pointer-events: none; /* Crucially prevents the actual click event from propagating */
}

</style>