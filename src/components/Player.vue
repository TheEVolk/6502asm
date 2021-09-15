<template>
<div style="height: 100%">
  <div style="position: absolute; width: 700px; height: 700px">
    <Display ref="display" style="width: 100%; height: 100%"/>
  </div>
  <v-container style="float: right; width: calc(100% - 700px)">
    <v-app-bar dark dense>
      <v-btn icon v-if="compiledCode && !this.player.codeRunning" @click="play"><v-icon>mdi-play</v-icon></v-btn>
      <v-btn icon v-if="this.player.codeRunning" @click="player.codeRunning = false"><v-icon>mdi-pause</v-icon></v-btn>
    </v-app-bar>
    <v-app-bar dark>
      <v-select label="Speed" dense v-model="speed" :items="[16, 32, 64, 128, 256, 512, 1024].map(v => ({ str: `x${v}`, value: v }))" item-text="str" item-value="value"/>
    </v-app-bar>
    <v-card>
      <v-card-title>Регистры</v-card-title>
      <v-card-text>
        <div>regPC: {{player.regPC}}</div>
        <div>regSP: {{player.regSP}}</div>
        <div></div>
        <div>regA: {{player.regA}}</div>
        <div>regX: {{player.regX}}</div>
        <div>regY: {{player.regY}}</div>
        <div>regP: {{player.regP}}</div>
      </v-card-text>
    </v-card>
  </v-container>
</div>
</template>

<script>
import Display from '@/components/Display.vue';
import ProcPlayer from '@/plugins/emulator/player/index.js';

export default {
  components: {
    Display
  },

  props: ['compiledCode'],

  data: () => ({
    speed: 128,
    player: new ProcPlayer()
  }),

  mounted () {
document.addEventListener( "keypress", e => {
	if( typeof window.event != "undefined" )
		e = window.event;
	if( e.type == "keypress" ) {
		this.player.memStoreByte( 0xff, e.which );
	}
}, true );
  },

  methods: {
    play() {
      this.player.display = this.$refs.display;
      this.player.setCode(this.compiledCode);
      this.player.codeRunning = true;
      this.$refs.display.update(this.player.memory);
      this.frame();
    },

    frame() {
      for (let i = 0; i < this.speed; i++) {
        if (!this.player.execute()) {
          break;
        }
      }
      
      // this.$refs.display.update(this.player.memory);
      if (this.player.codeRunning) {
        setTimeout(() => this.frame(), 1);
      }
    }
  }
};
</script>
