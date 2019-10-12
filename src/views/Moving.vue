<template>
  <div class="moving">
    <Header/>
    <div class="display">
      <span class="display-1">移動中</span>
    </div>
    <div class="destination">
      <span class="display-4">移動先：{{ destination }}</span>
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
    ...mapState(['destination'])
  },
  mounted: function () {
    const utterance = this.destination + 'へ移動します。'
    speak(utterance)
  },
}
</script>
