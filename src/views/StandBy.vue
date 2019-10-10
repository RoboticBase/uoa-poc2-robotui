<template>
  <div class="standby">
    <Header/>
    <div class="display">
      <span class="display-1">待機中</span>
    </div>
  </div>
</template>

<script>
import Header from '@/components/Header'

export default {
  name: 'standby',
  components: {
    Header
  }
}
</script>
