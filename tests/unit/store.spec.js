import store from '@/store'
import { before, after } from '@/../tests/vueCommon.js'
import { getRobotState, patchMoveNext } from '@/rest'
import Mqtt from '@/mqtt'

jest.mock('@/rest')
jest.mock('@/mqtt')

beforeAll(before(jest))
afterAll(after())

describe('state', () => {
  it('has a default value', () => {
    expect(store.state.robotState).toMatch('initial')
    expect(store.state.restEndpoint).toMatch('')
    expect(store.state.restToken).toMatch('')
    expect(store.state.restPrefix).toMatch('/controller')
    expect(store.state.mqttEndpoint).toMatch('')
    expect(store.state.mqttUsername).toMatch('')
    expect(store.state.mqttPassword).toMatch('')
    expect(store.state.robotType).toMatch('robot_ui')
    expect(store.state.robotId).toMatch('')
    expect(store.state.uiId).toMatch('')
    expect(store.state.message).toMatch('')
    expect(store.state.variant).toMatch('')
    expect(store.state.destination).toMatch('')
    expect(store.state.mqttClient).toBeNull()
    expect(store.state.isInitialStateCalled).toBeFalsy()
    expect(store.state.lockMessage).toBeNull()
    expect(store.state.lockUtterance).toMatch('')
  })
})

describe('mutation', () => {
  afterEach(() => {
    store.commit('clear')
  })

  describe('updateMessage', () => {
    const message = 'test message'
    const variant = 'test variant'

    it('updates the state of "message" and "variant"', () => {
      expect(store.state.message).toMatch('')
      expect(store.state.variant).toMatch('')

      store.commit('updateMessage', {message, variant})

      expect(store.state.message).toMatch(message)
      expect(store.state.variant).toMatch(variant)
    })
  })

  describe('updateConfig', () => {
    const restEndpoint = 'test restEndpoint'
    const restToken = 'test restToken'
    const restPrefix = 'test restPrefix'
    const mqttEndpoint = 'test mqttEndpoint'
    const mqttUsername = 'test mqttUsername'
    const mqttPassword = 'test mqttPassword'
    const robotType = 'test robotType'
    const robotId = 'test robotId'
    const uiId = 'test uiId'

    it('updates the state of some configurations', () => {
      expect(store.state.restEndpoint).toMatch('')
      expect(store.state.restToken).toMatch('')
      expect(store.state.restPrefix).toMatch('/controller')
      expect(store.state.mqttEndpoint).toMatch('')
      expect(store.state.mqttUsername).toMatch('')
      expect(store.state.mqttPassword).toMatch('')
      expect(store.state.robotType).toMatch('robot_ui')
      expect(store.state.robotId).toMatch('')
      expect(store.state.uiId).toMatch('')

      store.commit('updateConfig', {
        restEndpoint,
        restToken,
        restPrefix,
        mqttEndpoint,
        mqttUsername,
        mqttPassword,
        robotType,
        robotId,
        uiId
      })

      expect(store.state.restEndpoint).toMatch(restEndpoint)
      expect(store.state.restToken).toMatch(restToken)
      expect(store.state.restPrefix).toMatch(restPrefix)
      expect(store.state.mqttEndpoint).toMatch(mqttEndpoint)
      expect(store.state.mqttUsername).toMatch(mqttUsername)
      expect(store.state.mqttPassword).toMatch(mqttPassword)
      expect(store.state.robotType).toMatch(robotType)
      expect(store.state.robotId).toMatch(robotId)
      expect(store.state.uiId).toMatch(uiId)
    })
  })

  describe('setMQTTClient and removeMQTTClient', () => {
    const mqttClient = {test: 'test mqttClient'}

    it('update the state of "mqttClient"', () => {
      expect(store.state.mqttClient).toBeNull()

      store.commit('setMQTTClient', mqttClient)

      expect(store.state.mqttClient).toMatchObject(mqttClient)

      store.commit('removeMQTTClient')

      expect(store.state.mqttClient).toBeNull()
    })
  })

  describe('updateRobotState', () => {
    const robotState = 'test robotState'
    const destination = 'test destination'

    it('updates the state of "robotState" and "destination"', () => {
      expect(store.state.robotState).toMatch('initial')
      expect(store.state.destination).toMatch('')

      store.commit('updateRobotState', {robotState, destination})

      expect(store.state.robotState).toMatch(robotState)
      expect(store.state.destination).toMatch(destination)
    })

  })

  describe('initInitialState and CalledInitialState', () => {

    it('update the state of "isInitialStateCalled"', () => {
      expect(store.state.isInitialStateCalled).toBeFalsy()

      store.commit('initInitialState')

      expect(store.state.isInitialStateCalled).toBeFalsy()

      store.commit('calledInitialState')

      expect(store.state.isInitialStateCalled).toBeTruthy()

      store.commit('initInitialState')

      expect(store.state.isInitialStateCalled).toBeFalsy()
    })
  })

  describe('updateLockState', () => {
    const lockMessage = 'test lockMessage'
    const lockUtterance = 'test lockUtterance'

    it('updates the state of "lockMessage" and "lockUtterance"', () => {
      expect(store.state.lockMessage).toBeNull()
      expect(store.state.lockUtterance).toMatch('')

      store.commit('updateLockState', {lockMessage, lockUtterance})

      expect(store.state.lockMessage).toMatch(lockMessage)
      expect(store.state.lockUtterance).toMatch(lockUtterance)
    })
  })

  describe('save and load', () => {
    const robotState = 'saved robotState'
    const restEndpoint = 'saved restEndpoint'
    const restToken = 'saved restToken'
    const restPrefix = 'saved restPrefix'
    const mqttEndpoint = 'saved mqttEndpoint'
    const mqttUsername = 'saved mqttUsername'
    const mqttPassword = 'saved mqttPassword'
    const robotType = 'saved robotType'
    const robotId = 'saved robotId'
    const uiId = 'saved uiId'
    const message = 'saved message'
    const variant = 'saved variant'
    const destination = 'saved destination'
    const mqttClient = {saved: 'saved mqttClient'}
    const lockMessage = 'saved lockMessage'
    const lockUtterance = 'saved lockUtterance'

    beforeEach(() => {
      jest.spyOn(window.localStorage.__proto__, 'getItem')
      jest.spyOn(window.localStorage.__proto__, 'setItem')
      jest.spyOn(window.localStorage.__proto__, 'removeItem')
    })

    afterEach(() => {
      localStorage.getItem.mockClear()
      localStorage.setItem.mockClear()
      localStorage.removeItem.mockClear()
    })

    describe('save', () => {
      it('stores the states to localStorage', () => {
        store.commit('updateMessage', {message, variant})
        store.commit('updateConfig', {
          restEndpoint,
          restToken,
          restPrefix,
          mqttEndpoint,
          mqttUsername,
          mqttPassword,
          robotType,
          robotId,
          uiId
        })
        store.commit('setMQTTClient', mqttClient)
        store.commit('updateRobotState', {robotState, destination})
        store.commit('calledInitialState')
        store.commit('updateLockState', {lockMessage, lockUtterance})

        store.commit('save')

        expect(localStorage.getItem).not.toHaveBeenCalled()
        expect(localStorage.setItem).toHaveBeenCalledTimes(1)
        expect(localStorage.removeItem).not.toHaveBeenCalled()
        expect(localStorage.setItem.mock.calls[0][0]).toMatch('store')
        expect(JSON.parse(localStorage.setItem.mock.calls[0][1])).toMatchObject({
          robotState,
          restEndpoint,
          restToken,
          restPrefix,
          mqttEndpoint,
          mqttUsername,
          mqttPassword,
          robotType,
          robotId,
          uiId,
          message,
          variant,
          destination,
          mqttClient,
          isInitialStateCalled: true,
          lockMessage,
          lockUtterance,
        })
      })
    })

    describe('load', () => {
      it('restores the states from localStorage when valid states are stored', () => {
        localStorage.getItem.mockReturnValue(JSON.stringify({
          robotState,
          restEndpoint,
          restToken,
          restPrefix,
          mqttEndpoint,
          mqttUsername,
          mqttPassword,
          robotType,
          robotId,
          uiId,
          message,
          variant,
          destination,
          mqttClient,
          isInitialStateCalled: true,
          lockMessage,
          lockUtterance,
        }))

        store.commit('load')

        expect(store.state.robotState).toMatch(robotState)
        expect(store.state.restEndpoint).toMatch(restEndpoint)
        expect(store.state.restToken).toMatch(restToken)
        expect(store.state.restPrefix).toMatch(restPrefix)
        expect(store.state.mqttEndpoint).toMatch(mqttEndpoint)
        expect(store.state.mqttUsername).toMatch(mqttUsername)
        expect(store.state.mqttPassword).toMatch(mqttPassword)
        expect(store.state.robotType).toMatch(robotType)
        expect(store.state.robotId).toMatch(robotId)
        expect(store.state.uiId).toMatch(uiId)
        expect(store.state.message).toMatch(message)
        expect(store.state.variant).toMatch(variant)
        expect(store.state.destination).toMatch(destination)
        expect(store.state.mqttClient).toMatchObject(mqttClient)
        expect(store.state.isInitialStateCalled).toBeTruthy()
        expect(store.state.lockMessage).toMatch(lockMessage)
        expect(store.state.lockUtterance).toMatch(lockUtterance)

        expect(localStorage.getItem).toHaveBeenCalledTimes(2)
        expect(localStorage.setItem).not.toHaveBeenCalled()
        expect(localStorage.removeItem).not.toHaveBeenCalled()
        expect(localStorage.getItem.mock.calls[0][0]).toMatch('store')
        expect(localStorage.getItem.mock.calls[1][0]).toMatch('store')
      })

      it('does nothing when localStorage has no state', () => {
        localStorage.getItem.mockReturnValue(undefined)

        store.commit('load')

        expect(store.state.robotState).toMatch('initial')
        expect(store.state.restEndpoint).toMatch('')
        expect(store.state.restToken).toMatch('')
        expect(store.state.restPrefix).toMatch('/controller')
        expect(store.state.mqttEndpoint).toMatch('')
        expect(store.state.mqttUsername).toMatch('')
        expect(store.state.mqttPassword).toMatch('')
        expect(store.state.robotType).toMatch('robot_ui')
        expect(store.state.robotId).toMatch('')
        expect(store.state.uiId).toMatch('')
        expect(store.state.message).toMatch('')
        expect(store.state.variant).toMatch('')
        expect(store.state.destination).toMatch('')
        expect(store.state.mqttClient).toBeNull()
        expect(store.state.isInitialStateCalled).toBeFalsy()
        expect(store.state.lockMessage).toBeNull()
        expect(store.state.lockUtterance).toMatch('')

        expect(localStorage.getItem).toHaveBeenCalledTimes(1)
        expect(localStorage.setItem).not.toHaveBeenCalled()
        expect(localStorage.removeItem).not.toHaveBeenCalled()
        expect(localStorage.getItem.mock.calls[0][0]).toMatch('store')
      })

      it('removes data from localStorage if stored data is invalid json', () => {
        localStorage.getItem.mockReturnValue('invalid')

        store.commit('load')

        expect(store.state.robotState).toMatch('initial')
        expect(store.state.restEndpoint).toMatch('')
        expect(store.state.restToken).toMatch('')
        expect(store.state.restPrefix).toMatch('/controller')
        expect(store.state.mqttEndpoint).toMatch('')
        expect(store.state.mqttUsername).toMatch('')
        expect(store.state.mqttPassword).toMatch('')
        expect(store.state.robotType).toMatch('robot_ui')
        expect(store.state.robotId).toMatch('')
        expect(store.state.uiId).toMatch('')
        expect(store.state.message).toMatch('')
        expect(store.state.variant).toMatch('')
        expect(store.state.destination).toMatch('')
        expect(store.state.mqttClient).toBeNull()
        expect(store.state.isInitialStateCalled).toBeFalsy()
        expect(store.state.lockMessage).toBeNull()
        expect(store.state.lockUtterance).toMatch('')

        expect(localStorage.getItem).toHaveBeenCalledTimes(2)
        expect(localStorage.setItem).not.toHaveBeenCalled()
        expect(localStorage.removeItem).toHaveBeenCalledTimes(1)
        expect(localStorage.getItem.mock.calls[0][0]).toMatch('store')
        expect(localStorage.getItem.mock.calls[1][0]).toMatch('store')
        expect(localStorage.removeItem.mock.calls[0][0]).toMatch('store')
      })

      it('add additional data when stored data has a new attribute', () => {
        const robotState = 'additional robotState'
        const dummy = 'dummy'
        localStorage.getItem.mockReturnValue(JSON.stringify({robotState, dummy}))

        store.commit('load')

        expect(store.state.robotState).toMatch(robotState)
        expect(store.state.restEndpoint).toMatch('')
        expect(store.state.restToken).toMatch('')
        expect(store.state.restPrefix).toMatch('/controller')
        expect(store.state.mqttEndpoint).toMatch('')
        expect(store.state.mqttUsername).toMatch('')
        expect(store.state.mqttPassword).toMatch('')
        expect(store.state.robotType).toMatch('robot_ui')
        expect(store.state.robotId).toMatch('')
        expect(store.state.uiId).toMatch('')
        expect(store.state.message).toMatch('')
        expect(store.state.variant).toMatch('')
        expect(store.state.destination).toMatch('')
        expect(store.state.mqttClient).toBeNull()
        expect(store.state.isInitialStateCalled).toBeFalsy()
        expect(store.state.lockMessage).toBeNull()
        expect(store.state.lockUtterance).toMatch('')
        expect(store.state.dummy).toMatch(dummy)

        expect(localStorage.getItem).toHaveBeenCalledTimes(2)
        expect(localStorage.setItem).not.toHaveBeenCalled()
        expect(localStorage.removeItem).not.toHaveBeenCalled()
        expect(localStorage.getItem.mock.calls[0][0]).toMatch('store')
        expect(localStorage.getItem.mock.calls[1][0]).toMatch('store')
      })
    })
  })
})

describe('action', () => {
  afterEach(() => {
    store.commit('clear')
  })

  describe('initAction', () => {
    it('dispatches "initInitialState"', () => {
      store.commit('calledInitialState')
      expect(store.state.isInitialStateCalled).toBeTruthy()

      store.dispatch('initAction')

      expect(store.state.isInitialStateCalled).toBeFalsy()
    })
  })

  describe('saveAction', () => {
    const restEndpoint = 'action restEndpoint'
    const restToken = 'action restToken'
    const restPrefix = 'action restPrefix'
    const mqttEndpoint = 'action mqttEndpoint'
    const mqttUsername = 'action mqttUsername'
    const mqttPassword = 'action mqttPassword'
    const robotType = 'action robotType'
    const robotId = 'action robotId'
    const uiId = 'action uiId'

    beforeEach(() => {
      jest.spyOn(window.localStorage.__proto__, 'getItem')
      jest.spyOn(window.localStorage.__proto__, 'setItem')
      jest.spyOn(window.localStorage.__proto__, 'removeItem')
    })

    afterEach(() => {
      localStorage.getItem.mockClear()
      localStorage.setItem.mockClear()
      localStorage.removeItem.mockClear()
    })

    it('dispatches "updateConfig" and "save"', () => {
      expect(store.state.restEndpoint).toMatch('')
      expect(store.state.restToken).toMatch('')
      expect(store.state.restPrefix).toMatch('/controller')
      expect(store.state.mqttEndpoint).toMatch('')
      expect(store.state.mqttUsername).toMatch('')
      expect(store.state.mqttPassword).toMatch('')
      expect(store.state.robotType).toMatch('robot_ui')
      expect(store.state.robotId).toMatch('')
      expect(store.state.uiId).toMatch('')

      store.dispatch('saveAction', {
        restEndpoint,
        restToken,
        restPrefix,
        mqttEndpoint,
        mqttUsername,
        mqttPassword,
        robotType,
        robotId,
        uiId
      })

      expect(store.state.restEndpoint).toMatch(restEndpoint)
      expect(store.state.restToken).toMatch(restToken)
      expect(store.state.restPrefix).toMatch(restPrefix)
      expect(store.state.mqttEndpoint).toMatch(mqttEndpoint)
      expect(store.state.mqttUsername).toMatch(mqttUsername)
      expect(store.state.mqttPassword).toMatch(mqttPassword)
      expect(store.state.robotType).toMatch(robotType)
      expect(store.state.robotId).toMatch(robotId)
      expect(store.state.uiId).toMatch(uiId)

      expect(localStorage.getItem).not.toHaveBeenCalled()
      expect(localStorage.setItem).toHaveBeenCalledTimes(1)
      expect(localStorage.removeItem).not.toHaveBeenCalled()
      expect(localStorage.setItem.mock.calls[0][0]).toMatch('store')
      expect(JSON.parse(localStorage.setItem.mock.calls[0][1])).toMatchObject({
        robotState: 'initial',
        restEndpoint,
        restToken,
        restPrefix,
        mqttEndpoint,
        mqttUsername,
        mqttPassword,
        robotType,
        robotId,
        uiId,
        message: '',
        variant: '',
        destination: '',
        mqttClient: null,
        isInitialStateCalled: false,
        lockMessage: null,
        lockUtterance: '',
      })
    })
  })

  describe('getInitialStateAction', () => {
    afterEach(() => {
      getRobotState.mockClear()
    })

    it('calls rest.getRobotState, and updates some states when the result is success', (done) => {
      const robotState = 'action robotState'
      const destination = 'action destination'

      getRobotState.mockResolvedValue({
        result: 'success',
        data: {
          state: robotState,
          destination: destination
        }
      })

      expect(store.state.robotState).toMatch('initial')
      expect(store.state.destination).toMatch('')
      expect(store.state.isInitialStateCalled).toBeFalsy()
      expect(store.state.message).toMatch('')
      expect(store.state.variant).toMatch('')

      store.dispatch('getInitialStateAction')

      process.nextTick(() => {
        expect(store.state.robotState).toMatch(robotState)
        expect(store.state.destination).toMatch(destination)
        expect(store.state.isInitialStateCalled).toBeTruthy()
        expect(store.state.message).toMatch('')
        expect(store.state.variant).toMatch('')
        done()
      })
      expect.assertions(10)
    })

    it('calls rest.getRobotState, and updates message when the result is not success', (done) => {
      getRobotState.mockResolvedValue({result: 'failure'})

      expect(store.state.robotState).toMatch('initial')
      expect(store.state.destination).toMatch('')
      expect(store.state.isInitialStateCalled).toBeFalsy()
      expect(store.state.message).toMatch('')
      expect(store.state.variant).toMatch('')

      store.dispatch('getInitialStateAction')

      process.nextTick(() => {
        expect(store.state.robotState).toMatch('initial')
        expect(store.state.destination).toMatch('')
        expect(store.state.isInitialStateCalled).toBeFalsy()
        expect(store.state.message).toMatch('error when retrieving robot state')
        expect(store.state.variant).toMatch('danger')
        done()
      })
      expect.assertions(10)
    })
  })

  describe('moveNextAction', () => {
    it('calls rest.patchMoveNext, and emits callback when the result is success', (done) => {
      patchMoveNext.mockResolvedValue({result: 'success'})

      expect(store.state.message).toMatch('')
      expect(store.state.variant).toMatch('')

      store.dispatch('moveNextAction', () => {
        expect(store.state.message).toMatch('通信中')
        expect(store.state.variant).toMatch('info')
        done()
      })
      expect(store.state.message).toMatch('通信中')
      expect(store.state.variant).toMatch('info')
      expect.assertions(6)
    })

    it('calls rest.patchMoveNext, and sets an error message when the result is warning', (done) => {
      const result = 'warning'
      const message = 'moveNextAction warning'
      patchMoveNext.mockResolvedValue({result, message})

      expect(store.state.message).toMatch('')
      expect(store.state.variant).toMatch('')

      store.dispatch('moveNextAction', () => {
        expect(store.state.message).toMatch(message)
        expect(store.state.variant).toMatch(result)
        done()
      })
      expect(store.state.message).toMatch('通信中')
      expect(store.state.variant).toMatch('info')
      expect.assertions(6)
    })

    it('calls rest.patchMoveNext, and sets an error message when the result is not success', (done) => {
      const result = 'failure'
      const message = 'moveNextAction warning'
      patchMoveNext.mockResolvedValue({result, message})

      expect(store.state.message).toMatch('')
      expect(store.state.variant).toMatch('')

      store.dispatch('moveNextAction', () => {
        expect(store.state.message).toMatch(message)
        expect(store.state.variant).toMatch('danger')
        done()
      })
      expect(store.state.message).toMatch('通信中')
      expect(store.state.variant).toMatch('info')
      expect.assertions(6)
    })
  })

  describe('connectAction', () => {
    const mqttEndpoint = 'mqtt mqttEndpoint'
    const mqttUsername = 'mqtt mqttUsername'
    const mqttPassword = 'mqtt mqttPassword'
    const robotType = 'mqtt robotType'
    const uiId = 'mqtt uiId'

    afterEach(() => {
      getRobotState.mockClear()
      Mqtt.prototype.connect.mockClear()
      Mqtt.prototype.subscribeCmd.mockClear()
      Mqtt.prototype.publishStateCmdexe.mockClear()
      Mqtt.prototype.publishTokenInfoCmdexe.mockClear()
    })

    it('calls mqtt methods', (done) => {
      const robotState = 'mqtt robotState'
      const destination = 'mqtt destination'

      getRobotState.mockResolvedValue({
        result: 'success',
        data: {
          state: robotState,
          destination: destination
        }
      })

      store.commit('updateConfig', {
        restEndpoint: '',
        restToken: '',
        restPrefix: '',
        mqttEndpoint,
        mqttUsername,
        mqttPassword,
        robotType,
        robotId: '',
        uiId
      })

      expect(store.state.robotState).toMatch('initial')
      expect(store.state.destination).toMatch('')
      expect(store.state.isInitialStateCalled).toBeFalsy()
      expect(store.state.message).toMatch('')
      expect(store.state.variant).toMatch('')
      expect(store.state.mqttClient).toBeNull()

      store.dispatch('connectAction', () => {
        expect(true).toBeTruthy()
      })

      expect(store.state.mqttClient).not.toBeNull()
      expect(Mqtt.prototype.connect).toHaveBeenCalledTimes(1)

      const connectCB = Mqtt.prototype.connect.mock.calls[0][0]
      connectCB()
      expect(Mqtt.prototype.subscribeCmd).toHaveBeenCalledTimes(1)
      expect(Mqtt.prototype.subscribeCmd.mock.calls[0][0]).toMatch('/' + robotType + '/' + uiId + '/cmd')

      expect(getRobotState).toHaveBeenCalledTimes(1)
      process.nextTick(() => {
        expect(store.state.robotState).toMatch(robotState)
        expect(store.state.destination).toMatch(destination)
        expect(store.state.isInitialStateCalled).toBeTruthy()
        expect(store.state.message).toMatch('')
        expect(store.state.variant).toMatch('')
        done()
      })
      expect(Mqtt.prototype.publishStateCmdexe).not.toHaveBeenCalled()
      expect(Mqtt.prototype.publishTokenInfoCmdexe).not.toHaveBeenCalled()
      expect.assertions(19)
    })

    it('does not subscribe mqtt topic when state.isInitialStateCalled is true', (done) => {
      const robotState = 'mqtt robotState'
      const destination = 'mqtt destination'

      getRobotState.mockResolvedValue({
        result: 'success',
        data: {
          state: robotState,
          destination: destination
        }
      })

      store.commit('updateConfig', {
        restEndpoint: '',
        restToken: '',
        restPrefix: '',
        mqttEndpoint,
        mqttUsername,
        mqttPassword,
        robotType,
        robotId: '',
        uiId
      })
      store.commit('calledInitialState')

      expect(store.state.lockMessage).toBeNull()
      expect(store.state.lockUtterance).toMatch('')
      expect(store.state.isInitialStateCalled).toBeTruthy()

      store.dispatch('connectAction', () => {
        expect(true).toBeTruthy()
      })

      expect(store.state.mqttClient).not.toBeNull()
      expect(Mqtt.prototype.connect).toHaveBeenCalledTimes(1)

      const connectCB = Mqtt.prototype.connect.mock.calls[0][0]
      connectCB()

      expect(getRobotState).not.toHaveBeenCalled()
      process.nextTick(() => {
        expect(store.state.robotState).toMatch('initial')
        expect(store.state.destination).toMatch('')
        expect(store.state.isInitialStateCalled).toBeTruthy()
        expect(store.state.message).toMatch('')
        expect(store.state.variant).toMatch('')
        done()
      })
      expect(Mqtt.prototype.subscribeCmd).not.toHaveBeenCalled()
      expect(Mqtt.prototype.publishStateCmdexe).not.toHaveBeenCalled()
      expect(Mqtt.prototype.publishTokenInfoCmdexe).not.toHaveBeenCalled()
      expect.assertions(15)
    })

    it('publish state cmdexe when a send_state message arrived', (done) => {
      store.commit('updateConfig', {
        restEndpoint: '',
        restToken: '',
        restPrefix: '',
        mqttEndpoint,
        mqttUsername,
        mqttPassword,
        robotType,
        robotId: '',
        uiId
      })

      expect(store.state.robotState).toMatch('initial')
      expect(store.state.destination).toMatch('')
      expect(store.state.isInitialStateCalled).toBeFalsy()

      store.dispatch('connectAction', () => {
        expect(true).toBeTruthy()
        done()
      })

      expect(store.state.mqttClient).not.toBeNull()
      expect(Mqtt.prototype.connect).toHaveBeenCalledTimes(1)

      const connectCB = Mqtt.prototype.connect.mock.calls[0][0]
      connectCB()
      expect(Mqtt.prototype.subscribeCmd).toHaveBeenCalledTimes(1)
      expect(Mqtt.prototype.subscribeCmd.mock.calls[0][0]).toMatch('/' + robotType + '/' + uiId + '/cmd')

      const recvStateCB = Mqtt.prototype.subscribeCmd.mock.calls[0][1]
      const recvStateMessageState = 'recvState message: state'
      const recvStateMessageDestination = 'recvState message: destination'
      const recvStateMessage = {
        send_state: {
          state: recvStateMessageState,
          destination: recvStateMessageDestination,
        }
      }
      recvStateCB(recvStateMessage)
      expect(Mqtt.prototype.publishStateCmdexe).toHaveBeenCalledTimes(1)
      expect(Mqtt.prototype.publishStateCmdexe.mock.calls[0][0]).toMatch('/' + robotType + '/' + uiId + '/cmdexe')
      expect(Mqtt.prototype.publishStateCmdexe.mock.calls[0][1]).toMatchObject(recvStateMessage)
      expect(store.state.robotState).toMatch(recvStateMessageState)
      expect(store.state.destination).toMatch(recvStateMessageDestination)

      expect(Mqtt.prototype.publishTokenInfoCmdexe).not.toHaveBeenCalled()

      expect.assertions(14)
    })

    it('publish token_info cmdexe when a suspend message arrived', (done) => {
      store.commit('updateConfig', {
        restEndpoint: '',
        restToken: '',
        restPrefix: '',
        mqttEndpoint,
        mqttUsername,
        mqttPassword,
        robotType,
        robotId: '',
        uiId
      })

      expect(store.state.lockMessage).toBeNull()
      expect(store.state.lockUtterance).toMatch('')
      expect(store.state.isInitialStateCalled).toBeFalsy()

      store.dispatch('connectAction', () => {
        expect(true).toBeTruthy()
        done()
      })

      expect(store.state.mqttClient).not.toBeNull()
      expect(Mqtt.prototype.connect).toHaveBeenCalledTimes(1)

      const connectCB = Mqtt.prototype.connect.mock.calls[0][0]
      connectCB()
      expect(Mqtt.prototype.subscribeCmd).toHaveBeenCalledTimes(1)
      expect(Mqtt.prototype.subscribeCmd.mock.calls[0][0]).toMatch('/' + robotType + '/' + uiId + '/cmd')

      const recvTokenInfoCB = Mqtt.prototype.subscribeCmd.mock.calls[0][2]
      const recvTokenInfoMode = 'suspend'
      const recvTokenInfoLockOwnerId = 'lock owner id'
      const recvTokenInfoMessage = {
        send_token_info: {
          mode: recvTokenInfoMode,
          lock_owner_id: recvTokenInfoLockOwnerId,
        }
      }
      recvTokenInfoCB(recvTokenInfoMessage)
      expect(Mqtt.prototype.publishTokenInfoCmdexe).toHaveBeenCalledTimes(1)
      expect(Mqtt.prototype.publishTokenInfoCmdexe.mock.calls[0][0]).toMatch('/' + robotType + '/' + uiId + '/cmdexe')
      expect(Mqtt.prototype.publishTokenInfoCmdexe.mock.calls[0][1]).toMatchObject(recvTokenInfoMessage)
      expect(store.state.lockMessage).toMatch(recvTokenInfoLockOwnerId + 'が作業中のため')
      expect(store.state.lockUtterance).toMatch('他のロボットが作業中のため、一時待機します。')

      expect(Mqtt.prototype.publishStateCmdexe).not.toHaveBeenCalled()

      expect.assertions(14)
    })

    it('publish token_info cmdexe when a resume message arrived', (done) => {
      store.commit('updateConfig', {
        restEndpoint: '',
        restToken: '',
        restPrefix: '',
        mqttEndpoint,
        mqttUsername,
        mqttPassword,
        robotType,
        robotId: '',
        uiId
      })

      expect(store.state.lockMessage).toBeNull()
      expect(store.state.lockUtterance).toMatch('')
      expect(store.state.isInitialStateCalled).toBeFalsy()

      store.dispatch('connectAction', () => {
        expect(true).toBeTruthy()
        done()
      })

      expect(store.state.mqttClient).not.toBeNull()
      expect(Mqtt.prototype.connect).toHaveBeenCalledTimes(1)

      const connectCB = Mqtt.prototype.connect.mock.calls[0][0]
      connectCB()
      expect(Mqtt.prototype.subscribeCmd).toHaveBeenCalledTimes(1)
      expect(Mqtt.prototype.subscribeCmd.mock.calls[0][0]).toMatch('/' + robotType + '/' + uiId + '/cmd')

      const recvTokenInfoCB = Mqtt.prototype.subscribeCmd.mock.calls[0][2]
      const recvTokenInfoMode = 'resume'
      const recvTokenInfoLockOwnerId = 'lock owner id'
      const recvTokenInfoMessage = {
        send_token_info: {
          mode: recvTokenInfoMode,
          lock_owner_id: recvTokenInfoLockOwnerId,
        }
      }
      recvTokenInfoCB(recvTokenInfoMessage)
      expect(Mqtt.prototype.publishTokenInfoCmdexe).toHaveBeenCalledTimes(1)
      expect(Mqtt.prototype.publishTokenInfoCmdexe.mock.calls[0][0]).toMatch('/' + robotType + '/' + uiId + '/cmdexe')
      expect(Mqtt.prototype.publishTokenInfoCmdexe.mock.calls[0][1]).toMatchObject(recvTokenInfoMessage)
      expect(store.state.lockMessage).toBeNull()
      expect(store.state.lockUtterance).toMatch('他のロボットの作業が完了しました。移動を再開します。')

      expect(Mqtt.prototype.publishStateCmdexe).not.toHaveBeenCalled()

      expect.assertions(14)
    })

    it('publish token_info cmdexe when another message arrived', (done) => {
      store.commit('updateConfig', {
        restEndpoint: '',
        restToken: '',
        restPrefix: '',
        mqttEndpoint,
        mqttUsername,
        mqttPassword,
        robotType,
        robotId: '',
        uiId
      })

      expect(store.state.lockMessage).toBeNull()
      expect(store.state.lockUtterance).toMatch('')
      expect(store.state.isInitialStateCalled).toBeFalsy()

      store.dispatch('connectAction', () => {
        expect(true).toBeTruthy()
        done()
      })

      expect(store.state.mqttClient).not.toBeNull()
      expect(Mqtt.prototype.connect).toHaveBeenCalledTimes(1)

      const connectCB = Mqtt.prototype.connect.mock.calls[0][0]
      connectCB()
      expect(Mqtt.prototype.subscribeCmd).toHaveBeenCalledTimes(1)
      expect(Mqtt.prototype.subscribeCmd.mock.calls[0][0]).toMatch('/' + robotType + '/' + uiId + '/cmd')

      const recvTokenInfoCB = Mqtt.prototype.subscribeCmd.mock.calls[0][2]
      const recvTokenInfoMode = 'other'
      const recvTokenInfoLockOwnerId = 'lock owner id'
      const recvTokenInfoMessage = {
        send_token_info: {
          mode: recvTokenInfoMode,
          lock_owner_id: recvTokenInfoLockOwnerId,
        }
      }
      recvTokenInfoCB(recvTokenInfoMessage)
      expect(Mqtt.prototype.publishTokenInfoCmdexe).toHaveBeenCalledTimes(1)
      expect(Mqtt.prototype.publishTokenInfoCmdexe.mock.calls[0][0]).toMatch('/' + robotType + '/' + uiId + '/cmdexe')
      expect(Mqtt.prototype.publishTokenInfoCmdexe.mock.calls[0][1]).toMatchObject(recvTokenInfoMessage)
      expect(store.state.lockMessage).toBeNull()
      expect(store.state.lockUtterance).toMatch('')

      expect(Mqtt.prototype.publishStateCmdexe).not.toHaveBeenCalled()

      expect.assertions(14)
    })
  })

  describe('disconnectAction', () => {
    const robotState = 'action robotState'
    const destination = 'action destination'
    const mqttClient = {
      disconnect: jest.fn()
    }

    beforeEach(() => {
      store.commit('setMQTTClient', mqttClient)
      store.commit('updateRobotState', {robotState, destination})
    })

    afterEach(() => {
      mqttClient.disconnect.mockClear()
    })

    it('update some states when mqttClient.disconnect returns true', () => {
      mqttClient.disconnect.mockReturnValue(true)

      store.dispatch('disconnectAction')

      expect(store.state.robotState).toMatch('initial')
      expect(store.state.destination).toBeUndefined()
      expect(store.state.mqttClient).toBeNull()
    })

    it('does nothing when mqttClient.disconnect returns false', () => {
      mqttClient.disconnect.mockReturnValue(false)

      store.dispatch('disconnectAction')

      expect(store.state.robotState).toMatch(robotState)
      expect(store.state.destination).toMatch(destination)
      expect(store.state.mqttClient).not.toBeNull()
    })
  })
})

describe('getter', () => {
  const message = 'getter message'
  const variant = 'getter variant'

  afterEach(() => {
    store.commit('clear')
  })

  describe('message', () => {
    store.commit('updateMessage', {message, variant})
    expect(store.getters.message).toMatch(message)
  })

  describe('variant', () => {
    store.commit('updateMessage', {message, variant})
    expect(store.getters.variant).toMatch(variant)
  })
})
