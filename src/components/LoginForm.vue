<template>
    <form @submit.prevent="handleLogin()">
        <div class="form-group my-2">
            <label for="emailLogin">Usuari</label>
            <input type="email" class="form-control" id="emailLogin" aria-describedby="emailHelp" v-model="this.email">
        </div>
        <div class="form-group my-2">
            <label for="passwordLogin">Contrasenya</label>
            <input type="password" class="form-control" id="passwordLogin" v-model="this.password">
        </div>
        <button type="submit" class="btn btn-secondary my-2">Inicia sessió</button>
    </form>
    <img src="@/assets/logoCCMA.png" alt="Logotip CCCMA" class="mx-auto d-block py-5">
    {{ LoginResponse }}
</template>
<script>
export default {
    name: 'LoginForm',
    components: {

    },
    data() {
        return {
            email: null,
            password: null,
            LoginResponse: "Null"
        }
    },
    computed: {

    },
    methods: {
        async handleLogin() {
            let payload = {
                email: this.email,
                password: this.password
            }
            this.LoginResponse = await this.$store.dispatch("handleLogin", payload)
        }
    }
}
</script>

<style scoped>
form {
    border: 2px solid #bb0000;
    border-right: 70px solid #bb0000;
    padding: 56px 16px 56px 16px;
}
</style>