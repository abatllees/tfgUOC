<template>
    <section class="row">
        <h1 class="text-center w-100">{{ msg }}</h1>
        <div class="col-6 col-sm-4 col-md-3  my-1" v-for="subcategory in this.$store.state.Subcategory"
            :key="subcategory">
            <router-link :to="{ name: 'LlistatElements', params: { id: subcategory.id } }">
                <CardButton :msg=subcategory.SubcategoryName :icon="'fa-solid fa-user-secret'"></CardButton>
            </router-link>
        </div>
    </section>
</template>
<script>
import CardButton from '@/components/CardButton.vue';

export default {
    name: "SubCollectionViewVue",
    components: {
        CardButton
    },
    data() {
        return {
        }
    },
    async mounted() {
        let params = {
            collection: "Subcategory",
            fields: "?fields=*.*.*",
            filter: "&filter[status][_eq]=published&filter[Category][_eq]=" + this.$route.params.id
        }

        await this.$store.dispatch("getCollection", params);
    },
    methods: {
    }
}
</script>