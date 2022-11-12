<template>
    <section class="row">
        <div class="col col-md-5 col-sm-9 mx-auto">
            <LoginForm></LoginForm>
        </div>
    </section>
</template>
<script>
import LoginForm from "@/components/LoginForm.vue"

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