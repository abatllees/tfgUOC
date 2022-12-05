<template>
	<nav class="navbar navbar-expand-lg bg-primary text-white">
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
						<router-link to="users" class="nav-link">Persones</router-link>
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
						<router-link to="collections" class="nav-link">Inventari</router-link>
					</li>
					<li class="nav-item">
						<router-link to="moviments" class="nav-link">Moviments</router-link>
					</li>
				</ul>
				<form class="d-flex" role="search">
					<input class="form-control me-2" type="search" placeholder="Cerca un element" aria-label="Search">
				</form>
				<span class="mx-2">{{ fullname }}</span>
				<button v-on:click="logout()" class="btn btn-secondary m-1">Logout</button>
			</div>
		</div>
	</nav>
</template>
  
<script>
import { mapActions, mapGetters } from 'vuex'

export default {
	name: 'NavBar',
	data() {
		return {
			fullname: null
		}
	},
	components: {

	},
	beforeMount() {
		if (this.$store.state.user) {
			return this.$store.state.user?.first_name + " " + this.$store.state.user?.last_name
		}
		return null
	},
	watch: {
		getName() {
			this.fullname = this.$store.state.user?.first_name + " " + this.$store.state.user?.last_name
		}
	},
	computed: {
		...mapActions(['getUser']),
		...mapGetters(['getUser']),

		getName: function () {
			console.log('Updated!')
			if (this.$store.state.user) {
				return this.$store.state.user?.first_name + " " + this.$store.state.user?.last_name
			}
			return null
		}
	},
	methods: {
		logout: function () {
			let refresh_token = sessionStorage.refresh_token;
			this.$store.commit("logout", refresh_token);
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
  