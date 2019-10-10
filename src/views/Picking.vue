<template>
  <div class="picking">
    <Header/>
    <div class="display">
      <span class="display-4">倉庫: {{ destination }}</span>
    </div>
    <div class="row form-group">
      <div class="col-sm-12 align-self-end">
        <button type="submit" class="btn btn-outline-secondary btn-block btn-lg complete-btn" ontouchstart="" @click="complete">積込完了</button>
      </div>
    </div>
    <audio id="click_se" preload="auto" ref="click_se">
      <source src="/static/sounds/se_maoudamashii_system38.mp3" type="audio/mp3"/>
    </audio>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import Header from '@/components/Header'

export default {
  name: 'moving',
  components: {
    Header
  },
  computed: {
    ...mapState(['destination'])
  },
  methods: {
    ...mapActions(['moveNextAction']),
    complete () {
      let click_se = this.$refs.click_se
      if (typeof(click_se.currentTime) != 'undefined') {
        click_se.currentTime = 0
      }
      click_se.play()
      this.moveNextAction()
    }
  },
}
</script>

<style>
.complete-btn {
  height: 300px;
  font-weight: 700;
  font-size: 6em;
}
.complete-btn:hover {
  color: #6c757d;
  border-color: #6c757d;
  background-color: #ffffff;
}
</style>
