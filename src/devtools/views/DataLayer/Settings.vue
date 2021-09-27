<template>
  <Card>
    <template #title>
      DataLayer Eval
    </template>

    <template #subtitle>
      JavaScript expression that will be executed in the iFrame.<br />
      The return value will be displayed in DataLayer View tab.
    </template>

    <template #content>
      <InputText type="text" v-model="value" style="width: 100%"></InputText>
    </template>
    <template #footer>
      <Button @click="save()">Save</Button>
    </template>
  </Card>
  <Toast> </Toast>
</template>

<script>
import Card from "primevue/card";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Toast from "primevue/toast";
import { useToast } from "primevue/usetoast";

import { ref } from "vue";
import { useStore } from "vuex";

export default {
  components: {
    Card,
    InputText,
    Button,
    Toast,
  },
  setup() {
    const store = useStore();
    const value = ref(store.state.dataLayerExpression);
    const toast = useToast();

    const save = () => {
      store.commit("setDataLayerExpression", value);
      toast.add({
        severity: "success",
        summary: "DataLayerExpression was saved!",
        life: 3000,
      });
    };

    return { value, save };
  },
};
</script>

<style></style>
