<template>
<v-dialog width="500">
  <template v-slot:activator="{ on, attrs }">
    <v-btn icon v-bind="attrs" v-on="on"><v-icon>mdi-help</v-icon></v-btn>
  </template>

  <v-card>
    <v-card-title>About</v-card-title>
    <v-card-text>
      This is an improved 6502 processor emulator.
      <ul>
        <li>The ability to change the emulation speed</li>
        <li>80% refactored code</li>
        <li>Canvas for image output</li>
        <li>Convenient code editor (ace)</li>
        <li>Ability to save your code</li>
        <li>More detailed compilation errors</li>
        <li>Automatic compilation</li>
        <li>Automatic saving of the entered code</li>
      </ul>
      <h4>By TheEVolk</h4>
      <ul>
        <li>GitHub: <a target="_blank" href="https://github.com/TheEVolk/6502asm">TheEVolk/6502asm</a></li>
        <li>VK: <a target="_blank" href="https://vk.com/theevolk">@theevolk</a></li>
        <li>Telegram: <a target="_blank" href="https://t.me/theevolk">@theevolk</a></li>
        <li>Email: <a target="_blank" href="mailto:elektro-volk@yandex.ru">elektro-volk@yandex.ru</a></li>
        <li>Email 2: <a target="_blank" href="mailto:theevolk@vk.com">theevolk@vk.com</a></li>
      </ul>
    </v-card-text>
      </v-card>
    </v-dialog>
</template>
