<template>
    <h1 class="text-center">Categories</h1>
    <section class="row">
        <div class="col-6 col-sm-4 col-md-3  my-1" v-for="category in this.$store.state.Category" :key="category">
            <CardButton :msg=category.CategoryName> </CardButton>
        </div>
    </section>
</template>
<script>
import CardButton from '@/components/CardButton.vue'
import { mapState, mapGetters } from 'vuex'

export default {
    name: 'CollectionsView',
    components: {
        CardButton
    },
    data() {
        return {
            //categories: this.$store.state.Category
        }
    },
    created() {

    },
    mounted() {
        this.$store.dispatch('getItem', "Category")
        this.$store.dispatch('getItem', "Subcategory")

    },
    computed: {
        ...mapState(['Category']),
        ...mapGetters(['getCategories'])
    },
    methods: {

    }
}
</script>