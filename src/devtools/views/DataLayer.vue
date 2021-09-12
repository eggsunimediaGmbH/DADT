<template>
  <div id="jedit"></div>
</template>

<script>
import * as JSONEditor from "jsoneditor/dist/jsoneditor.min.js";
import "jsoneditor/dist/jsoneditor.min.css";
import { chromeEvalPromise } from "../helper";

export default {
  data() {
    return {
      editor: {},
      inter: undefined,
    };
  },
  mounted() {
    const container = document.getElementById("jedit");
    const options = { mode: "view" };
    this.editor = new JSONEditor(container, options);
    this.editor.update(this.dataLayer);
  },
  created() {
    this.inter = setInterval(async () => {
      chromeEvalPromise(
        "digital?.tracking?.getInstance(dataLayer)?.pageTrackingArr || dataLayer"
      )
        .then((data) => {
          this.editor.update(data.pages);
          this.dataLayer = data.pages;
        })
        .catch((error) => console.error(error));
    }, 200);
  },
  unmounted() {
    clearInterval(this.inter);
  },
};
</script>

<style></style>
