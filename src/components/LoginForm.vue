<template>
    <form @submit.prevent="HANDLE_LOGIN()">
        <div class="form-group my-2">
            <label for="emailLogin">Usuari</label>
            <input type="email" class="form-control" id="emailLogin" aria-describedby="emailHelp" v-model="this.email">
        </div>
        <div class="form-group my-2">
            <label for="passwordLogin">Contrasenya</label>
            <input type="password" class="form-control" id="passwordLogin" v-model="this.password">
        </div>
        <div class="alert alert-danger" v-if="this.error">

            {{ error[0].message }}
        </div>
        <button type="submit" class="btn btn-secondary my-2">Inicia sessió</button>
    </form>
    <img src="@/assets/logoCCMA.png" alt="Logotip CCCMA" class="mx-auto d-block py-5">
</template>
<script>
import router from '../router'
import api from "@/api"

export default {
    name: 'LoginForm',
    components: {

    },
    data() {
        return {
            email: "",
            password: "",
            error: null
        }
    },
    methods: {
        HANDLE_LOGIN() {
            return new Promise((resolve, reject) => {
                api.post("auth/login", {
                    email: this.email,
                    password: this.password
                })
                    .then(response => {
                        resolve(response.data.data)
                        sessionStorage.setItem("access_token", response.data.data.access_token)
                        sessionStorage.setItem("expires", response.data.data.expires)
                        sessionStorage.setItem("refresh_token", response.data.data.refresh_token)

                        this.$store.dispatch("getUser")
                        router.push("/")
                    })
                    .catch(error => reject(this.error = error.response.data.errors))
            })
        },
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