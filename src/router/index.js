import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Zones from '@/components/Zones'
import Ipaddress from '@/components/Ipaddress'
import Status from '@/components/Status'
import Sidenav from '@/components/Sidenav'
import Name_inputs from '@/components/Name_inputs'
import Name_outputs from "@/components/Name_outputs";
import Name_zones from "@/components/Name_zones";
import Dashboard from "@/components/Dashboard";
import Timer from "@/components/Timer";
import Capacitycontrol from "@/components/Capacitycontrol";
import Update from "@/components/Update";
import RemoteControl from "@/components/RemoteControl";
import Itach from "@/components/Itach";
import Favoritechannels from "@/components/Favoritechannels";
import Multiviewer from "@/components/Multiviewer";
import MultiViewControl from "@/components/MultiViewControl";


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/sidenav',
      name: 'sidenav',
      component: Sidenav
    },
    {
      path: '/zones',
      name: 'zones',
      component: Zones
    },

    {
      path: '/ipaddress',
      name: 'ipaddress',
      component: Ipaddress
    },
    {
      path: '/status',
      name: 'status',
      component: Status
    },
    {
      path: '/name-inputs',
      name: 'name_inputs',
      component: Name_inputs
    },
    {
      path: '/name-outputs',
      name: 'name_outputs',
      component: Name_outputs
    },
    {
      path: '/name-zones',
      name: 'name_zones',
      component: Name_zones
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard
    },
    {
      path: '/timer',
      name: 'timer',
      component: Timer
    },
    {
      path: '/capacitycontrol',
      name: 'capacitycontrol',
      component: Capacitycontrol
    },
    {
      path: '/update',
      name: 'update',
      component: Update
    },
    {
      path: '/remotecontrol',
      name: 'remotecontrol',
      component: RemoteControl
    },
    {
      path: '/itach',
      name: 'itach',
      component: Itach
    },
    {
      path: '/multiviewer',
      name: 'multiviewer',
      component: Multiviewer
    },
    {
      path: '/multiviewcontrol',
      name: 'multiviewcontrol',
      component: MultiViewControl
    },
    {
      path: '/favoritechannels',
      name: 'favoritechannels',
      component: Favoritechannels
    },

  ]
})

