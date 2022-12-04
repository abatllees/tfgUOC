<template>
    <div class="card">

        <div class="card-body">
            <h5 class="card-title text-center">{{ name }} {{ last_name }}</h5>
        </div>
    </div>
</template>
<script>
//<a v-if="user.email" : href="'mailto:${user.email}'">{{ user.email }}</a>
import api from "@/api"
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
    async beforeCreate() {
        await api.get("/assets/" + this.avatar)
            .then(response => {
                console.log(response)
            })
    }
}
</script>