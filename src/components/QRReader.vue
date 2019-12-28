<template>
  <div class="qrreader container">
    <video id="video" muted="true" :width="width" :height="height" ref="video" autoplay playsinline></video>
    <canvas id="canvas" :width="width" :height="height" ref="canvas"></canvas>
  </div>
</template>

<script>
export default {
  name: 'qrreader',
  props: ['width', 'height'],
  data () {
    return {
      timer: null,
    }
  },
  mounted: async function () {
    const video = this.$refs.video
    const canvas = this.$refs.canvas
    const ctx = canvas.getContext("2d")

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        width: this.width,
        height: this.height,
        facingMode: "user"
      }
    }).catch(printerr)

    video.srcObject = stream
    video.onloadedmetadata = this.onloadedmetadata(video, canvas, ctx)
  },
  beforeDestroy: function () {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
  },
  methods: {
    onloadedmetadata: function (video, canvas, ctx) {
      const jsQR = require('jsqr')
      return () => {
        video.play()
        this.timer = setInterval(() => {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
          const code = jsQR(imageData.data, imageData.width, imageData.height)
          if (code) {
            drawLine(ctx, code.location)
            canvas.style.display = 'block'
            video.style.display = 'none'
            video.pause()

            this.$emit('qrCodeDetectEvent', code)
            if (this.timer) {
              clearInterval(this.timer)
              this.timer = null
            }
          }
        }, 500)
      }
    },
  }
}

function drawLine (ctx, pos, options={color:"blue", size:5}) {
  ctx.strokeStyle = options.color
  ctx.lineWidth   = options.size

  ctx.beginPath()
  ctx.moveTo(pos.topLeftCorner.x, pos.topLeftCorner.y)
  ctx.lineTo(pos.topRightCorner.x, pos.topRightCorner.y)
  ctx.lineTo(pos.bottomRightCorner.x, pos.bottomRightCorner.y)
  ctx.lineTo(pos.bottomLeftCorner.x, pos.bottomLeftCorner.y)
  ctx.lineTo(pos.topLeftCorner.x, pos.topLeftCorner.y)
  ctx.stroke()
}

function printerr (err) {
  // eslint-disable-next-line
  console.log(err.name + ": " + err.message)
}
</script>

<style scoped>
#video {
  margin-left: auto;
  margin-right: auto;
}
#canvas {
  display: none;
  margin-left: auto;
  margin-right: auto;
}
</style>
