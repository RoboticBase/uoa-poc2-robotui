<template>
  <div class="initial">
    <div class="page-header">
      <h3>接続設定</h3>
    </div>
    <div class="form-group">
      <label for="restEndpoint" class="float-left">REST Endpoint</label>
      <input type="text" id="restEndpoint" class="form-control" placeholder="http(s)://xxx.xxx.xxx.xxx/" v-model="params.restEndpoint"/>
    </div>
    <div class="form-group">
      <label for="restToken" class="float-left">REST Token</label>
      <input type="password" id="restToken" class="form-control" placeholder="bearer token" v-model="params.restToken"/>
    </div>
    <div class="form-group">
      <label for="restPrefix" class="float-left">REST Prefix</label>
      <input type="text" id="restPrefix" class="form-control" placeholder="/controller" v-model="params.restPrefix"/>
    </div>
    <hr/>

    <div class="form-group">
      <label for="mqttEndpoint" class="float-left">MQTT over WebSocket Endpoint</label>
      <input type="text" id="mqttEndpoint" class="form-control" placeholder="ws(s)://xxx.xxx.xxx.xxx/ws" v-model="params.mqttEndpoint"/>
    </div>
    <div class="form-group">
      <label for="mqttUsername" class="float-left">MQTT Username</label>
      <input type="text" id="mqttUsername" class="form-control" placeholder="MQTT Username" v-model="params.mqttUsername"/>
    </div>
    <div class="form-group">
      <label for="mqttPassword" class="float-left">MQTT Password</label>
      <input type="password" id="mqttPassword" class="form-control" placeholder="MQTT Password" v-model="params.mqttPassword"/>
    </div>
    <hr/>

    <div class="form-group">
      <label for="robotType" class="float-left">Robot Type</label>
      <input type="text" id="robotType" class="form-control" placeholder="Robot Type" v-model="params.robotType"/>
    </div>
    <div class="form-group">
      <label for="robotId" class="float-left">Robot Id</label>
      <input type="text" id="robotId" class="form-control" placeholder="Robot Id" v-model="params.robotId"/>
    </div>
    <div class="form-group">
      <label for="uiId" class="float-left">UI Id</label>
      <input type="text" id="uiId" class="form-control" placeholder="UI Id" v-model="params.uiId"/>
    </div>
    <hr/>

    <div class="form-group">
      <b-form-group label="対象業務">
        <b-form-radio-group
          id="btn-radios"
          v-model="params.modelSelected"
          :options="options"
          buttons
          name="radios-btn-default"
        ></b-form-radio-group>
      </b-form-group>
    </div>
    <hr/>

    <div class="row form-group">
      <div class="col-sm-12">
        <div v-if="processing">
          <mark>接続処理中</mark>
        </div>
        <div v-else>
          <button class="btn btn-primary float-center" @click="connect">接続</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import speak from '@/speak'

export default {
  name: 'Initial',
  data () {
    return {
      params: {},
      options: [
        { text: '注文配送', value: 'order' },
        { text: '倉庫間移動', value: 'warehouse' }
      ],
      processing: false,
    }
  },
  beforeMount () {
    this.params.restEndpoint = this.$store.state.restEndpoint
    this.params.restToken = this.$store.state.restToken
    this.params.restPrefix = this.$store.state.restPrefix
    this.params.mqttEndpoint = this.$store.state.mqttEndpoint
    this.params.mqttUsername = this.$store.state.mqttUsername
    this.params.mqttPassword = this.$store.state.mqttPassword
    this.params.robotType = this.$store.state.robotType
    this.params.robotId = this.$store.state.robotId
    this.params.uiId = this.$store.state.uiId
    this.params.modelSelected = this.$store.state.modelSelected
  },
  methods: {
    ...mapActions(['saveAction', 'connectAction']),
    connect () {
      if (this.processing) return
      this.processing = true
      this.saveAction(this.params)
      speak('hack', 0) // iOSは一度ユーザーアクションで発話させておかないと、自動発話させることができない
      this.connectAction(() => {
        this.processing = false
      })
    },
  },
}
</script>

<style>
.page-header {
  padding-bottom: 9px;
  margin: 40px 0 20px;
  border-bottom: 1px solid #eee;
}
</style>
