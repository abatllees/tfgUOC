<template>
	<NavBar class="sticky-top" v-if="logged_in" />
	<main class=" container mt-3 overflow-hidden">
		<router-view />
	</main>
</template>

<script>
import router from "@/router"
import NavBar from "@/components/NavBar.vue"
import store from "@/store/index.js"
export default {
	name: 'App',
	data() {
		return {
		}
	},
	components: {
		NavBar
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
