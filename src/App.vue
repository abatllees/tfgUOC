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
	created() {
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
