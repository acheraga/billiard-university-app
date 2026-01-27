import { createPinia } from "pinia";
import { createApp } from "vue";
import App from "./App.vue";
import "./assets/styles/main.css";
import { useExamsStore } from "./store/useExamsStore";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
// Load persisted state (if any) so UI remains as the user left it across page reloads
const store = useExamsStore();
store.loadFromLocalStorage();

app.mount("#app");
