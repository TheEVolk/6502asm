class Display {
  constructor(elementId) {
    this.canvas = document.getElementById(elementId);
    this.canvas.width = this.canvas.height = 512;
		this.context = this.canvas.getContext('2d');
  }

  setPixel(x, y, color) {
    this.context.fillStyle = color;
    this.context.fillRect(x * 16, y * 16, 16, 16);
  }

  setAddrPixel(addr, color) {
    const y = Math.floor((addr) / 32);
    const x = (addr) % 32;
    this.setPixel(x, y, color);
  }
}

const display = new Display('canvas');