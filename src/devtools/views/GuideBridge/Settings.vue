<template>
  <Card class="p-m-2">
    <template #header> </template>
    <template #title>
      AF Debug Mode
    </template>
    <template #content>
      Enable AF Debug mode
    </template>
    <template #footer>
      <Button
        icon="pi pi-check"
        label="Critical"
        @click="reloadPageWithSettings('a1-b1-c1-d1')"
      />
      <Button
        icon="pi pi-check"
        label="Error"
        style="margin-left: .5em"
        @click="reloadPageWithSettings('a2-b2-c2-d2')"
      />
      <Button
        icon="pi pi-check"
        label="Warn"
        style="margin-left: .5em"
        @click="reloadPageWithSettings('a3-b3-c3-d3')"
      />
      <Button
        icon="pi pi-check"
        label="Info"
        style="margin-left: .5em"
        @click="reloadPageWithSettings('a4-b4-c4-d4')"
      />
    </template>
  </Card>
  <Card class="p-m-2">
    <template #header> </template>
    <template #title>
      Set a wcmmode disabled cookie
    </template>
    <template #content>
      If you have an wcmmode cookie set. Then you don't need a ?wcmmode=disabled
      parameter and in a case of a redirect. You won't loose the disabled state.
    </template>
    <template #footer>
      <Button icon="pi pi-check" label="Set" @click="setWcmmodeCookie()" />
      <Button
        icon="pi pi-times"
        class="p-button-danger"
        label="Remove"
        style="margin-left: .5em"
        @click="removeWcmmodeCookie()"
      />
    </template>
  </Card>
  <Toast> </Toast>
</template>

<script>
import Card from "primevue/card";
import Button from "primevue/button";
import Toast from "primevue/toast";

import { chromeEvalPromise } from "../../helper";

export default {
  components: {
    Card,
    Button,
    Toast,
  },
  data() {
    return {};
  },
  methods: {
    reloadPageWithSettings(logLevel) {
      chromeEvalPromise(`
        const url = new URL(window.location.href);
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set('wcmmode', 'disabled')
        urlParams.set('logConfig', '${logLevel}');
        url.search = urlParams

        window.location.href = url
      `);
    },
    setWcmmodeCookie() {
      chromeEvalPromise(`
        document.cookie = "wcmmode=disabled";
      `);
      this.$toast.add({
        severity: "success",
        summary: "Cookie Set!",
        life: 3000,
      });
    },
    removeWcmmodeCookie() {
      chromeEvalPromise(`
        document.cookie = "wcmmode=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
      `);
      this.$toast.add({
        severity: "warn",
        summary: "Cookie Removed!",
        life: 3000,
      });
    },
  },
};
</script>

<style></style>
