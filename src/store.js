import Vue from 'vue'
import Vuex from 'vuex'
import { getRobotState } from '@/rest'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    robotState: 'initial',
    restEndpoint: '',
    restToken: '',
    restPrefix: '/controller',
    robotId: '',
    message: '',
    variant: ''
  },
  mutations: {
    updateRobotState (state, params) {
      state.robotState = params.robotState
    },
    updateMessage(state, params) {
      state.message = params.message
      state.variant = params.variant
    },
    updateConfig (state, params) {
      state.restEndpoint = params.restEndpoint
      state.restToken = params.restToken
      state.restPrefix = params.restPrefix
      state.robotId = params.robotId
    },
    save (state) {
      localStorage.setItem('store', JSON.stringify(state))
    },
    load (state) {
      if (localStorage.getItem('store')) {
        try {
          const store = JSON.parse(localStorage.getItem('store'))
          this.replaceState(Object.assign(state, store))
        } catch (e) {
          localStorage.removeItem('store')
        }
      }
    },
  },
  actions: {
    connectAction ({commit, state}, params) {
      commit('updateConfig', params)
      commit('save')
      getRobotState(state.restEndpoint, state.restPrefix, state.restToken, state.robotId).then(res => {
        if (res.result == 'success') {
          commit('updateRobotState', {robotState: res.data.state})
        }
        else {
          commit('updateMessage', {message: 'error when retrieving robot state', variant: 'danger'})
        }
      })
    },
  },
  getters: {
    message: (state) => state.message,
    variant: (state) => state.variant,
  },
})
