<template>
	<nav class="navbar navbar-expand-md bg-primary text-white">
		<div class="container-fluid">
			<router-link to="/" class="navbar-brand">Inventari MGM-CEI</router-link>
			<button class="navbar-toggler" type="button" data-bs-toggle="collapse"
				data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
				aria-label="Toggle navigation">
				<span class="navbar-toggler-icon"></span>
			</button>
			<div class="collapse navbar-collapse" id="navbarSupportedContent">
				<ul class="navbar-nav me-auto mb-2 mb-lg-0">
					<li class="nav-item">
						<router-link to="users" class="nav-link" replace> <i class="bi bi-people"></i>
							Persones</router-link>
					</li>
					<li class="nav-item dropdown">
						<a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown"
							aria-expanded="false">
							<i class="bi bi-house"></i> Delegacions
						</a>
						<ul class="dropdown-menu">
							<li v-for="delegacio in delegacions" v-bind:key="delegacio"><router-link :to="{
								name: 'DelegacioView',
								params: {
									id: delegacio.ID
								}
							}" class="dropdown-item" replace>{{ delegacio.Name }}</router-link></li>
						</ul>
					</li>
					<li class="nav-item dropdown">
						<a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown"
							aria-expanded="false">
							<i class="bi bi-box"></i> Inventari
						</a>
						<ul class="dropdown-menu">
							<li class="dropdown-item"> <router-link to="MeuInventari" replace>El meu
									inventari</router-link>
							</li>
							<li class="dropdown-item"> <router-link to="collections" replace>Categories</router-link>
							</li>
							<li class="dropdown-item"> <router-link to="brand" replace>Marques</router-link></li>
						</ul>
					</li>
					<li class="nav-item">
						<router-link to="moviments" class="nav-link" replace><i class="bi bi-arrow-left-right"></i>
							Moviments</router-link>
					</li>
				</ul>
				<form class="d-flex" role="search">
					<input class="form-control me-2" type="search" placeholder="Cerca un element" aria-label="Search"
						v-model="SearchInput" @input="debounceSearch">
					<div class="form-group position-absolute top-100 left-0" v-if="this.SearchResults">
						<ul class="list-group w-100">
							<li class="list-group-item list-group-item-action" v-for="result in this.SearchResults"
								:key="result">
								<router-link :to="{
									name: 'Fitxa', params: { SerialNum: result?.SerialNum }
								}">
									<CardResult :result="result"></CardResult>
								</router-link>
							</li>

							<li class="text-center list-group-item list-group-item-primary"><router-link
									to="ResultatCerca">
									Amplia la cerca</router-link>
							</li>

						</ul>
					</div>
				</form>
				<span class="mx-2">{{ fullname }}</span>

				<button v-on:click="logout()" class="btn btn-secondary m-1">Logout</button>
			</div>
		</div>
	</nav>
</template>

<script>
import store from "@/store/index.js"
import router from "@/router/index.js"

import api from "@/api.js"
import CardResult from "@/components/CardResult.vue"

export default {
	name: 'NavBar',
	components: {
		CardResult
	},
	data() {
		return {
			SearchInput: "",
			SearchResults: null
		}
	},
	computed: {
		fullname() {
			return store.state.user?.first_name + " " + store.state.user?.last_name
		},
		delegacions() {
			return store.getters.getDelegacions
		}
	},
	methods: {
		logout: async function () {
			const logout = await new Promise((resolve, reject) => {
				api.post("auth/logout", {
					refresh_token: sessionStorage.getItem("access_token")
				})
					.then(response => {
						resolve(response)
						sessionStorage.clear()
						store.commit("SET_LOGGED_USER", null)
						store.commit("SET_TOKENS", {
							access_token: null,
							refresh_token: null
						})
						store.commit("SET_CallNewToken", false)

						router.replace("/login")
					})
					.catch(error => reject(error.message))
			})
			console.log(await store.dispatch("handlingError", logout))


		},
		searchElement: async function () {
			let params = {
				collection: "Element",
				fields: "?fields=NumMag,SerialNum,Model.Subcategory.SubcategoryName,Model.ModelName,Model.Brand.BrandName,status,DelegacioActual.Name,Observacions",
				filter: "&filter[_or][1][NumMag][_contains]=" + this.SearchInput
					+ "&filter[_or][2][SerialNum][_contains]=" + this.SearchInput
					+ "&filter[_or][3][Model][ModelName][_contains]=" + this.SearchInput
					+ "&filter[_or][4][Model][Brand][BrandName][_contains]=" + this.SearchInput,
				sort: "&sort[]=NumMag",
				limit: "&limit=5"
			}

			const response = await this.$store.dispatch("getCollection", params)
			this.SearchResults = response.data.data
			this.$store.state.NavQuery = params //Defineix l'objecte a l'STATE per quan s'amplia la cerca
			console.log(await this.$store.dispatch("handlingError", response))

		},
		async debounceSearch() {
			clearTimeout(this.debounce)
			this.debounce = setTimeout(() => {
				if (this.SearchInput.length) {
					this.searchElement()
				} else {
					this.SearchResults = null
				}
			}, 200)
		}


	}
}
</script>
<style scoped>
a {
	color: white
}

.navbar-toggler {
	background-color: white;
	border: 1px solid black;
}

.dropdown-item {
	color: black
}

a {
	text-decoration: none;
	color: inherit
}
</style>
