<template>
  <div class="picking">
    <Header/>
    <div class="display">
      <span class="display-4">倉庫: {{ destination }}</span>
    </div>
    <TouchButton buttonText="積込完了" v-on:clickEvent="moveNextAction"/>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import Header from '@/components/Header'
import TouchButton from '@/components/TouchButton'

export default {
  name: 'moving',
  components: {
    Header,
    TouchButton
  },
  computed: {
    ...mapState(['destination'])
  },
  methods: {
    ...mapActions(['moveNextAction'])
  },
}
</script>
