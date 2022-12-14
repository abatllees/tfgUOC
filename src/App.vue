<template>
	<NavBar v-if="this.$store.state.user" />
	<main class=" container my-5 overflow-hidden">
		<router-view />
	</main>
</template>

<script>
import router from "@/router"
import NavBar from "@/components/NavBar.vue"
export default {
	name: 'App',
	data() {
		return {
			user: sessionStorage.getItem('user'),
		}
	},
	components: {
		NavBar
	},
	async beforeMount() {
		if (!sessionStorage.getItem('access_token')) {
			router.push("/login")
		}

		//Set Categories, Subcategories, Model and Delegacions
		let params = {
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

		/*await Promise.all([Categories, Delegacio]).then(values => {
			console.log(values)
		}, reason => {
			console.log(reason)
		})*/

	}
}
</script>

<style lang="scss">
@import "./styles/custom.scss";
@import '../node_modules/bootstrap/scss/bootstrap.scss';
</style>
