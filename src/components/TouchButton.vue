<template>
  <div class="touchButton container">
    <div class="form-group">
      <button type="submit" class="btn btn-outline-secondary btn-block btn-lg touchButton" :style="styles"
        @click="click" ontouchstart="" :disabled="buttonDisabled">
        {{ buttonText }}
      </button>
    </div>
    <audio id="click_se" preload="auto" ref="click_se">
      <source src="/static/sounds/se_maoudamashii_system38.mp3" type="audio/mp3"/>
    </audio>
  </div>
</template>

<script>
export default {
  name: 'touchButton',
  props: ['buttonText', 'height', 'fontSize', 'buttonDisabled'],
  data () {
    return {
      processing: false,
    }
  },
  computed: {
    styles () {
      return {
        '--height': this.height,
        '--fontSize': this.fontSize,
      }
    },
  },
  methods: {
    click() {
      if (this.processing) return
      this.processing = true
      this.buttonDisabled = true
      let click_se = this.$refs.click_se
      if (typeof(click_se.currentTime) != 'undefined') {
        click_se.currentTime = 0
      }
      click_se.play()

      this.$emit('clickEvent', () => {
        this.processing = false
        this.buttonDisabled = false
      })
    },
  },
}
</script>

<style scoped>
.touchButton {
  --height: 400px;
  --fontSize: 200px;

  height: var(--height);
  font-weight: 700;
  font-size: var(--fontSize);
}
.touchButton:hover {
  color: #6c757d;
  border-color: #6c757d;
  background-color: #ffffff;
}
</style>
