<template>
  <div class="moving">
    <Header/>
    <div class="display">
      <span class="display-1">移動中</span>
    </div>
    <div class="destination">
      <span class="display-4">移動先：{{ destination }}</span>
    </div>
    <div class="lock" v-if="lockMessage">
      <br/>
      <hr/>
      <span class="display-4">{{ lockMessage.msg }}</span>
      <br/>
      <span class="display-4">({{ lockMessage.description }})</span>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Header from '@/components/Header'
import speak from '@/speak'

export default {
  name: 'moving',
  components: {
    Header,
  },
  computed: {
    ...mapState(['destination', 'lockMessage'])
  },
  mounted: function () {
    this.$store.subscribe((mutation, state) => {
      if (mutation.type === 'updateLockState') {
        speak(state.lockUtterance)
      }
    })
    const utterance = this.destination + 'へ移動します。'
    speak(utterance)
  },
}
</script>
