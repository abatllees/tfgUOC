<template>
	<main>
		<h1 class="text-center">Tauler principal</h1>
		<section class="row">
			<div class="col-6 col-sm-4 col-lg-2" v-for="option in options" :key="option">
				<router-link :to="{ path: option.router, params: { id: '2' } }">
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
		<section class="row">
			<h5>Material en préstec pendent de retornar</h5>
			<EasyDataTable :headers="this.headers" :items="this.items" alternating buttons-pagination
				:sort-by="this.sortBy" :sort-type="this.sortType" :loading="this.loading"
				:theme-color="this.$store.state.themeColor">
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
					icon: "bi bi-box-arrow-up-right",
					router: "lliurament",
					name: "Sortida de material"
				},
				{
					id: 2,
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
		this.groupedElements = await this.$store.dispatch("getCollection", params)
		console.log(await this.$store.dispatch("handlingError", this.groupedElements))

		//Mostra el material pendent de retorn
		params = {
			collection: "Moviment",
			fields: "?fields=date_created,DataRetorn,Desti.Name,Element.NumMag,Element.Model.Subcategory.SubcategoryName,Element.SerialNum,user_created.first_name",
			filter: "&filter[MovimentVigent][_eq]=true",
			sort: "",
			limit: ""
		}
		this.items = await this.$store.dispatch("getCollection", params)

		//Formata la data
		this.items.forEach(moviment => {
			let date_created_Fromatted = new Date(moviment.date_created)
			const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
			moviment.date_created = date_created_Fromatted.toLocaleDateString('ca-ES', options);

			let dataRetorn_Fromatted = new Date(moviment.DataRetorn)
			moviment.DataRetorn = dataRetorn_Fromatted.toLocaleDateString('ca-ES', options);
		});
		console.log(await this.$store.dispatch("handlingError", this.items))
		this.loading = false

		//Set Categories, Subcategories, Model and Delegacions
		params = {
			collection: "Category",
			fields: "?fields=*.*.*",
			filter: "?filter[status][_eq]=published",
			sort: "&sort[]=CategoryName",
			limit: ""
		}
		this.$store.state.Categories = await this.$store.dispatch("getCollection", params)
		console.log(await this.$store.dispatch("handlingError", this.$store.state.Categories))


		params = {
			collection: "Subcategory",
			fields: "?fields=*.*.*",
			filter: "?filter[status][_eq]=published",
			sort: "&sort[]=SubcategoryName",
			limit: ""
		}
		this.$store.state.Subcategory = await this.$store.dispatch("getCollection", params)
		console.log(await this.$store.dispatch("handlingError", this.$store.state.Subcategory))


		params = {
			collection: "Delegacio",
			fields: "?fields=*.*.*",
			filter: "&filter[status][_eq]=published",
			sort: "&sort[]=Name",
			limit: ""
		}
		this.$store.state.Delegacions = await this.$store.dispatch("getCollection", params)
		console.log(await this.$store.dispatch("handlingError", this.$store.state.Delegacions))

	}
}
</script>
<style scoped>
a {
	text-decoration: none;
}
</style>>
