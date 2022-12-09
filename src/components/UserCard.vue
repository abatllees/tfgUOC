<template>
    <div class="card">
        <div class="card-img-top w-100 my-2"></div>
        <div class="card-body">
            <h5 class="card-title text-center">{{ name }} {{ last_name }}</h5>
            <a v-if="email" :href="'mailto:${email}'" class="btn btn-secondary w-100">Contacta</a>
        </div>
    </div>
</template>
<script>
//import api from "@/api"
export default {
    name: "UserCard",
    components: {

    },
    props: {
        name: String,
        last_name: String,
        email: String,
        avatar: String
    },
    data() {
        return {
        }
    },
    beforeCreate() {
        /*await api.get("/assets/" + this.avatar)
            .then(response => {
                console.log(response)
            })*/
    }
}
</script>

<style scoped>
.card {
    background-color: #bb0000;
    color: white;
    border-radius: 0;
    border-color: initial;
}

.card-img-top {
    background-color: #dddddd;
    height: 200px;
    border-radius: 0;
}
</style>