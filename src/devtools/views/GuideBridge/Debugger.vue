<template>
  <TreeTable
    :value="nodes"
    :filters="filters1"
    :expandedKeys="expandedKeys"
    class="p-treetable-sm"
    style="margin-bottom: 2rem"
  >
    <template #header>
      <Toolbar>
        <template #left>
          <InputText
            v-model="filters1['global']"
            class="p-mr-2"
            placeholder="Global Search"
            size="50"
          />
          <Button
            type="button"
            class="p-mr-2"
            icon="pi pi-plus"
            label="Expand All"
            @click="expandAll"
          />
          <Button
            type="button"
            class="p-mr-2"
            icon="pi pi-minus"
            label="Collapse All"
            @click="collapseAll"
          />
        </template>

        <template #right>
          <Checkbox
            name="nodesOnlyWith"
            class="p-mr-2"
            value="nodesOnlyWith"
            v-model="nodesOnlyWith"
          />
          <label for="nodesOnlyWith">Show only nodes with Scripts</label>
        </template>
      </Toolbar>
    </template>

    <Column field="label" header="Name" :expander="true"> </Column>

    <Column field="resource" header="Sling Resource">
      <template #body="slotProps">
        <i :class="`pi ${getIcon(slotProps)} p-mr-1`"></i>
        {{ slotProps.node.data.resource }}
      </template>
    </Column>
    <Column headerStyle="width: 10em" field="scripts.length" header="Scripts">
      <template #body="slotProps">
        <div>
          {{ slotProps.node.data.scripts.length }}
          {{ getAllScriptNames(slotProps) }}
        </div>
      </template>
    </Column>
    <Column
      headerStyle="width: 10em"
      headerClass="p-text-center"
      bodyClass="p-text-center"
    >
      <template #header> </template>
      <template #body="slotProps">
        <Button
          type="button"
          icon="pi pi-map-marker"
          style="margin-right: .5em"
          @click="focusNode(slotProps.node.data)"
          v-tooltip.left="'Scroll to node and highlight it!'"
        ></Button>
        <template v-if="slotProps.node.data.visible !== undefined">
          <Button
            type="button"
            :icon="
              `pi ${slotProps.node.data.visible ? 'pi-eye' : 'pi-eye-slash'}`
            "
            class="p-button-success"
            style="margin-right: .5em"
            @click="toggleVisibility(slotProps.node.data)"
            v-tooltip.left="'Hide/Un-hide a node!'"
          ></Button>
        </template>
        <template v-if="slotProps.node.data.scripts.length > 0">
          <Button
            type="button"
            icon="pi pi-play"
            class="p-button-warning"
            style="margin-right: .5em"
            @click="
              display = !display;
              selectedNode = slotProps.node.data;
            "
            v-tooltip.left="'Open script debugger!'"
          ></Button>
        </template>
      </template>
    </Column>
  </TreeTable>

  <Dialog
    :showHeader="false"
    :width="'100vh'"
    v-model:visible="display"
    @show="updateSelectedCode(selectedNode.scripts[0])"
  >
    <TabView @tab-change="onTabViewChange">
      <TabPanel v-for="script in selectedNode.scripts" :key="script">
        <template #header>
          {{ getScriptName(script) }}
        </template>
        <Button
          type="button"
          @click="runExp(selectedNode.id, getScriptName(script))"
        >
          RUN AND DEBUG
        </Button>
        <CodePreview :code="selectedCode"></CodePreview>
      </TabPanel>
    </TabView>
    <template #footer>
      <Button class="p-button-danger" @click="display = !display">
        Close
      </Button>
    </template>
  </Dialog>
</template>

<script>
import TreeTable from "primevue/treetable";
import Column from "primevue/column";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Dialog from "primevue/dialog";
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import Checkbox from "primevue/checkbox";
import Toolbar from "primevue/toolbar";
import Tooltip from "primevue/tooltip";

import CodePreview from "@/components/CodePreview";
import { chromeEvalPromise } from "../../helper";
import { executeScript, highlightNode } from "../../guideBridgeCommands";

export default {
  components: {
    TreeTable,
    Column,
    Button,
    InputText,
    Dialog,
    TabView,
    TabPanel,
    Checkbox,
    Toolbar,
    CodePreview,
  },
  directives: {
    tooltip: Tooltip,
  },
  data() {
    return {
      display: false,
      selectedNode: {},
      selectedCode: "",
      expandedKeys: {
        "guideContainer-rootPanel__": true,
      },
      filters1: {},
      nodes: [],
      guideRootPanel: {},
      nodesOnlyWith: false,
    };
  },
  watch: {
    nodesOnlyWith(newValue) {
      if (newValue.length) {
        this.filters1["scripts.length"] = "1";
      } else {
        delete this.filters1["scripts.length"];
      }
    },
  },
  created() {},
  mounted() {
    this.setupData();
    chrome.devtools.network.onNavigated.addListener((requesturl) => {
      setTimeout(() => {
        this.setupData();
      }, 1000);
      console.log(requesturl);
    });
  },
  methods: {
    setupData() {
      this.nodes = [];
      chromeEvalPromise(`
      guidelib.runtime.guide.rootPanel.jsonModel
    `)
        .then((data) => {
          this.guideRootPanel = data;
          this.createTreeFromGuideRootPanelRecursive(
            this.guideRootPanel,
            this.nodes
          );
        })
        .catch((error) => {
          this.nodes = [
            {
              key: 0,
              data: {
                label: "No GuideBridge",
                id: 0,
                resource: "",
                visible: undefined,
                scripts: [],
              },
            },
          ];
          console.error(error);
        });
    },
    getIcon(slotProps) {
      const resource = slotProps.node.data.resource;

      switch (resource) {
        case "fd/af/components/rootPanel":
          return "pi-folder";
        case "fd/af/components/panel":
          return "pi-folder-open";
        case "fd/af/components/guidetextbox":
          return "pi-align-justify";
        case "fd/af/components/guidedropdownlist":
          return "pi-sort-down";

        default:
          return "pi-question";
      }
    },
    getAllScriptNames(slotProps) {
      return slotProps.node.data.scripts
        .map((e) => {
          return Object.getOwnPropertyNames(e)[0];
        })
        .join(", ");
    },
    runExp(compId, scriptName) {
      chromeEvalPromise(executeScript(compId, scriptName));
    },
    expandAll() {
      for (let node of this.nodes) {
        this.expandNode(node);
      }

      this.expandedKeys = { ...this.expandedKeys };
    },
    collapseAll() {
      this.expandedKeys = {};
    },
    expandNode(node) {
      if (node.children && node.children.length) {
        this.expandedKeys[node.key] = true;

        for (let child of node.children) {
          this.expandNode(child);
        }
      }
    },
    onTabViewChange(data) {
      this.updateSelectedCode(this.selectedNode.scripts[data.index]);
    },
    getScriptName(obj) {
      return Object.getOwnPropertyNames(obj)[0];
    },
    updateSelectedCode(code) {
      this.selectedCode = code[this.getScriptName(code)];
    },
    focusNode(node) {
      chromeEvalPromise(highlightNode(node.id));
    },
    toggleVisibility(node) {
      chromeEvalPromise(`
      guideBridge._resolveId('${node.id}').visible = ${!node.visible};

      `).then(() => {
        node.visible = !node.visible;
      });
    },
    createTreeFromGuideRootPanelRecursive(state, dataArray) {
      let keywords = [
        "calcExp",
        "validateExp",
        "optionsExp",
        "clickExp",
        "navigationChangeExp",
        "visibleExp",
        "enabledExp",
        "completionExp",
      ];

      let scripts = [];
      for (let exp in state) {
        if (keywords.includes(exp)) {
          scripts.push({ [exp]: state[exp] });
        }
      }

      let tmpObj = {
        key: state.templateId,
        data: {
          label: state.name,
          id: state.templateId,
          resource: state["sling:resourceType"],
          visible: state.visible,
          scripts,
        },
        children: [],
      };
      dataArray.push(tmpObj);

      if (state.items) {
        for (let item in state.items) {
          if (state.items[item]) {
            this.createTreeFromGuideRootPanelRecursive(
              state.items[item],
              tmpObj.children
            );
          }
        }
      }
    },
  },
};
</script>

<style></style>
