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
        if(localStorage.getItem('token')){
            router.push("/")
        }
    },
    computed:{

    },
    methods:{

    }
}
</script>