module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  publicPath: process.env.GH_PAGES === '1'
    ? '/6502asm/'
    : '/'
}
