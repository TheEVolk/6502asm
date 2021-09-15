<template>
  <v-app>
    <v-app-bar
      app
      color="blue"
      dark
      dense
    >
      <h1 class="d-flex align-center">
        <v-icon large>mdi-chip</v-icon>
        6502 ASM
      </h1>

      <v-spacer></v-spacer>
      <About/>
      <Loader @load="v => $refs.editorPage.$refs.codeEditor.editor.setValue(v)"/>
      <v-btn @click="save" icon><v-icon>mdi-download</v-icon></v-btn>
      <v-btn @click="toggleState" text>
        {{this.state === 'player' ? 'Code editor' : 'Player'}}
      </v-btn>
    </v-app-bar>

    <v-main>
      <Player v-show="state === 'player'" :compiledCode="compiledCode"/>
      <Editor v-show="state === 'editor'" @compiled="compiled" ref="editorPage"/>
    </v-main>
  </v-app>
</template>

<script>
import Player from '@/components/Player.vue';
import Editor from '@/components/Editor.vue';
import Loader from '@/components/Loader.vue';
import About from '@/components/About.vue';

export default {
  components: {
    Player,
    Editor,
    Loader,
    About
  },

  data: () => ({
    compiledCode: null,
    state: 'player' // player/editor
  }),

  methods: {
    toggleState() {
      this.state = this.state === 'player' ? 'editor' : 'player';
    },
    compiled(compiledCode) {
      this.compiledCode = compiledCode;
    },
    save() {
      const text = `; From 6502 emulator (https://theevolk.github.io/6502asm)\n${this.$refs.editorPage.$refs.codeEditor.editor.getValue()}`;
      const blob = new Blob([text], { type: 'text/plain' });
      const a = document.createElement('a');
      a.download = `6502asm_${new Date().toISOString()}.asm`;
      a.href = URL.createObjectURL(blob);
      a.dataset.downloadurl = ['text/plain', a.download, a.href].join(':');
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(a.href), 1500);
    }
  }
};
</script>
