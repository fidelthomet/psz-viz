import Vue from 'vue'
import Router from 'vue-router'
import Viz from '../views/Viz'
import Rate from '../views/Rate'
import Auth from '../views/Auth'
import Input from '../views/Input'
import Signout from '../views/Signout'
import Settings from '../views/Settings'
import PublicDevice from '../views/PublicDevice'
import PrivateDevice from '../views/PrivateDevice'
import VizManual from '../views/VizManual'

Vue.use(Router)

export default new Router({
  mode: 'hash',
  routes: [
    {
      path: '/viz',
      component: Viz
    }, {
      path: '/manual',
      component: VizManual
    }, {
      path: '/',
      component: VizManual
    // }, {
    //   path: '/rate',
    //   component: Rate
    // }, {
    //   path: '/',
    //   component: Auth
    // }, {
    //   path: '/auth',
    //   component: Auth
    // }, {
    //   path: '/input',
    //   component: Input
    // }, {
    //   path: '/signout',
    //   component: Signout
    }, {
      path: '/ganzgeheimeeinstellungen',
      component: Settings
    // }, {
    //   path: '/public',
    //   component: PublicDevice
    // }, {
    //   path: '/private',
      // component: PrivateDevice
    }
  ]
})
