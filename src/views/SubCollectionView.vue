<template>
    <section class="row">
        <h1 class="text-center w-100">{{ subcategory }}</h1>
        <div class="col-6 col-sm-4 col-md-3  my-1" v-for="subcategory in this.$store.state.Category" :key="subcategory">
            <CardButtonVue :msg=subcategory.SubcategoryName :id="subcategory.id"></CardButtonVue>
        </div>
    </section>
</template>
<script>
import CardButtonVue from '@/components/CardButton.vue';
import api from "@/api"

export default {
    name: "SubCollectionViewVue",
    components: {
        CardButtonVue
    },
    props: {
        subcategory: String
    },
    data() {
        return {
            filter: "&filter[status][_eq]=published&filter[Category][_eq]=" + this.$route.params.id,
            subcategories: null,
            id: null
        }
    },
    async mounted() {
        await api.get("items/Subcategory?fields=*.*" + this.filter)
            .then(response => {
                this.$store.state.Category = response.data.data
                console.log(response.data.data)
                console.log(this.subcategories)
            })
            .catch(error => console.log(error.message))
    },
    methods: {
    }
}
</script>