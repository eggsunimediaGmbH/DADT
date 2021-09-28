<template>
  <nav>
    <Menubar :model="items">
      <template #end>
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
import { ref, watch } from "vue";
import { useStore } from "vuex";
import Menubar from "primevue/menubar";
import Button from "primevue/button";
import Tooltip from "primevue/tooltip";

export default {
  components: {
    Menubar,
    Button,
  },
  directives: {
    tooltip: Tooltip,
  },
  setup() {
    const store = useStore();
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

    return { items, activeIndex, scale, goToRepo };
  },
};
</script>

<style></style>
