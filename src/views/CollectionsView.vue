<template>
    <h1 class="text-center">Categories</h1>
    <section class="row">
        <div class="col-6 col-sm-4 col-md-3  my-1" v-for="category in this.$store.state.Category" :key="category">
            <router-link :to="{ name: 'subcollection', params: { id: category.id } }">
                <CardButton :msg=category.CategoryName :icon="'fa-solid fa-user-secret'"></CardButton>
            </router-link>
        </div>
    </section>
</template>
<script>
import CardButton from '@/components/CardButton.vue'

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
    async beforeMount() {
        let params = {
            collection: "Category",
            fields: "?fields=*.*.*",
            filter: ""
        }

        await this.$store.dispatch("getCollection", params);
    },
    computed: {

    },
    methods: {

    }
}
</script>