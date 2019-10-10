import Vue from 'vue'
import Vuex from 'vuex'
import { getRobotState } from '@/rest'
import Mqtt from '@/mqtt'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    robotState: 'initial',
    restEndpoint: '',
    restToken: '',
    restPrefix: '/controller',
    mqttEndpoint: '',
    mqttUsername: '',
    mqttPassword: '',
    robotType: 'robot_ui',
    robotId: '',
    uiId: '',
    message: '',
    variant: '',
    destination: '',
    mqttClient: null
  },
  mutations: {
    updateMessage(state, params) {
      state.message = params.message
      state.variant = params.variant
    },
    updateConfig (state, params) {
      state.restEndpoint = params.restEndpoint
      state.restToken = params.restToken
      state.restPrefix = params.restPrefix
      state.mqttEndpoint = params.mqttEndpoint
      state.mqttUsername = params.mqttUsername
      state.mqttPassword = params.mqttPassword
      state.robotType = params.robotType
      state.robotId = params.robotId
      state.uiId = params.uiId
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
    setMQTTClient (state, mqttClient) {
      state.mqttClient = mqttClient
    },
    removeMQTTClient (state) {
      state.mqttClient = null
    },
    updateRobotState (state, params) {
      state.robotState = params.robotState
      state.destination = params.destination
    },
  },
  actions: {
    saveAction ({commit}, params) {
      commit('updateConfig', params)
      commit('save')
    },
    getInitialStateAction ({commit, state}) {
      getRobotState(state.restEndpoint, state.restPrefix, state.restToken, state.robotId).then(res => {
        if (res.result == 'success') {
          commit('updateRobotState', {robotState: res.data.state, destination: res.data.destination})
        }
        else {
          commit('updateMessage', {message: 'error when retrieving robot state', variant: 'danger'})
        }
      })
    },
    connectAction ({commit, dispatch, state}) {
      const cmdTopic = '/' + state.robotType + '/' + state.uiId + '/cmd'
      const cmdexeTopic = '/' + state.robotType + '/' + state.uiId + '/cmdexe'
      const mqttClient = new Mqtt(state.mqttEndpoint, state.mqttUsername, state.mqttPassword)
      commit('setMQTTClient', mqttClient)
      mqttClient.connect(() => {
        mqttClient.subscribeCmd(cmdTopic, (message) => {
          commit('updateRobotState', {robotState: message.send_state.state, destination: message.send_state.destination})
          mqttClient.publishCmdexe(cmdexeTopic, message)
        })
        dispatch('getInitialStateAction')
      })
    },
    disconnectAction ({commit, state}) {
      if (state.mqttClient.disconnect()) {
        commit('removeMQTTClient')
        commit('updateRobotState', {robotState: 'initial'})
      }
    },
  },
  getters: {
    message: (state) => state.message,
    variant: (state) => state.variant,
  },
})
