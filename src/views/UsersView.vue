<template>
    <h1 class="text-center">Llistat d'usuaris</h1>
    <section class="row row-cols-2 row-cols-lg-6">
        <UserCard class="col" v-for="user in this.$store.state.users" :key="user" :name="user.first_name"
            :last_name="user.last_name" :email="user.email"></UserCard>
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

        }
    },
    created() {
        let params = {
            sort: "?sort=first_name"
        }
        this.$store.dispatch("getUsers", params);
    }
}
</script>
