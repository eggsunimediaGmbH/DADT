<template>
  <main>
    <TabMenu :model="items" />
    <router-view />
  </main>
</template>

<script>
/* eslint-disable no-unused-vars */
import TabMenu from "primevue/tabmenu";

export default {
  components: {
    TabMenu,
  },
  data() {
    return {
      active: 0,
      items: [
        {
          label: "Debugger",
          to: "/GuideBridge/Debugger",
        },
        {
          label: "GuideState",
          to: "/GuideBridge/GuideState",
        },
        {
          label: "Settings",
          to: "/GuideBridge/Settings",
        },
      ],
    };
  },
  mounted() {
    console.log(this.$router);
    if (this.$router.currentRoute.value.href === "#/GuideBridge") {
      this.$router.push("/GuideBridge/Debugger");
    }
  },
};
</script>

<style></style>
