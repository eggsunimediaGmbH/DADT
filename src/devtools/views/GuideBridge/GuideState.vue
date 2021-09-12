<template>
  <div id="jedit"></div>
</template>

<script>
import { chromeEvalPromise } from "../../helper";
import { registerCallback, removeCallback } from "../../communicator";
import * as JSONEditor from "jsoneditor/dist/jsoneditor.min.js";
import "jsoneditor/dist/jsoneditor.min.css";

import { getGuideState } from "../../guideBridgeCommands";

export default {
  data() {
    return {
      data: {
        root: {},
      },
      editor: {},
      inter: undefined,
    };
  },
  mounted() {
    this.updateData();
    const container = document.getElementById("jedit");
    const options = { mode: "view" };
    this.editor = new JSONEditor(container, options);
    this.editor.update(this.data);
    this.inter = setInterval(this.updateData, 5000);
  },
  unmounted() {
    clearInterval(this.inter);
  },
  methods: {
    updateData() {
      chromeEvalPromise(getGuideState())
        .then()
        .catch((error) => console.error(error));

      let listener = registerCallback((msg) => {
        this.data.root = JSON.parse(msg.data);
        this.editor.update(this.data);
        removeCallback(listener);
      });
    },
  },
};
</script>

<style></style>
