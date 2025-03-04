import "./assets/main.css";
import "primevue/resources/themes/aura-dark-purple/theme.css";
// import "primevue/resources/themes/aura-light-purple/theme.css";

import { createApp } from "vue";
import App from "./App.vue";
import PrimeVue from "primevue/config";
import componentsPrimeVue from "./primevue";

const app = createApp(App).use(PrimeVue);

componentsPrimeVue(app);

app.mount("#app");
