<template>
  <Splitter class="fill-height">
    <SplitterPanel :style="`height: ${scrollPanelHeight - 200}px`" :size="33">
      <Toolbar>
        <template #left>
          <Button
            @click="addSnippet"
            label="Add Snippet"
            icon="pi pi-plus"
            class="mr-2"
          />
          <Button
            @click="upSnippet"
            label="Up"
            icon="pi pi-plus"
            class="mr-2"
          />
          <Button
            @click="downSnippet"
            label="Down"
            icon="pi pi-plus"
            class="mr-2"
          />
        </template>
      </Toolbar>
      <DataTable
        :value="treeItems"
        responsiveLayout="scroll"
        v-model:selection="selectedSnippet"
        selectionMode="single"
        :scrollHeight="`${scrollPanelHeight-90}px`"
      >
        <Column field="label" header="Name"></Column>
      </DataTable>
    </SplitterPanel>
    <SplitterPanel ref="splitterPanelRef">
      <Toolbar>
        <template #left>
          <Button
            @click="runScript"
            label="Run"
            icon="pi pi-plus"
            class="mr-2"
          />
          <Button label="Delete" icon="pi pi-upload" class="p-button-success" />
        </template>
      </Toolbar>
      <ScrollPanel
        class="custom"
        :style="`height: ${scrollPanelHeight - 100}px`"
      >
        <prism-editor
          class="my-editor"
          v-model="code"
          :highlight="highlighter"
          line-numbers
        ></prism-editor>
      </ScrollPanel>
    </SplitterPanel>
  </Splitter>
</template>

<script>
/* eslint-disable vue/no-unused-components */
import { PrismEditor } from "vue-prism-editor";
import { highlight, languages } from "prismjs/prism";
import "vue-prism-editor/dist/prismeditor.min.css";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism-tomorrow.css";
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import { chromeEvalPromise } from "../helper";

import Splitter from "primevue/splitter";
import SplitterPanel from "primevue/splitterpanel";
import ScrollPanel from "primevue/scrollpanel";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Toolbar from "primevue/toolbar";
import Button from "primevue/button";

export default {
  components: {
    SplitterPanel,
    Splitter,
    DataTable,
    Column,
    Toolbar,
    Button,
    PrismEditor,
    ScrollPanel,
  },
  setup() {
    const code = ref("console.log('test');");
    const splitterPanelRef = ref(null);
    const scrollPanelHeight = ref(100);
    const selectedSnippet = ref({});
    const cutSnippet = ref(null);
    var resizeObserver;
    const treeItems = ref([
      {
        key: "0",
        label: "root",
        data: { folder: true },
        icon: "pi pi-fw pi-inbox",
      },
      {
        key: "1",
        label: "Test",
        data: "console.log('test')",
        icon: "pi pi-fw pi-inbox",
        children: [],
      },
      {
        key: "2",
        label: "Test",
        data: "console.log('tes111t')",
        icon: "pi pi-fw pi-inbox",
      },
    ]);

    watch(selectedSnippet, (snippet) => {
      if (typeof snippet.data === "string") {
        code.value = snippet.data;
      }
    });

    const addSnippet = () => {
      treeItems.value.push({
        key: Date.now().toString(),
        label: "Test2",
        data: "console.log('test111')",
      });
    };

    const onResize = () => {
      scrollPanelHeight.value = splitterPanelRef.value.$el.scrollHeight;
    };

    onMounted(() => {
      console.log(splitterPanelRef.value);
      resizeObserver = new ResizeObserver(onResize);
      resizeObserver.observe(splitterPanelRef.value.$el);
    });
    onBeforeUnmount(() => {
      resizeObserver.unobserve(splitterPanelRef.value.$el);
    });

    const highlighter = (code) => {
      return highlight(code, languages.js);
    };

    const runScript = () => {
      console.log(code.value);
      chromeEvalPromise(code.value);
    };

    const onNodeSelect = (node) => {
      console.log(node);
      if (node.data?.folder !== true) {
        code.value = node.data;
      }
    };

    return {
      code,
      highlighter,
      treeItems,
      addSnippet,
      splitterPanelRef,
      scrollPanelHeight,
      runScript,
      selectedSnippet,
      onNodeSelect,
      cutSnippet,
    };
  },
};
</script>

<style>
.fill-height {
  position: absolute;
  top: 3.6rem;
  right: 0;
  left: 0;
  bottom: 5px;
}
.p-treenode-label {
  width: 90%;
  height: 2rem;
  display: flex;
  align-items: center;
}

.p-treenode-label > div {
  width: 100%;
  height: 100%;
  line-height: 2rem;
}
</style>
