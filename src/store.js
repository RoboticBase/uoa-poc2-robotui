import Vue from 'vue'
import Vuex from 'vuex'
import { getRobotState, patchMoveNext } from '@/rest'
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
    mqttClient: null,
    isInitialStateCalled: false,
    lockMessage: null,
    lockUtterance: ''
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
    initInitialState (state) {
      state.isInitialStateCalled = false
    },
    calledInitialState (state) {
      state.isInitialStateCalled = true
    },
    updateLockState (state, params) {
      state.lockMessage = params.lockMessage
      state.lockUtterance = params.lockUtterance
    },
    clear (state) {
      state.robotState = 'initial'
      state.restEndpoint = ''
      state.restToken = ''
      state.restPrefix = '/controller'
      state.mqttEndpoint = ''
      state.mqttUsername = ''
      state.mqttPassword = ''
      state.robotType = 'robot_ui'
      state.robotId = ''
      state.uiId = ''
      state.message = ''
      state.variant = ''
      state.destination = ''
      state.mqttClient = null
      state.isInitialStateCalled = false
      state.lockMessage = null
      state.lockUtterance = ''
    },
  },
  actions: {
    initAction ({commit}) {
      commit('initInitialState')
    },
    saveAction ({commit}, params) {
      commit('updateConfig', params)
      commit('save')
    },
    getInitialStateAction ({commit, state}) {
      getRobotState(state.restEndpoint, state.restPrefix, state.restToken, state.robotId).then(res => {
        if (res.result == 'success') {
          commit('updateRobotState', {robotState: res.data.state, destination: res.data.destination})
          commit('calledInitialState')
        }
        else {
          commit('updateMessage', {message: 'error when retrieving robot state', variant: 'danger'})
        }
      })
    },
    connectAction ({commit, dispatch, state}, cb) {
      const cmdTopic = '/' + state.robotType + '/' + state.uiId + '/cmd'
      const cmdexeTopic = '/' + state.robotType + '/' + state.uiId + '/cmdexe'
      const mqttClient = new Mqtt(state.mqttEndpoint, state.mqttUsername, state.mqttPassword)
      commit('setMQTTClient', mqttClient)
      mqttClient.connect(() => {
        if (!state.isInitialStateCalled) {
          mqttClient.subscribeCmd(cmdTopic, (message) => {
            commit('updateRobotState', {robotState: message.send_state.state, destination: message.send_state.destination})
            mqttClient.publishStateCmdexe(cmdexeTopic, message)
          }, (message) => {
            if (message.send_token_info.mode === 'suspend') {
              commit('updateLockState', {
                lockMessage: message.send_token_info.lock_owner_id + 'が作業中のため',
                lockUtterance: '他のロボットが作業中のため、一時待機します。'
              })
            } else if (message.send_token_info.mode === 'resume') {
              commit('updateLockState', {
                lockMessage: null,
                lockUtterance: '他のロボットの作業が完了しました。移動を再開します。'
              })
            }
            mqttClient.publishTokenInfoCmdexe(cmdexeTopic, message)
          })
          dispatch('getInitialStateAction')
        }
        cb()
      })
    },
    disconnectAction ({commit, state}) {
      if (state.mqttClient.disconnect()) {
        commit('removeMQTTClient')
        commit('updateRobotState', {robotState: 'initial'})
      }
    },
    moveNextAction ({commit, state}, cb) {
      commit('updateMessage', {message: '通信中', variant: 'info'})
      patchMoveNext(state.restEndpoint, state.restPrefix, state.restToken, state.robotId).then(res => {
        if (res.result != 'success') {
          const variant = res.result == 'warning' ? 'warning' : 'danger'
          commit('updateMessage', {message: res.message, variant: variant})
        }
        cb()
      })
    },
  },
  getters: {
    message: (state) => state.message,
    variant: (state) => state.variant,
  },
})
