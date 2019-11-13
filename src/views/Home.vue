<template>
  <div class="home container">
    <component v-bind:is="currentView"/>
    <Alert/>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Alert from '@/components/Alert'

export default {
  name: 'home',
  components: {
    Alert
  },
  computed: {
    ...mapState(['robotState']),
    currentView: function () {
      return this.robotState
    }
  }
}
</script>
