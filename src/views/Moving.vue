<template>
  <div class="moving">
    <Header/>
    <div class="display">
      <span class="display-1" v-if="lockMessage">一時待機</span>
      <span class="display-1" v-else>移動中</span>
    </div>
    <div class="destination">
      <span class="display-4">移動先：{{ destination }}</span>
    </div>
    <div class="lockMessage" v-if="lockMessage">
      <br/>
      <hr/>
      <span class="display-4">{{ lockMessage }}</span>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Header from '@/components/Header'
import speak from '@/speak'

export default {
  name: 'moving',
  data: function () {
    return {
      unsubscribe: null
    }
  },
  components: {
    Header,
  },
  computed: {
    ...mapState(['destination', 'lockMessage'])
  },
  mounted: function () {
    this.unsubscribe = this.$store.subscribe((mutation, state) => {
      if (mutation.type === 'updateLockState') {
        speak(state.lockUtterance)
      }
    })
    const utterance = this.destination + 'へ移動します。'
    speak(utterance)
  },
  destroyed: function () {
    if (this.unsubscribe) {
      this.unsubscribe()
      this.unsubscribe = null
    }
  },
}
</script>
