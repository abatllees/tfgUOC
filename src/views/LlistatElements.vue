<template>
    <h1 class="text-center">{{ msg }}</h1>
    <section class="row justify-content-end">
        <div class="col col-md-3 mb-2">
            <label for="site-search">Comença a cercar:</label>
            <input type="text" id="site-search" name="q" class="form-control" v-model="this.searchValue">
        </div>
    </section>
    <EasyDataTable :headers="this.headers" :items="this.$store.state.Element" alternating buttons-pagination
        :search-value="searchValue" :sort-by="this.sortBy" :sort-type="this.sortType"
        :theme-color="this.$store.state.themeColor">
    </EasyDataTable>
</template>
<script>

export default {
    name: "LlistatElements",
    components: {

    },
    props: {
        msg: String

    },
    data() {
        return {
            headers: [
                { text: "Núm. Mag", value: "NumMag", sortable: true },
                { text: "Subcategoria", value: "Model.Subcategory.SubcategoryName", sortable: true },
                { text: "Marca", value: "Model.Brand.BrandName", sortable: true },
                { text: "Model", value: "Model.ModelName", sortable: true },
                { text: "Número de sèrie", value: "SerialNum", sortable: true },
                { text: "Delegació actual", value: "DelegacioActual.Name", sortable: true },
            ],
            sortBy: "NumMag",
            sortType: "asc",
            searchValue: ""
        }
    },
    watch: {
        /* query() {
             console.log("changed")
             this.$store.state.Element = this.filterItems(this.$store.state.Element, this.query)
         }*/
    },
    async beforeMount() {
        let params = {
            collection: "Element",
            fields: "?fields=*.*.*",
            filter: "&filter[status][_eq]=published"
        }
        if (this.$route.params.id) {
            params.filter = params.filter + "&filter[Model][Subcategory][_eq]=" + this.$route.params.id
        }
        if (this.$route.params.category) {
            params.filter = "&filter[Model][Subcategory][Category][_eq]=" + this.$route.params.category
        }



        await this.$store.dispatch("getCollection", params);
        await this.$store.dispatch("getHeaders", params.collection);
    },
    methods: {
        filterItems: function (arr, query) {
            return arr.filter(el => el.NumMag.includes(query));
        }
    }
}
</script>