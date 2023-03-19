<template>
    <form @submit.prevent="HANDLE_LOGIN()" class="bg-light p-4">
        <div class="bg-primary text-white p-2"><i class="bi bi-lock-fill"></i></div>

        <div class="form-group my-2">
            <label for="emailLogin">Nom d'usuari</label>
            <input type="email" class="form-control" id="emailLogin" aria-describedby="emailHelp" v-model="email">
        </div>
        <div class="form-group my-2">
            <label for="passwordLogin">Contrasenya</label>
            <input type="password" class="form-control" id="passwordLogin" v-model="password">
        </div>
        <div class="alert alert-danger" v-if="error">
            <ul class="list-unstyled">
                <li v-for="error in error" :key="error">{{ error.message }}</li>
            </ul>
        </div>
        <button type="button" class="btn btn-secondary" data-toggle="modal" data-target="#exampleModal">Has oblidat la
            contrasenya?</button>
        <button type="submit" class="btn btn-primary m-2 ">Inicia sessió</button>
    </form>
    <p class="text-center">
        <small class="mt-2">Tingueu en compte que la sessió caduca després de 15 minuts d'haver iniciat sessió</small>
    </p>
    <!-- Modal -->
    <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
        aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Recupera la contrasenya</h5>
                    <button type="button" class="btn btn-secondary" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="form-group my-2">
                        <label for="email_reset">Correu electrònic:</label>
                        <input type="password" class="form-control" id="email_reset" v-model="email_reset">
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" @click="reset_password(email_reset)">Continuar</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import store from '@/store/index.js'
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
            error: null,
            email_reset: null
        }
    },
    methods: {
        async HANDLE_LOGIN() {
            await new Promise((resolve, reject) => {
                api.post("auth/login", {
                    email: this.email,
                    password: this.password
                })
                    .then(response => {
                        resolve(response.data.data)
                        sessionStorage.setItem("access_token", response.data.data.access_token)
                        sessionStorage.setItem("expires", response.data.data.expires)
                        sessionStorage.setItem("refresh_token", response.data.data.refresh_token)

                        store.commit("SET_TOKENS", {
                            access_token: response.data.data.access_token,
                            refresh_token: response.data.data.refresh_token
                        })
                        store.commit("SET_CallNewToken", true)

                        const expires = Date.now() + response.data.data.expires
                        console.log("EXPIRES", new Date(expires))
                        sessionStorage.setItem("expires", new Date(expires))
                        store.dispatch("getUser")

                        router.push("/")
                    })
                    .catch(error => {
                        this.error = error.response.data.errors
                        reject(error.response)

                    })
            })
        },
        //Actualitza més d'un element
        async reset_password(email) {
            return new Promise((resolve) => {
                api.patch("auth/password/request/", {
                    "email": email
                })
                    .then(response => {
                        resolve(response)
                        console.log(response)
                    })
                    .catch(error => {
                        resolve(error.response)
                    })
            })
        },
    }
}
</script>
<style scoped>
i {
    font-size: 1.3rem;
}
</style>