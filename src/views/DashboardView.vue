<template>
	<main>
		<h1 class="text-center">Tauler principal</h1>
		<section class="row">
			<div class="col-6 col-sm-4 col-lg-2" v-for="option in options" :key="option">
				<router-link :to=option.router>
					<CardButton :title="option.name" :icon="option.icon" :bg-color="'#bb0000'"></CardButton>
				</router-link>
			</div>
		</section>
		<section class="row my-2">
			<div class="col-6 col-sm-4 col-lg-2 my-1" v-for="grouped in groupedElements" :key="grouped">
				<router-link :to="{
					name: 'LlistatElements', params: { model: grouped.Model }
				}">
					<CardCount :count="grouped.count.SerialNum" :model="grouped.Model"></CardCount>
				</router-link>
			</div>
		</section>
		<section class="w-100">
			<h5>Material en préstec pendent de retornar</h5>
			<EasyDataTable :headers="this.headers" :items="this.items" alternating buttons-pagination
				:sort-by="this.sortBy" :sort-type="this.sortType" :loading="this.loading"
				:theme-color="this.$store.state.themeColor">
			</EasyDataTable>
		</section>
	</main>
</template>

<script>
import store from "@/store/index.js"
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
					icon: "bi bi-box-arrow-up-right",
					router: "lliurament",
					name: "Sortida de material"
				},
				{
					icon: "bi bi-box-arrow-in-down-right",
					router: "retorn",
					name: "Entrada de material"
				}
			],
			groupedElements: [],

			headers: [
				{ text: "Data d'entrega", value: "date_created", sortable: true },
				{ text: "Data de retorn", value: "DataRetorn", sortable: true },
				{ text: "Delegació", value: "Desti.Name", sortable: true },
				{ text: "Codi magatzem", value: "Element.NumMag", sortable: true },
				{ text: "Subcategoria", value: "Element.Model.Subcategory.SubcategoryName", sortable: true },
				{ text: "Número de sèrie", value: "Element.SerialNum", sortable: true },
				{ text: "Entregat per", value: "user_created.first_name", sortable: true },
			],
			items: [],
			sortBy: "",
			sortType: "asc",
			loading: true,
		}
	},
	async beforeCreate() {
		let params = {
			collection: "Element",
			fields: "", //When agreggate this not applies
			filter: "?filter=Model[_neq]=NULL&aggregate[count]=SerialNum&groupBy[]=Model",
			sort: "",
			limit: ""
		}
		const agrupats = await store.dispatch("getCollection", params)
		this.groupedElements = agrupats.data.data
		console.log(await store.dispatch("handlingError", agrupats))

		//Mostra el material pendent de retorn
		params = {
			collection: "Moviment",
			fields: "?fields=date_created,DataRetorn,Desti.Name,Element.NumMag,Element.Model.Subcategory.SubcategoryName,Element.SerialNum,user_created.first_name",
			filter: "&filter[MovimentVigent][_eq]=true",
			sort: "",
			limit: ""
		}
		const moviments = await store.dispatch("getCollection", params)
		this.items = moviments.data.data
		console.log(await store.dispatch("handlingError", moviments))

		//Formata la data
		this.items.forEach(moviment => {
			const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
			moviment.date_created = new Date(moviment.date_created).toLocaleDateString('ca-ES', options);

			moviment.DataRetorn = new Date(moviment.DataRetorn).toLocaleDateString('ca-ES', options);
		});
		this.loading = false

		//Set Categories, Subcategories, Model and Delegacions
		params = {
			collection: "Category",
			fields: "?fields=*.*.*",
			filter: "",
			sort: "&sort[]=CategoryName",
			limit: ""
		}
		const categories = await store.dispatch("getCollection", params)
		store.commit("SET_Category", categories.data.data)
		console.log(await store.dispatch("handlingError", categories))

		params = {
			collection: "Subcategory",
			fields: "?fields=*.*.*",
			filter: "",
			sort: "&sort[]=SubcategoryName",
			limit: ""
		}
		const subcategory = await store.dispatch("getCollection", params)
		store.commit("SET_Subcategory", subcategory.data.data)
		console.log(await store.dispatch("handlingError", subcategory))

		params = {
			collection: "Delegacio",
			fields: "?fields=*.*.*",
			filter: "&filter[status][_eq]=published",
			sort: "&sort[]=Name",
			limit: ""
		}
		const delegacions = await store.dispatch("getCollection", params)
		store.commit("SET_Delegacio", delegacions.data.data)
		console.log(await this.$store.dispatch("handlingError", delegacions))
	}
}
</script>
<style scoped>
a {
	text-decoration: none;
}
</style>>
