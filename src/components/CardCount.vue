<template>
	<div class="card text-center h-100">
		<h1>{{ count }}</h1>
		<p>{{ modelName.ModelName }}</p>
	</div>
</template>

<script>

export default {
	name: 'CardCount',
	props: {
		count: Number,
		model: Number
	},
	data() {
		return {
			modelName: ""
		}
	},
	async created() {
		this.modelName = await this.getModelName()
	},
	methods: {
		getModelName: async function () {
			let params = {
				collection: "Model",
				item: this.model,
				fields: "?fields=ModelName",
				filter: "",
				sort: null,
				limit: ""
			}
			return await this.$store.dispatch("getElement", params)
		}
	},
}
</script>

<style scoped>
.card {
	border-radius: 0px;
	border: 5px solid #bb0000;
	padding: 8px 16px 8px 16px;
}

g h1 {
	color: #bb0000;
	font-size: 5em;
	font-weight: 600;
}
</style>
