<template>
	<main>
		<h1 class="text-center">Tauler principal</h1>
		<section class="row">
			<div class="col-6 col-sm-4 col-md-2" v-for="option in options" :key="option">
				<router-link :to="{ path: option.router, params: { id: '2' } }">
					<CardButton :title="option.name" :icon="option.icon"></CardButton>
				</router-link>
			</div>
		</section>
		<section class="row my-2">
			<div class="col-6 col-sm-4 col-md-2 my-1" v-for="grouped in groupedElements" :key="grouped">
				<CardCount :count="grouped.count.SerialNum" :model="grouped.Model"></CardCount>
			</div>
		</section>
		<section class="row">
			<h5>Material en préstec pendent de retornar</h5>
			<EasyDataTable :headers="this.headers" :items="this.items" alternating buttons-pagination
				v-model:items-selected="itemsSelected" :sort-by="this.sortBy" :sort-type="this.sortType">
			</EasyDataTable>
			<router-link to="prestecs" class="btn btn-primary mt-2">Mostra tots els préstecs</router-link>
		</section>
	</main>
</template>

<script>
import CardButton from "@/components/CardButton.vue"
import CardCount from "@/components/CardCount.vue"

export default {
	name: 'DashboardView',
	components: {
		CardButton,
		CardCount,
		EasyDataTable: window['vue3-easy-data-table']
	},
	data() {
		return {
			options: [
				{
					id: 0,
					icon: "fa-solid fa-plane-departure",
					router: "lliurament",
					name: "Lliurament de material"
				},
				{
					id: 2,
					icon: "fa-solid fa-plane-arrival",
					router: "retorn",
					name: "Retorn de material"
				}
			],
			groupedElements: [],
			headers: [
				{ text: "Data d'entrega", value: "NumMag", sortable: true },
				{ text: "Delegació", value: "Model.Subcategory.SubcategoryName", sortable: true },
				{ text: "Codi magatzem", value: "Model.ModelName", sortable: true },
				{ text: "Número de sèrie", value: "SerialNum", sortable: true },
				{ text: "Equip", value: "DataEntrada", sortable: true },
				{ text: "Entregat per", value: "user_created.first_name", sortable: true },
			],
			items: [],
			itemsSelected: [],
			sortBy: "",
			sortType: "asc"
		}
	},
	async beforeCreate() {
		let params = {
			collection: "Element",
			fields: "", //When agreggate this not applies
			filter: "?filter=status[_eq]=published&filter=Model[_neq]=NULL&aggregate[count]=SerialNum&groupBy[]=Model",
			sort: ""
		}
		this.groupedElements = await this.$store.dispatch("getCollection", params)

		//Set Categories, Subcategories, Model and Delegacions
		params = {
			collection: "Category",
			fields: "?fields=*.*.*",
			filter: "?filter[status][_eq]=published",
			sort: "&sort[]=CategoryName"
		}
		this.$store.state.Categories = await this.$store.dispatch("getCollection", params)

		params = {
			collection: "Subcategory",
			fields: "?fields=*.*.*",
			filter: "?filter[status][_eq]=published",
			sort: "&sort[]=SubcategoryName"
		}
		this.$store.state.Subcategory = await this.$store.dispatch("getCollection", params)

		params = {
			collection: "Delegacio",
			fields: "?fields=*.*.*",
			filter: "&filter[status][_eq]=published",
			sort: "&sort[]=Name"
		}
		this.$store.state.Delegacions = await this.$store.dispatch("getCollection", params)
	}
}
</script>
