<template>
<v-dialog width="500" v-model="dialog">
  <template v-slot:activator="{ on, attrs }">
    <v-btn icon v-bind="attrs" v-on="on"><v-icon>mdi-playlist-star</v-icon></v-btn>
  </template>

  <v-card>
    <v-card-title>Examples</v-card-title>
    <v-card-subtitle>Most of the examples are taken from http://6502asm.com/</v-card-subtitle>
    <v-card-text>
      <v-list>
        <v-list-item v-for="item in items" :key="item.name" @click="() => load(item.file)" two-line>
          <v-list-item-content>
            <v-list-item-title>{{item.name}}</v-list-item-title>
            <v-list-item-subtitle>{{item.description}}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-card-text>
    <v-card-actions>
      <v-btn color="primary" target="_blank" href="https://github.com/TheEVolk/6502asm/issues/new">Add my example</v-btn>
    </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script>
export default {
  data: () => ({
    dialog: false,
    items: []
  }),

  async mounted() {
    this.items = await fetch('examples/list.json').then(v => v.json());
  },

  methods: {
    async load(file) {
      this.dialog = false;
      this.$emit('load', '; Loading...');
      this.$emit('load', await fetch(`examples/${file}`).then(v => v.text()));
    }
  }
}
</script>