<template>
  <div class="touchButton container">
    <div class="form-group">
      <button type="submit" class="btn btn-outline-secondary btn-block btn-lg touchButton" :style="styles"
        @click="click" ontouchstart="" :disabled="buttonDisabled">
        {{ buttonText }}
      </button>
    </div>
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
