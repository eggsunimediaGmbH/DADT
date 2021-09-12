<template>
  <prism-editor
    class="my-editor"
    v-model="codeComputed"
    :readonly="true"
    :highlight="highlighter"
    line-numbers
  >
  </prism-editor>
</template>

<script>
import jsbeautifier from "js-beautify";
import { PrismEditor } from "vue-prism-editor";
import "vue-prism-editor/dist/prismeditor.min.css";

import { highlight, languages } from "prismjs/prism";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism-tomorrow.css";

import { computed, toRefs } from "vue";

export default {
  name: "CodePreview",
  components: {
    PrismEditor,
  },
  props: {
    code: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const { code } = toRefs(props);
    const codeComputed = computed(() => {
      return formatJsAndTrim(code.value);
    });

    const highlighter = (code) => {
      return highlight(code, languages.js);
    };

    const formatJsAndTrim = (value) => {
      const regex = new RegExp(/(?<=eval\(")([\s\S]*)(?="\);)/gm);
      const values = regex.exec(value);
      if (values?.length > 0) {
        return jsbeautifier.js(values[0]);
      } else {
        return value || "";
      }
    };

    return { formatJsAndTrim, highlighter, codeComputed };
  },
};
</script>

<style></style>
