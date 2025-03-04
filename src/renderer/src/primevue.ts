import { App } from "vue";

import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Card from "primevue/card";
import Dialog from "primevue/dialog";

export default function componentsPrimeVue(app: App<Element>) {
	app.component("Button", Button);
	app.component("InputText", InputText);
	app.component("Card", Card);
	app.component("Dialog", Dialog);
}
