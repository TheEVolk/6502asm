module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  outputDir: 'docs',
  publicPath: process.env.GH_PAGES === '1'
    ? '/6502asm/'
    : '/'
}
