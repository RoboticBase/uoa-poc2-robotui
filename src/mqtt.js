import { connect } from 'mqtt'

export default class {
  constructor (mqttEndpoint, mqttUsername, mqttPassword) {
    this.mqttEndpoint = mqttEndpoint
    this.mqttUsername = mqttUsername
    this.mqttPassword = mqttPassword
    this.client = null
  }
  subscribeCmd (mqttTopic, cb) {
    this.client = connect(this.mqttEndpoint, {
      username: this.mqttUsername,
      password: this.mqttPassword,
    })
    this.client.on('connect', (result) => {
      console.log('connected to MQTT over WebSocket, host=' + this.mqttEndpoint + ', result=' +  result.returnCode)
      this.client.subscribe(mqttTopic)
    })
    this.client.on('message', (topic, message) => {
      console.log('a message is notified, topic=' + topic + ', message=' + message.toString())
      if (mqttTopic == topic) {
        cb(JSON.parse(message.toString()))
      }
    })
  }
  publishCmdexe (mqttTopic, receivedMessage) {
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
    this.client.publish(mqttTopic, JSON.stringify(payload))
  }
}
