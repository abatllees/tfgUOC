<template>
  <NavBar/>
  <main class="container my-5">
    <router-view/>
  </main>
</template>

<script>
import NavBar from "@/components/NavBar.vue"
import router from "@/router"
export default {
  name: 'App',
  components: {
    NavBar
  },
  created(){
    var login = this.$store.getters.getLogin
    console.log("Logged in:", login)
    console.log("LocalStorage",localStorage.getItem('user'))

    if(!localStorage.getItem('user')){
			router.push("/login")
		}
  }
}
</script>

<style lang="scss">
  @import "./styles/custom.scss";
  @import '../node_modules/bootstrap/scss/bootstrap.scss';
</style>
