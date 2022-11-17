<template>
    <h1 class="text-center">Categories</h1>
    <section class="row">
        <div class="col-6 col-sm-4 col-md-3  my-1" v-for="category in this.$store.state.Category" :key="category">
            <router-link :to="{ name: 'subcollection', params: { collectionName: category.id } }">
                <CardButton :msg=category.CategoryName :icon="'fa-solid fa-user-secret'"></CardButton>
            </router-link>
        </div>
    </section>
</template>
<script>
import CardButton from '@/components/CardButton.vue'
import api from "@/api"

export default {
    name: 'CollectionsView',
    components: {
        CardButton
    },
    data() {
        return {
            filter: "?filter[status][_eq]=published"
        }
    },
    created() {

    },
    async mounted() {
        console.log("Collection to get: Category")

        await api.get("items/Category" + this.filter)
            .then(response => {
                this.$store.state.Category = response.data.data
                console.log(response.data.data)
            })
            .catch(error => console.log(error.message))

    },
    computed: {

    },
    methods: {

    }
}
</script>