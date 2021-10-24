<template>
  <nav>
    <Menubar :model="items">
      <template #end>
        <Dropdown
          v-model="selectedTheme"
          :options="themes"
          class="mr-2"
        ></Dropdown>
        <Button
          placeholder=""
          icon="pi pi-plus"
          type="Button"
          class="mr-2"
          @click="scale++"
          v-tooltip="'Scale Up'"
        ></Button>
        <Button
          placeholder=""
          icon="pi pi-circle-on"
          type="Button"
          class="mr-2"
          @click="scale = 16"
          v-tooltip="'Scale Reset'"
        ></Button>
        <Button
          placeholder=""
          icon="pi pi-minus"
          type="Button"
          class="mr-2"
          @click="scale--"
          v-tooltip="'Scale Down'"
        ></Button>
        <Button
          placeholder=""
          icon="pi pi-github"
          type="Button"
          class="mr-2"
          @click="goToRepo()"
        ></Button>
      </template>
    </Menubar>
  </nav>

  <main>
    <router-view />
  </main>
</template>

<script>
import { ref, watch, onMounted } from "vue";
import { useStore } from "vuex";
import Menubar from "primevue/menubar";
import Button from "primevue/button";
import Dropdown from "primevue/dropdown";
import Tooltip from "primevue/tooltip";

export default {
  components: {
    Menubar,
    Button,
    Dropdown,
  },
  directives: {
    tooltip: Tooltip,
  },
  setup() {
    const store = useStore();
    const selectedTheme = ref(store.state.selectedTheme);
    const themes = ref([
      "arya-green",
      "tailwind-light",
      "arya-blue",
      "arya-orange",
      "arya-purple",
      "bootstrap4-dark-blue",
      "bootstrap4-dark-purple",
      "bootstrap4-light-blue",
      "bootstrap4-light-purple",
      "fluent-light",
      "luna-amber",
      "luna-blue",
      "luna-green",
      "luna-pink",
      "md-dark-deeppurple",
      "md-light-deeppurple",
      "md-dark-indigo",
      "md-light-indigo",
      "mdc-dark-deeppurple",
      "mdc-light-deeppurple",
      "mdc-dark-indigo",
      "mdc-light-indigo",
      "nova",
      "nova-accent",
      "nova-alt",
      "nova-vue",
      "rhea",
      "saga-blue",
      "saga-green",
      "saga-orange",
      "saga-purple",
      "vela-blue",
      "vela-green",
      "vela-orange",
      "vela-purple",
    ]);
    const items = ref([
      {
        label: "GuideBridge",
        icon: "pi pi-fw pi-file",
        to: "/GuideBridge",
      },
      {
        label: "DataLayer",
        icon: "pi pi-fw pi-pencil",
        to: "/DataLayer",
      },
      // {
      //   label: "Terminal",
      //   icon: "pi pi-fw pi-desktop",
      //   to: "/Terminal",
      // },
      {
        label: "CodeSnippets",
        icon: "pi pi-fw pi-bookmark",
        to: "/CodeSnippets",
      },
    ]);
    const activeIndex = ref(0);
    const scale = ref(store.state.scale);
    const addScaleToWindow = (scale) => {
      document.getElementsByTagName("html")[0].style = `font-size:${scale}px`;
    };
    addScaleToWindow(scale.value);
    watch(scale, (count) => {
      store.commit("setScale", count);
      addScaleToWindow(count);
    });

    const goToRepo = () => {
      window.open("https://github.com/eggsunimediaGmbH/DADT");
    };

    // setup theme
    watch(selectedTheme, () => {
      store.commit("setTheme", selectedTheme.value);
      window.location.reload();
    });
    onMounted(() => {
      import(`primevue/resources/themes/${selectedTheme.value}/theme.css`);
    });
    return { items, activeIndex, scale, goToRepo, themes, selectedTheme };
  },
};
</script>

<style></style>
