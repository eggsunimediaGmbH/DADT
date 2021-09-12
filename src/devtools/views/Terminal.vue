<template>
  <Terminal
    welcomeMessage="Welcome to PrimeVue"
    prompt="primevue $"
    class="dark-demo-terminal"
    @keydown="keyHandler"
  />
</template>

<script>
import Terminal from "primevue/terminal";
import TerminalService from "primevue/terminalservice";
import { chromeEvalPromise } from "../helper.js";

export default {
  components: {
    Terminal,
  },
  data() {
    return { history: [], historyIndex: 0 };
  },
  methods: {
    commandHandler(text) {
      this.history.push(text);

      chromeEvalPromise(text)
        .then((value) => {
          TerminalService.emit("response", value);
        })
        .catch((error) => {
          TerminalService.emit("response", error.value);
        });
    },
    keyHandler(key) {
      if (key.code === "ArrowDown") {
        this.historyIndex = +1;
      } else if (key.code === "ArrowUp") {
        this.historyIndex = -1;
      } else if (key.code === "Enter") {
        this.historyIndex = this.history.length - 1;
      }
    },
  },
  mounted() {
    TerminalService.on("command", this.commandHandler);
  },
  beforeUnmount() {
    TerminalService.off("command", this.commandHandler);
  },
};
</script>

<style></style>
