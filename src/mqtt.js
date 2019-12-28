import { connect } from 'mqtt'

export default class {
  constructor (mqttEndpoint, mqttUsername, mqttPassword) {
    this.mqttEndpoint = mqttEndpoint
    this.mqttUsername = mqttUsername
    this.mqttPassword = mqttPassword
    this.client = null
  }
  connect (cb) {
    this.client = connect(this.mqttEndpoint, {
      username: this.mqttUsername,
      password: this.mqttPassword,
    })
    this.client.on('connect', (result) => {
      // eslint-disable-next-line
      console.log('connected to MQTT over WebSocket, host=' + this.mqttEndpoint + ', result=' +  result.returnCode)
      cb()
    })
    this.client.on('close', () => {
      // eslint-disable-next-line
      console.log('close connection, host=' + this.mqttEndpoint)
    })
    this.client.on('end', () => {
      // eslint-disable-next-line
      console.log('end connection, host=' + this.mqttEndpoint)
    })
  }
  subscribeCmd (mqttTopic, recvStateCB, recvTokenInfoCB) {
    this.client.subscribe(mqttTopic, {qos: 1})
    this.client.on('message', (topic, message) => {
      // eslint-disable-next-line
      console.log('a message is notified, topic=' + topic + ', message=' + message.toString())
      if (mqttTopic == topic) {
        try {
          let payload = JSON.parse(message.toString())
          if ('send_state' in payload) {
            recvStateCB(payload)
          } else if ('send_token_info' in payload) {
            recvTokenInfoCB(payload)
          }
        } catch (err) {
          // eslint-disable-next-line
          console.error('message payload parse error ', err)
        }
      }
    })
  }
  publishStateCmdexe (mqttTopic, receivedMessage) {
    let payload = {
      send_state: {
        time: new Date().toISOString(),
        received_time: receivedMessage.send_state.time,
        received_state: receivedMessage.send_state.state,
        received_destination: receivedMessage.send_state.destination,
        result: "ack",
        errors: []
      }
    }
    this.client.publish(mqttTopic, JSON.stringify(payload), {qos: 1})
  }
  publishTokenInfoCmdexe (mqttTopic, receivedMessage) {
    let payload = {
      send_token_info: {
        time: new Date().toISOString(),
        received_time: receivedMessage.send_token_info.time,
        received_token: receivedMessage.send_token_info.token,
        received_mode: receivedMessage.send_token_info.mode,
        received_lock_owner_id: receivedMessage.send_token_info.lock_owner_id,
        received_prev_owner_id: receivedMessage.send_token_info.prev_owner_id,
        result: "ack",
        errors: []
      }
    }
    this.client.publish(mqttTopic, JSON.stringify(payload), {qos: 1})
  }
  disconnect () {
    if (!this.client.connected) return false
    this.client.end()
    this.client = null
    return true
  }
}
