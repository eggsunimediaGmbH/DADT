<template>
  <TabMenu :model="items" />
   <router-view />
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
          label: "DataLayer View",
          to: "/DataLayer/DataLayerView",
        },
        {
          label: "Settings",
          to: "/DataLayer/DataLayerSettings",
        },
      ],
    };
  },
  mounted() {
    console.log(this.$router);
    if (this.$router.currentRoute.value.href === "#/DataLayer") {
      this.$router.push("/DataLayer/DataLayerView");
    }
  },
};
</script>

<style></style>
