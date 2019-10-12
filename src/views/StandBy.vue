<template>
  <div class="standby">
    <Header/>
    <div class="display">
      <span class="display-1">待機中</span>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Header from '@/components/Header'
import speak from '@/speak'

export default {
  name: 'standby',
  components: {
    Header
  },
  computed: {
    ...mapState(['destination'])
  },
  mounted: function () {
    const utterance = this.destination + 'に到着しました。待機します。'
    speak(utterance)
  },
}
</script>
