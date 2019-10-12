<template>
  <div class="picking">
    <Header/>
    <div class="display">
      <span class="display-4">倉庫: {{ destination }}</span>
    </div>
    <hr/>
    <div>
      <h3>商品の積み込みが完了したら、積込完了ボタンを押してください</h3>
      <div class="row">
        <div class="col-sm-12">
          <TouchButton
            buttonText="積込完了" height="400px" fontSize="200px" :buttonDisabled="false"
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
import speak from '@/speak'

export default {
  name: 'moving',
  components: {
    Header,
    TouchButton,
  },
  computed: {
    ...mapState(['destination'])
  },
  mounted: function () {
    const utterance = this.destination + 'に到着しました。指定された品物を積み込んでください。'
    speak(utterance)
  },
  methods: {
    ...mapActions(['moveNextAction'])
  },
}
</script>
