<template>
	<NavBar v-if="this.$store.state.auth" />
	<main class="container my-5">
		<router-view />
	</main>
</template>

<script>
/* eslint-disable */

import NavBar from "@/components/NavBar.vue"
import router from "@/router"
export default {
	name: 'App',

	components: {
		NavBar
	},
	created() {

		console.log("Logged in:", localStorage.getItem('user'))

		if (!localStorage.getItem('user')) {
			router.push("/login")
		}
	},
}
</script>

<style lang="scss">
@import "./styles/custom.scss";
@import '../node_modules/bootstrap/scss/bootstrap.scss';
</style>
