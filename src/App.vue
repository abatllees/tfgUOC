<template>
	<NavBar class="sticky-top" v-if="logged_in" />
	<main class="container mt-3 overflow-auto">
		<router-view />
	</main>
	<footer>
		<FooterComponent class="p-2 text-center w-100"></FooterComponent>
	</footer>
</template>

<script>
import router from "@/router"
import NavBar from "@/components/NavBar.vue"
import FooterComponent from "@/components/FooterComponent.vue"
import store from "@/store/index.js"
export default {
	name: 'App',
	data() {
		return {
		}
	},
	components: {
		NavBar,
		FooterComponent
	},
	computed: {
		logged_in() {
			return store.state.access_token
		}
	},
	async beforeMount() {
		if (!sessionStorage.getItem('access_token')) {
			router.push("/login")
		}
	}
}
</script>

<style lang="scss">
@import "./styles/custom.scss";
@import '../node_modules/bootstrap/scss/bootstrap.scss';
</style>
