import Vue from 'vue'
import Router from 'vue-router'
import Viz from '../views/Viz'

Vue.use(Router)

export default new Router({
  mode: 'hash',
  routes: [{
    path: '/',
    component: Viz
  }]
})
