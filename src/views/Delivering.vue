<template>
  <div class="delivering">
    <Header/>
    <div class="display">
      <span class="display-4">出荷先: {{ destination }}</span>
    </div>
    <hr/>
    <div>
      <h3>{{ msg }}</h3>
      <div class="row">
        <div class="col-sm-6">
          <QRReader width="420" height="400" v-on:qrCodeDetectEvent="qrCodeDetected"/>
        </div>
        <div class="col-sm-6">
          <TouchButton
            buttonText="受取" height="400px" fontSize="150px" :buttonDisabled="buttonDisabled"
            v-on:clickEvent="moveNextAction"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import Header from '@/components/Header'
import TouchButton from '@/components/TouchButton'
import QRReader from '@/components/QRReader'

export default {
  name: 'delivering',
  data () {
    return {
      msg: 'あなたのQRコードをかざしてください',
      buttonDisabled: true,
    }
  },
  components: {
    Header,
    TouchButton,
    QRReader
  },
  computed: {
    ...mapState(['destination'])
  },
  methods: {
    ...mapActions(['moveNextAction']),
    qrCodeDetected (code) {
      console.log('detect QR code', code)
      this.buttonDisabled = false
      this.msg = '品物を受け取ったら、受取ボタンを押してください'
    },
  }
}
</script>
