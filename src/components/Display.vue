<template>
  <canvas ref="canvas" width="100%" height="100%"/>
</template>

<style scoped>
canvas {
  background: black;
}
</style>

<script>
  export default {
    data: () => ({
      palette: [
        '#000000', '#ffffff', '#880000', '#aaffee',
        '#cc44cc', '#00cc55', '#0000aa', '#eeee77',
        '#dd8855', '#664400', '#ff7777', '#333333',
        '#777777', '#aaff66', '#0088ff', '#bbbbbb'
      ]
    }),

    mounted() {
      this.canvas = this.$refs.canvas;
      this.canvas.width = this.canvas.height = 512;
      this.context = this.canvas.getContext('2d');
    },

    methods: {
      update(memory) {
        for (let y = 0; y < 32; y++) {
          for (let x = 0; x < 32; x++) {
            const addr = (y << 5) + x;
            this.setAddrPixel(addr, this.palette[memory[addr + 0x200] & 0x0f]);
          }
        }
      },

      setPixel(x, y, color) {
        this.context.fillStyle = color;
        this.context.fillRect(x * 16, y * 16, 16, 16);
      },

      setAddrPixel(addr, color) {
        const y = Math.floor((addr) / 32);
        const x = (addr) % 32;
        this.setPixel(x, y, color);
      },

      setRawAddrPixel(addr, colorId) {
        this.setAddrPixel(addr, this.palette[colorId]);
      }
    }
  }
</script>
