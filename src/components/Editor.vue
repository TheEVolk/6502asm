<template>
  <AceEditor @input="input" ref="codeEditor" lang="assembly_x86" theme="monokai"/>
</template>

<script>
import AceEditor from 'vue2-ace-editor';
import 'brace/mode/assembly_x86';
import 'brace/theme/monokai';

import Compiler from '@/plugins/emulator/compiler/index.js';

export default {
  components: { AceEditor },

  data: () => ({
    compiling: false,
    timer: null
  }),

  mounted() {
    this.$refs.codeEditor.editor.setValue(localStorage.value || '; Write your beautiful asm. Use tutorials: https://en.wikibooks.org/wiki/6502_Assembly');
  },

  methods: {
    input(value) {
      localStorage.value = value;

      if (this.timer) {
        clearTimeout(this.timer);
      }

      this.timer = setTimeout(() => this.compile(), 1500);
    },

    compile() {
      if (this.compiling) {
        return this.input();
      }

      this.compiling = true;
      const compiler = new Compiler();
      compiler.error = (row, text, stack = null) => {
        console.error(`<b>Синтаксическая ошибка (${row + 1}): ${text}</b>`);
        this.$refs.codeEditor.editor.gotoLine(row + 1, 0, true);
        this.$refs.codeEditor.editor.getSession().setAnnotations([{ type: 'error', text: stack || text, row }]);
      };

      const response = compiler.compile(this.$refs.codeEditor.editor.getValue());
      if (response) {
        this.$emit('compiled', {
          memory: compiler.memory,
          regPC: compiler.regPC,
          defaultCodePC: compiler.defaultCodePC
        });
      }

      this.compiling = false;
    }
  }
}
</script>