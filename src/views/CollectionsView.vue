<template>
    <h1 class="text-center">Categories</h1>
    <section class="row">
        <div class="col-6 col-sm-4 col-md-3  my-1" v-for="category in this.categories" :key="category">
            <router-link :to="{
                name: 'subcollection',
                params: {
                    id: category.id
                }
            }">
                <CardButton :title=category.CategoryName :icon="'fa-solid fa-user-secret'"></CardButton>
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
            params: {
                collection: "Category",
                fields: "?fields=CategoryName,id",
                filter: "&filter[status][_eq]=published&filter[CategoryName][_neq]=NULL",
                sort: "&sort[]=CategoryName"
            },
            categories: []
        }
    },
    async mounted() {
        this.categories = await this.$store.dispatch("getCollection", this.params)
    }
}
</script>