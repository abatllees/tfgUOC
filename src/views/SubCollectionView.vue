<template>
    <section class="row">
        <h1 class="text-center w-100">Subcategories</h1>
        <div class="col-6 col-sm-4 col-md-3  my-1" v-for="subcategory in this.$store.state.Subcategories"
            :key="subcategory">
            <CardButtonVue :msg=subcategory.SubcategoryName :id="subcategory.id"
                v-if="subcategory.Category.id == this.$route.params.id"> </CardButtonVue>
        </div>
        <p v-for="subcategory in this.subcategories" :key="subcategory">
            {{ subcategory }}</p>
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
    data() {
        return {
            filter: "&filter[status][_eq]=published&filter[Category][_eq]=" + this.$route.params.id,
            subcategories: null,
            id: null
        }
    },
    setup() {

    },
    async mounted() {
        this.subcategories = await this.GET_SUBCATEGORIES()
    },
    methods: {

        GET_SUBCATEGORIES: async function () {
            console.log("Collection to get: Subcategory")
            console.log("Param ID:", this.$route.params.id)

            await api.get("items/Subcategory?fields=*.*" + this.filter)
                .then(response => {
                    //this.$store.state.Subcategories = response.data.data
                    console.log(response.data.data)
                    return response
                })
                .catch(error => console.log(error.message))
        }
    }
}
</script>