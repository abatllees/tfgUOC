<template>
    <h1 class="text-center">Llistat d'usuaris</h1>
    <section class="row">
        <UserCard class="col col-sm-6 col-md-2" v-for="user in this.$store.state.users" :key="user"
            :name="user.first_name" :last_name="user.last_name" :email="user.email"></UserCard>
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
        this.$store.dispatch("getUsers");
    }
}
</script>
