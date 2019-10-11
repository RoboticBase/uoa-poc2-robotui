<template>
  <div class="delivering">
    <Header/>
    <div class="display">
      <span class="display-4">出荷先: {{ destination }}</span>
    </div>
    <TouchButton buttonText="受取完了" v-on:clickEvent="moveNextAction"/>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import Header from '@/components/Header'
import TouchButton from '@/components/TouchButton'

export default {
  name: 'delivering',
  components: {
    Header,
    TouchButton
  },
  computed: {
    ...mapState(['destination'])
  },
  methods: {
    ...mapActions(['moveNextAction'])
  }
}
</script>
