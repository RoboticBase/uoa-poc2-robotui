<template>
  <div class="initial">
    <h3>接続設定</h3>
    <div class="form-group">
      <label for="endpoint" class="float-left">REST Endpoint</label>
      <input type="text" id="restEndpoint" class="form-control" placeholder="http(s)://xxx.xxx.xxx.xxx/" v-model="params.restEndpoint"/>
    </div>
    <div class="form-group">
      <label for="token" class="float-left">REST Token</label>
      <input type="password" id="restToken" class="form-control" placeholder="bearer token" v-model="params.restToken"/>
    </div>
    <div class="form-group">
      <label for="prefix" class="float-left">REST Prefix</label>
      <input type="text" id="restPrefix" class="form-control" placeholder="/controller" v-model="params.restPrefix"/>
    </div>
    <div class="form-group">
      <label for="robotId" class="float-left">Robot Id</label>
      <input type="text" id="robotId" class="form-control" placeholder="Robot Id" v-model="params.robotId"/>
    </div>
    <div class="row form-group">
      <div class="col-sm-12">
        <button class="btn btn-primary float-left" @click="connect">接続</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'Initial',
  data () {
    return {
      params: {}
    }
  },
  beforeMount () {
    this.params.restEndpoint = this.$store.state.restEndpoint
    this.params.restToken = this.$store.state.restToken
    this.params.restPrefix = this.$store.state.restPrefix
    this.params.robotId = this.$store.state.robotId
  },
  methods: {
    ...mapActions(['connectAction']),
    connect () {
      this.connectAction(this.params)
    },
  },
}
</script>
