import { createApp } from "vue";
import PrimeVue from "primevue/config";
import ToastService from "primevue/toastservice";
import App from "./App.vue";
import router from "./router";
import store from "../store";
import "primevue/resources/themes/arya-green/theme.css";
import "primevue/resources/primevue.min.css";
import "primeflex/primeflex.css";
import "primeicons/primeicons.css";

createApp(App)
  .use(store)
  .use(router)
  .use(PrimeVue)
  .use(ToastService)
  .mount("#app");

// dev tool setup
// @ts-ignore
chrome.devtools.panels.create("DADT", null, "devtools.html", (panel) => {
  console.log(panel);
});
