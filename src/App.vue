<template>
	<InstallPWA></InstallPWA>
	<NavBar class="sticky-top" v-if="logged_in" />
	<main class="container mt-3 overflow-auto">
		<router-view />
	</main>
	<section class="w-100">
		<p>Logged in: {{ logged_in }}</p>
		<p>New token: {{ call_new_token }}</p>
	</section>
</template>

<script>
import router from "@/router"
import NavBar from "@/components/NavBar.vue"
import InstallPWA from "./components/InstallPWA.vue"

import api from "@/api.js"
import store from "@/store/index.js"


export default {
	name: 'App',
	data() {
		return {
			refreshID: null,
		}
	},
	components: {
		NavBar,
		InstallPWA,
	},
	computed: {
		logged_in() {
			return store.state.access_token
		},
		call_new_token() {
			return store.state.call_new_token
		}
	},
	watch: {
		call_new_token() {
			if (this.call_new_token) {
				this.refreshID = this.createInterval()
				console.log("Interval created", this.refreshID)
			} else {
				console.log("Interval to clear:", this.refreshID)
				clearInterval(this.refreshID)
			}
		}
	},
	methods: {
		createInterval: function () {
			const intervalID = setInterval(this.refreshToken, 5000, this.logged_in);
			return intervalID
		},
		refreshToken: function () {
			return new Promise((resolve, reject) => {
				api.post("auth/refresh", {
					refresh_token: sessionStorage.getItem("refresh_token"),
					mode: "json"
				})
					.then(response => {
						resolve(response)
					})
					.catch(error => reject(error.response))
			})
		},

	},
	async beforeMount() {
		if (!sessionStorage.getItem('access_token')) {
			router.push("/login")
		}
	},
}
</script>

<style lang="scss">
@import "./styles/custom.scss";
@import '../node_modules/bootstrap/scss/bootstrap.scss';
</style>
