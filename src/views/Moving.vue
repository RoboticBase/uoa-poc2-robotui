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

export default {
  name: 'moving',
  computed: {
    ...mapState(['destination'])
  },
  components: {
    Header
  },
}
</script>
