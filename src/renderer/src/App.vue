<script setup lang="ts">
import { ref } from "vue";
import DialogFolders from "./components/DialogFolders.vue";

const showDialog = ref(false);
const showMessageDialog = ref(false);

const foundFolders = ref<{ name: string; path: string }[]>([]);
const rootPath = ref("");
const folderName = ref("");

const messageTitle = ref("");
const messageContent = ref("");

const loading = ref(false);
const deleting = ref(false);

const showMessage = (title: string, message: string) => {
	messageTitle.value = title;
	messageContent.value = message;
	showMessageDialog.value = true;
};

const clearForm = () => {
	rootPath.value = "";
	folderName.value = "";
	foundFolders.value = [];
};

const findFolders = async () => {
	if (!rootPath.value || !folderName.value) {
		showMessage("Erro", "Preencha os campos corretamente!");
		return;
	}

	loading.value = true;

	const folders = await window.electron.ipcRenderer.invoke("find-folders", rootPath.value, folderName.value);

	loading.value = false;

	if (folders.length > 0) {
		foundFolders.value = folders.map((path: string) => ({ name: folderName.value, path }));
		showDialog.value = true;
	} else {
		showMessage("Nenhuma Pasta Encontrada", `A pasta "${folderName.value}" não foi encontrada no caminho especificado.`);
	}
};

const confirmDelete = async () => {
	if (foundFolders.value.length === 0) return;

	deleting.value = true;

	const pathsToDelete = foundFolders.value.map((folder) => folder.path);
	const response = await window.electron.ipcRenderer.invoke("delete-folders", pathsToDelete);

	deleting.value = false;

	if (response.success) {
		showDialog.value = false;
		showMessage("Sucesso!", "Pastas excluídas com sucesso!");
		clearForm();
	} else {
		showMessage("Erro", "Falha ao excluir as pastas. Tente novamente.");
	}
};
</script>

<template>
	<div class="flex h-screen justify-center items-center">
		<Card class="w-full max-w-lg">
			<template #content>
				<h2 class="text-xl font-semibold mb-3 text-center">Folder Cleaner</h2>

				<div class="flex flex-col gap-3">
					<label class="font-medium">Caminho raiz</label>
					<InputText v-model="rootPath" placeholder="Digite o caminho raiz" />

					<label class="font-medium mt-3">Nome da pasta</label>
					<InputText v-model="folderName" placeholder="Digite o nome da pasta" />

					<Button label="Buscar Pastas" class="mt-5" @click="findFolders" :loading="loading"></Button>
				</div>
			</template>
		</Card>

		<DialogFolders v-model:visible="showDialog" :folders="foundFolders" @confirm-delete="confirmDelete" :deleting="deleting" />

		<Dialog v-model:visible="showMessageDialog" modal :header="messageTitle" :style="{ width: '400px' }">
			<div class="flex flex-col items-center">
				<p class="text-lg text-center font-medium">{{ messageContent }}</p>
			</div>
			<template #footer>
				<Button label="OK" class="p-button-primary" @click="showMessageDialog = false"></Button>
			</template>
		</Dialog>
	</div>
</template>
