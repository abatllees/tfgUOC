<template>
    <section class="row">
        <div class="col col-sm-9 col-md-4 mx-auto">
            <LoginForm></LoginForm>
        </div>
    </section>
</template>
<script>
import LoginForm from "@/components/LoginForm.vue"
import router from "../router"

export default {
    name: 'LoginView',
    components: {
        LoginForm
    },
    data() {
        return {

        }
    },
    created() {
        if (sessionStorage.getItem('access_token')) {
            router.push("/")
        }
    },
    computed: {

    },
    methods: {

    }
}
</script>