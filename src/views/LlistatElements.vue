<template>
    <h1 class="text-center">{{ title }}</h1>
    <section class="row justify-content-end">
        <div class="col col-md-3 mb-2">
            <label for="site-search">Comença a cercar:</label>
            <input type="text" id="site-search" name="q" class="form-control" v-model="this.searchValue">
        </div>
    </section>
    <EasyDataTable :headers="this.headers" :items="this.llistatElement" alternating buttons-pagination
        :search-value="searchValue" :sort-by="this.sortBy" :sort-type="this.sortType" :loading="this.loading"
        :theme-color="this.$store.state.themeColor" @click-row="showDetail">
    </EasyDataTable>
    <router-link to="CrearElement" class="btn btn-primary my-2" replace>
        Crear un nou element
    </router-link>
</template>
<script>
export default {
    name: "LlistatElements",
    components: {

    },
    props: {
        category: String,
        id: String,
    },
    data() {
        return {
            headers: [
                { text: "Estat", value: "status", sortable: true },
                { text: "Núm. Mag", value: "NumMag", sortable: true },
                { text: "Subcategoria", value: "Model.Subcategory.SubcategoryName", sortable: true },
                { text: "Marca", value: "Model.Brand.BrandName", sortable: true },
                { text: "Model", value: "Model.ModelName", sortable: true },
                { text: "Número de sèrie", value: "SerialNum", sortable: true },
                { text: "Delegació actual", value: "DelegacioActual.Name", sortable: true },
                { text: "Observacions", value: "Observacions", sortable: true },
            ],
            sortBy: "NumMag",
            sortType: "asc",
            searchValue: "",
            llistatElement: [],

            title: "Títol",

            loading: true,
        }
    },
    async beforeMount() {
        let params = {
            collection: "Element",
            fields: "?fields=*.*.*",
            filter: "",
            sort: "",
            limit: ""
        }
        //Resultats de la cerca
        if (this.$store.state.NavQuery) {
            params = this.$store.state.NavQuery
            params.limit = "&limit=-1"
            this.title = "Resultats de la cerca"
        }

        if (this.$route.params.id) {
            params.filter = "&filter[Model][Subcategory][_eq]=" + this.$route.params.id
            const response = await this.getTitle("Subcategory", this.$route.params.id)
            this.title = response.SubcategoryName
        }
        if (this.$route.params.category) {
            params.filter = "&filter[Model][Subcategory][Category][_eq]=" + this.$route.params.category
            const response = await this.getTitle("Category", this.$route.params.category)
            this.title = response.CategoryName

        }
        if (this.$route.params.model) {
            params.filter = "&filter[Model][[_eq]=" + this.$route.params.model
            const response = await this.getTitle("Model", this.$route.params.model)
            this.title = response.ModelName

        }
        this.llistatElement = await this.$store.dispatch("getCollection", params)
        this.loading = false
    },
    methods: {
        showDetail: function (element) {
            console.log(element.SerialNum)
            this.$router.push({ name: 'Fitxa', params: { SerialNum: element.SerialNum } })
        },
        getTitle: async function (collection, key) {
            let params = {
                collection: collection,
                item: key,
                fields: "?fields=*",
                filter: "&filter[Category][_eq]=" + this.$route.params.id,
                sort: "",
                limit: ""
            }
            return await this.$store.dispatch("getElement", params);
        }
    }
}
</script>