import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import { loadFonts } from "./plugins/webfontloader";
import "./assets/tailwind.css";

import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import '@mathieustan/vue-datepicker/dist/vue-datepicker.min.css';
loadFonts();

createApp(App)
  .use(router)
  .use(store)
  .use(vuetify)
  .component("VueDatePicker", VueDatePicker)
  .mount("#app");
