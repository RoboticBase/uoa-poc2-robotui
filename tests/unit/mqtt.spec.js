import Mqtt from '@/mqtt'
import { before, after } from '@/../tests/vueCommon.js'
import { connect } from 'mqtt'
import EventEmitter from 'events'

jest.mock('mqtt')

beforeAll(before(jest))
afterAll(after())

const mqttEndpoint = 'ws://example.com:9001/ws'
const mqttUsername = 'test username'
const mqttPassword = 'test password'

describe('mqtt', () => {
  let client = null

  beforeEach(() => {
    client = new EventEmitter()
    client.subscribe = jest.fn()
    client.publish = jest.fn()
    client.end = jest.fn()
    connect.mockReturnValue(client)
  })

  afterEach(() => {
    connect.mockClear()
  })

  describe('constructor', () => {
    it('instantiates a new Mqtt instance', () => {
      const mqttClient = new Mqtt(mqttEndpoint, mqttUsername, mqttPassword)
      expect(mqttClient.mqttEndpoint).toEqual(mqttEndpoint)
      expect(mqttClient.mqttUsername).toEqual(mqttUsername)
      expect(mqttClient.mqttPassword).toEqual(mqttPassword)
      expect(mqttClient.client).toBeNull()
    })
  })

  describe('connect', () => {
    it('connects to MQTT broker and set some event listeners', (done) => {
      const mqttClient = new Mqtt(mqttEndpoint, mqttUsername, mqttPassword)
      mqttClient.connect(() => {
        expect(true).toBeTruthy()
        done()
      })
      expect(client.eventNames()).toContain('connect')
      expect(client.eventNames()).toContain('close')
      expect(client.eventNames()).toContain('end')
      expect(client.eventNames()).toHaveLength(3)
      expect(connect).toHaveBeenCalledTimes(1)
      expect(connect.mock.calls[0][0]).toMatch(mqttEndpoint)
      expect(connect.mock.calls[0][1]).toMatchObject({
        username: mqttUsername,
        password: mqttPassword,
      })

      client.emit('connect', {
        returnCode: 0
      })
      client.emit('close')
      client.emit('end')
      expect.assertions(8)
    })
  })

  describe('subscribeCmd' , () => {
    let mqttClient = null
    const mockConnectCB = jest.fn()
    const mockRecvStateCB = jest.fn()
    const mockRecvTokenInfoCB = jest.fn()
    const mqttTopic = 'test_mqttTopic'

    beforeEach(() => {
      mqttClient = new Mqtt(mqttEndpoint, mqttUsername, mqttPassword)
    })

    afterEach(() => {
      mockConnectCB.mockClear()
      mockRecvStateCB.mockClear()
      mockRecvTokenInfoCB.mockClear()
    })

    it('emits recvStateCB when received a send_state message from the target topic', () => {
      const payload = {
        send_state: {
          test: 'test'
        }
      }

      mqttClient.connect(mockConnectCB)
      mqttClient.subscribeCmd(mqttTopic, mockRecvStateCB, mockRecvTokenInfoCB)
      expect(client.eventNames()).toContain('connect')
      expect(client.eventNames()).toContain('close')
      expect(client.eventNames()).toContain('end')
      expect(client.eventNames()).toContain('message')
      expect(client.eventNames()).toHaveLength(4)
      expect(client.subscribe).toHaveBeenCalledTimes(1)
      expect(client.subscribe.mock.calls[0][0]).toMatch(mqttTopic)
      expect(client.subscribe.mock.calls[0][1]).toMatchObject({qos: 1})

      client.emit('message', mqttTopic, Buffer.from(JSON.stringify(payload)))
      expect(mockConnectCB).not.toHaveBeenCalled()
      expect(mockRecvStateCB).toHaveBeenCalledTimes(1)
      expect(mockRecvTokenInfoCB).not.toHaveBeenCalled()
      expect(mockRecvStateCB.mock.calls[0][0]).toMatchObject(payload)
    })

    it('emits recvTokenInfoCB when received a send_token_info message from the target topic', () => {
      const payload = {
        send_token_info: {
          test: 'test'
        }
      }

      mqttClient.connect(mockConnectCB)
      mqttClient.subscribeCmd(mqttTopic, mockRecvStateCB, mockRecvTokenInfoCB)
      expect(client.eventNames()).toContain('connect')
      expect(client.eventNames()).toContain('close')
      expect(client.eventNames()).toContain('end')
      expect(client.eventNames()).toContain('message')
      expect(client.eventNames()).toHaveLength(4)
      expect(client.subscribe).toHaveBeenCalledTimes(1)
      expect(client.subscribe.mock.calls[0][0]).toMatch(mqttTopic)
      expect(client.subscribe.mock.calls[0][1]).toMatchObject({qos: 1})

      client.emit('message', mqttTopic, Buffer.from(JSON.stringify(payload)))
      expect(mockConnectCB).not.toHaveBeenCalled()
      expect(mockRecvStateCB).not.toHaveBeenCalled()
      expect(mockRecvTokenInfoCB).toHaveBeenCalledTimes(1)
      expect(mockRecvTokenInfoCB.mock.calls[0][0]).toMatchObject(payload)
    })

    it('emits no callback when received an unknown message from the target topic', () => {
      const payload = {
        unknown: {
          test: 'test'
        }
      }

      mqttClient.connect(mockConnectCB)
      mqttClient.subscribeCmd(mqttTopic, mockRecvStateCB, mockRecvTokenInfoCB)
      expect(client.eventNames()).toContain('connect')
      expect(client.eventNames()).toContain('close')
      expect(client.eventNames()).toContain('end')
      expect(client.eventNames()).toContain('message')
      expect(client.eventNames()).toHaveLength(4)
      expect(client.subscribe).toHaveBeenCalledTimes(1)
      expect(client.subscribe.mock.calls[0][0]).toMatch(mqttTopic)
      expect(client.subscribe.mock.calls[0][1]).toMatchObject({qos: 1})

      client.emit('message', mqttTopic, Buffer.from(JSON.stringify(payload)))
      expect(mockConnectCB).not.toHaveBeenCalled()
      expect(mockRecvStateCB).not.toHaveBeenCalled()
      expect(mockRecvTokenInfoCB).not.toHaveBeenCalled()
    })

    it('emits no callback when received a known message from an unknown topic', () => {
      const payload = {
        send_state: {
          test: 'test'
        }
      }

      mqttClient.connect(mockConnectCB)
      mqttClient.subscribeCmd(mqttTopic, mockRecvStateCB, mockRecvTokenInfoCB)
      expect(client.eventNames()).toContain('connect')
      expect(client.eventNames()).toContain('close')
      expect(client.eventNames()).toContain('end')
      expect(client.eventNames()).toContain('message')
      expect(client.eventNames()).toHaveLength(4)
      expect(client.subscribe).toHaveBeenCalledTimes(1)
      expect(client.subscribe.mock.calls[0][0]).toMatch(mqttTopic)
      expect(client.subscribe.mock.calls[0][1]).toMatchObject({qos: 1})

      client.emit('message', 'unknown_topic', Buffer.from(JSON.stringify(payload)))
      expect(mockConnectCB).not.toHaveBeenCalled()
      expect(mockRecvStateCB).not.toHaveBeenCalled()
      expect(mockRecvTokenInfoCB).not.toHaveBeenCalled()
    })

    it('emits no callback when received an invalid json message from the target topic', () => {
      const payload = '{]'

      mqttClient.connect(mockConnectCB)
      mqttClient.subscribeCmd(mqttTopic, mockRecvStateCB, mockRecvTokenInfoCB)
      expect(client.eventNames()).toContain('connect')
      expect(client.eventNames()).toContain('close')
      expect(client.eventNames()).toContain('end')
      expect(client.eventNames()).toContain('message')
      expect(client.eventNames()).toHaveLength(4)
      expect(client.subscribe).toHaveBeenCalledTimes(1)
      expect(client.subscribe.mock.calls[0][0]).toMatch(mqttTopic)
      expect(client.subscribe.mock.calls[0][1]).toMatchObject({qos: 1})

      client.emit('message', mqttTopic, Buffer.from(JSON.stringify(payload)))
      expect(mockConnectCB).not.toHaveBeenCalled()
      expect(mockRecvStateCB).not.toHaveBeenCalled()
      expect(mockRecvTokenInfoCB).not.toHaveBeenCalled()
    })
  })

  describe('publish methods', () => {
    let mqttClient = null
    let mockDate = null
    const mockConnectCB = jest.fn()
    const receivedDate = new Date('2019-01-02T03:04:05.678Z')
    const testDate = new Date('2019-09-08T07:06:05.432Z')

    beforeEach(() => {
      mqttClient = new Mqtt(mqttEndpoint, mqttUsername, mqttPassword)
      mockDate = jest.spyOn(global, 'Date').mockImplementation(() => testDate)
    })

    afterEach(() => {
      mockDate.mockRestore()
      mockConnectCB.mockClear()
    })

    describe('publishStateCmdexe', () => {
      const time = receivedDate.toISOString()
      const state = 'test state'
      const destination = 'test destination'
      const topic = 'test_topic'

      it('sends a message to a topic', () => {
        const receivedMessage = {
          send_state: {time, state, destination}
        }
        mqttClient.connect(mockConnectCB)
        mqttClient.publishStateCmdexe(topic, receivedMessage)
        expect(mockConnectCB).not.toHaveBeenCalled()
        expect(client.publish).toHaveBeenCalledTimes(1)
        expect(client.publish.mock.calls[0][0]).toMatch(topic)
        expect(JSON.parse(client.publish.mock.calls[0][1])).toMatchObject({
          send_state: {
            time: testDate.toISOString(),
            received_time: receivedDate.toISOString(),
            received_state: state,
            received_destination: destination,
            result: 'ack',
            errors: [],
          }
        })
        expect(client.publish.mock.calls[0][2]).toMatchObject({qos: 1})
      })
    })

    describe('publishTokenInfoCmdexe', () => {
      const time = receivedDate.toISOString()
      const token = 'test token'
      const mode = 'test mode'
      const lock_owner_id = 'test lock_owner_id'
      const prev_owner_id = 'test prev_owner_id'
      const topic = 'test_topic'

      it('sends a message to a topic', () => {
        const receivedMessage = {
          send_token_info: {time, token, mode, lock_owner_id, prev_owner_id}
        }
        mqttClient.connect(mockConnectCB)
        mqttClient.publishTokenInfoCmdexe(topic, receivedMessage)
        expect(mockConnectCB).not.toHaveBeenCalled()
        expect(client.publish).toHaveBeenCalledTimes(1)
        expect(client.publish.mock.calls[0][0]).toMatch(topic)
        expect(JSON.parse(client.publish.mock.calls[0][1])).toMatchObject({
          send_token_info: {
            time: testDate.toISOString(),
            received_time: receivedDate.toISOString(),
            received_token: token,
            received_mode: mode,
            received_lock_owner_id: lock_owner_id,
            received_prev_owner_id: prev_owner_id,
            result: 'ack',
            errors: [],
          }
        })
        expect(client.publish.mock.calls[0][2]).toMatchObject({qos: 1})
      })
    })
  })

  describe('disconnect', () => {
    let mqttClient = null
    const mockConnectCB = jest.fn()

    beforeEach(() => {
      mqttClient = new Mqtt(mqttEndpoint, mqttUsername, mqttPassword)
    })

    afterEach(() => {
      mockConnectCB.mockClear()
    })

    it('terminates mqtt client when client.connected is true', () => {
      client.connected = true

      expect(mqttClient.client).toBeNull()

      mqttClient.connect(mockConnectCB)

      expect(mqttClient.client).not.toBeNull()

      const result = mqttClient.disconnect()

      expect(client.end).toHaveBeenCalledTimes(1)
      expect(client.end.mock.calls[0]).toHaveLength(0)
      expect(mqttClient.client).toBeNull()
      expect(result).toBeTruthy()
    })

    it('does not terminate mqtt client when client.connected is false', () => {
      client.connected = false

      expect(mqttClient.client).toBeNull()

      mqttClient.connect(mockConnectCB)

      expect(mqttClient.client).not.toBeNull()

      const result = mqttClient.disconnect()

      expect(client.end).not.toHaveBeenCalled()
      expect(mqttClient.client).not.toBeNull()
      expect(result).toBeFalsy()
    })
  })
})
