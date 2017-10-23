import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'

const vuexLocal = new VuexPersistence({
  storage: window.localStorage
})

Vue.use(Vuex)

const state = {
  api: 'http://psz.ft0.ch/api', // http://localhost:65434/api
  id: null,
  counter: 0,
  maxCount: 8,
  didSubmit: false,
  skipped: 0,
  deviceType: 'private',
  templates: [
    ['Psychoanalyse muss ', ''],
    ['In 40 Jahren ist das PSZ ein Ort ', ''],
    ['', ' muss dem PSZ unbedingt erhalten bleiben'],
    ['Für mich ist die Psychoanalyse schön, wenn sie ', ''],
    ['Das PSZ sollte endlich aufhören ', ''],
    ['Die grösste Schande für das PSZ wäre ', ''],
    ['Wenn du Streit am PSZ suchst, so trage an der TV ein T-Shirt mit der Aufschrift: ', ''],
    ['Psychoanalyse darf nie ', ''],
    ['An der Psychoanalyse interessiert mich nichts so sehr wie ', ''],
    ['Ich brauche die Psychoanalyse nicht nur zur Selbsterkenntnis, sondern auch ', ''],
    ['', ' schadet dem Ruf der Psychoanalyse.'],
    ['Das Wort «', '» ist ein schreckliches Modewort der Psychoanalyse.'],
    ['Von allen Psychoanalytikern mag ich die Sorte «', '» am liebsten.']
  ]
}

const mutations = {
  INCREMENT_COUNTER (state) {
    state.counter++
  },
  RESET_COUNTER (state) {
    state.counter = 0
  },
  SET_ID (state, val) {
    state.id = val
  },
  SUBMITTED (state) {
    state.didSubmit = true
  },
  SKIPPED (state) {
    state.skipped++
  },
  RESET_SKIPPED (state) {
    state.skipped = 0
  },
  RESET (state) {
    state.id = null
    state.counter = 0
    state.didSubmit = false
    state.skipped = 0
  },
  PUBLIC_DEVICE (state) {
    state.deviceType = 'public'
  },
  PRIVATE_DEVICE (state) {
    state.deviceType = 'private'
  },
  SET_MAX_COUNT (state) {
    state.maxCount = 8
  }
}

const actions = {
  incrementAsync ({ commit }) {
    setTimeout(() => {
      commit('INCREMENT')
    }, 200)
  }
}

const store = new Vuex.Store({
  state,
  mutations,
  actions,
  plugins: [vuexLocal.plugin]
})

export default store
