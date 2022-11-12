<template>
    <section class="row">
        <div class="col col-md-3 col-sm-9 mx-auto">
            <LoginForm></LoginForm>
        </div>
    </section>
</template>
<script>
import LoginForm from "@/components/LoginForm.vue"

import router from "../router"

export default {
    name: 'LoginView',
    components:{
        LoginForm
    },
    data(){
        return{
            email: null,
            password: null
        }
    },
    created(){
        if(this.$store.state.login){
            router.push("/")
        }
    },
    computed:{

    },
    methods:{
        handleLogin: function(){
            console.log(this.email)
            console.log(this.password)
        }
    }
}
</script>