<template>
	<nav class="navbar navbar-expand-lg bg-primary text-white" v-if="this.$store.state.login">
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
						<router-link to="persones" class="nav-link">Persones</router-link>
					</li>
					<li class="nav-item dropdown">
						<a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown"
							aria-expanded="false">
							Delegacions
						</a>
						<ul class="dropdown-menu">
							<li><a class="dropdown-item" href="#">Lleida</a></li>
							<li><a class="dropdown-item" href="#">Girona</a></li>
							<li><a class="dropdown-item" href="#">Tarragona</a></li>
							<li><a class="dropdown-item" href="#">Pirineus</a></li>
							<li><a class="dropdown-item" href="#">Catalunya nord</a></li>
							<li><a class="dropdown-item" href="#">Catalunya central</a></li>
							<li>
								<hr class="dropdown-divider">
							</li>
							<li><a class="dropdown-item" href="#">Bilbao</a></li>
							<li><a class="dropdown-item" href="#">Madrid</a></li>
						</ul>
					</li>
					<li class="nav-item">
						<router-link to="persones" class="nav-link">Inventari</router-link>
					</li>
					<li class="nav-item">
						<router-link to="persones" class="nav-link">Moviments</router-link>
					</li>
				</ul>
				<form class="d-flex" role="search">
					<input class="form-control me-2" type="search" placeholder="Cerca un element" aria-label="Search">
				</form>
				<span class="mx-2">{{user.first_name}} {{user.last_name}}</span>
				<button v-on:click="logout()" class="btn btn-secondary m-1">Logout</button>
			</div>
		</div>
	</nav>
</template>
  
<script>
import axios from "axios"
const BASE_URL = "https://weekob4y.directus.app/"
export default {
	name: 'NavBar',
	data() {
		return {
			user: ""
		}
	},
	components: {

	},
	mounted() {
		if(!localStorage.getItem('user')){
			this.$router.push("/login")
		}			
	},
	async created(){
		if(JSON.parse(localStorage.getItem('user'))){
			let URL = BASE_URL + "users/me?access_token=" + JSON.parse(localStorage.getItem('user')).access_token
			await axios.get(URL)
			.then(response => {
				console.log(response.data.data)
				this.user = response.data.data
			})
			.catch(error => console.log(error.message))
		}

	},
	methods: {
		logout: function () {
			let refresh_token = JSON.parse(localStorage.getItem('user')).refresh_token

			this.$store.commit("logout", refresh_token)
		},
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
</style>
  