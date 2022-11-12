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
</template>
<script>
export default {
    name: 'LoginForm',
    components:{

    },
    data(){
        return{
            email: null,
            password: null
        }
    },
    computed:{

    },
    methods:{
        handleLogin: function(){
            let payload = {
                email: this.email,
                password: this.password
            }
            this.$store.commit("login", payload)
        }
    }
}
</script>

<style scoped>
form{
    margin: 5px solid #bb0000;
    margin-right: 30px solid #bb0000
}
</style>