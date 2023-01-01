<template>
    <h1 class="text-center">Llistat d'usuaris</h1>
    <section class="row row-cols-2 row-cols-lg-6">
        <UserCard class="col" v-for="user in this.users" :key="user" :name="user.first_name" :last_name="user.last_name"
            :email="user.email" :avatar="user.avatar"></UserCard>
    </section>
</template>

<script>
import UserCard from "@/components/UserCard.vue"
export default {
    name: "UsersView",
    components: {
        UserCard
    },
    data() {
        return {
            users: []
        }
    },
    async created() {
        let params = {
            collection: "",
            id: "",
            fields: "?fields=*.*.*",
            filter: "&filter[status][_eq]=active",
            sort: "&sort=first_name"
        }
        this.users = await this.$store.dispatch("getUsers", params)
    }
}
</script>
