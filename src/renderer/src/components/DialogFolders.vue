<script setup lang="ts">
import { defineProps, defineEmits } from "vue";

const emit = defineEmits(["update:visible", "confirm-delete"]);

const props = defineProps<{
	visible: boolean;
	folders: { name: string; path: string }[];
	deleting: boolean;
}>();
</script>

<template>
	<Dialog
		v-model:visible="props.visible"
		modal
		header="Pastas Encontradas"
		:style="{ width: '500px' }"
		:closable="!props.deleting"
		:dismissableMask="!props.deleting"
		@update:visible="emit('update:visible', $event)"
	>
		<div class="flex flex-col">
			<div v-for="folder in props.folders" :key="folder.path">
				<p class="text-sm text-gray-500 break-all">{{ folder.path }}</p>
			</div>
		</div>

		<template #footer>
			<Button label="Cancelar" class="p-button-text" @click="emit('update:visible', false)" :disabled="props.deleting"></Button>

			<Button
				label="Confirmar Exclusão"
				class="p-button-danger"
				@click="emit('confirm-delete')"
				:loading="props.deleting"
			></Button>
		</template>
	</Dialog>
</template>
