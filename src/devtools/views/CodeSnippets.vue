<template>
  <Splitter class="fill-height">
    <SplitterPanel :style="`height: ${scrollPanelHeight - 100}px`" :size="33">
      <Toolbar>
        <template #left>
          <Button @click="addSnippet" icon="pi pi-plus" class="mr-2" />
          <div class="fluid flex-grow-1">
            <InputText
              v-model="filters1['global'].value"
              class="mr-2"
              placeholder="Global Search"
              style="width: 100%"
            />
          </div>
        </template>
      </Toolbar>
      <DataTable
        responsiveLayout="scroll"
        selectionMode="single"
        :value="treeItems"
        v-model:selection="selectedSnippet"
        v-model:filters="filters1"
        :scrollable="true"
        :scrollHeight="`${scrollPanelHeight - 75}px`"
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
            icon="pi pi-play"
            class="mr-2"
            :disabled="selectedSnippet.data == undefined"
          />
          <Button
            @click="deleteSelected"
            label="Delete"
            icon="pi pi-trash"
            class="p-button-danger"
            :disabled="selectedSnippet.data == undefined"
          />
        </template>
      </Toolbar>
      <ScrollPanel
        class="custom"
        :style="`height: ${scrollPanelHeight - 100}px`"
      >
        <Panel
          v-if="selectedSnippet.data != undefined"
          class="m-1"
          style="width: 100%"
        >
          <template #header>
            <InputText
              v-model="selectedSnippet.label"
              class=""
              placeholder="Snippet Name"
              style="width: 100%"
            />
          </template>
          <prism-editor
            class="my-editor"
            v-model="selectedSnippet.data"
            :highlight="highlighter"
            line-numbers
          ></prism-editor>
        </Panel>
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
import { useStore } from "vuex";
import { chromeEvalPromise } from "../helper";

import InputText from "primevue/inputtext";
import Splitter from "primevue/splitter";
import SplitterPanel from "primevue/splitterpanel";
import ScrollPanel from "primevue/scrollpanel";
import DataTable from "primevue/datatable";
import { FilterMatchMode } from "primevue/api";
import Column from "primevue/column";
import Toolbar from "primevue/toolbar";
import Button from "primevue/button";
import Panel from "primevue/panel";

export default {
  components: {
    InputText,
    SplitterPanel,
    Splitter,
    DataTable,
    Column,
    Toolbar,
    Button,
    PrismEditor,
    ScrollPanel,
    Panel,
  },
  setup() {
    const store = useStore();
    const splitterPanelRef = ref(null);
    const scrollPanelHeight = ref(100);
    const selectedSnippet = ref({});
    const cutSnippet = ref(null);
    const filters1 = ref({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    var resizeObserver;
    const treeItems = ref(store.state.codeSnippets);

    watch(
      treeItems,
      () => {
        store.commit("setCodeSnippets", treeItems.value);
      },
      { deep: true }
    );

    const addSnippet = () => {
      treeItems.value.push({
        key: Date.now().toString(),
        label: "New Snippet",
        data: "// Your custom code here! \n// Have fun :D",
      });
    };

    const onResize = () => {
      scrollPanelHeight.value = splitterPanelRef.value.$el.scrollHeight;
    };

    onMounted(() => {
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
      chromeEvalPromise(selectedSnippet.value.data);
    };

    const deleteSelected = () => {
      const nodeToPop = treeItems.value.find((node) => {
        return node.key === selectedSnippet.value.key;
      });
      const nodeToPopIndex = treeItems.value.indexOf(nodeToPop);
      treeItems.value.splice(nodeToPopIndex, 1);
      selectedSnippet.value = {};
    };

    return {
      highlighter,
      treeItems,
      addSnippet,
      splitterPanelRef,
      scrollPanelHeight,
      runScript,
      selectedSnippet,
      cutSnippet,
      filters1,
      deleteSelected,
    };
  },
};
</script>

<style scoped>
::v-deep(.p-toolbar-group-left) {
  width: 100%;
}

.fill-height {
  position: absolute;
  top: 3.6rem;
  right: 0;
  left: 0;
  bottom: 5px;
}

.my-editor {
  height: unset;
}
</style>
