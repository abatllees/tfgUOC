<template>
    <h1 class="text-center">{{ msg }}</h1>
    <EasyDataTable :headers="this.headers" :items="this.$store.state.Element" alternating buttons-pagination
        :sort-by="this.sortBy" :sort-type="this.sortType">
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
        }
    },
    async beforeMount() {
        let params = {
            collection: "Element",
            fields: "?fields=*.*.*",
            filter: "&filter[status][_eq]=published&filter[Model][Subcategory][_eq]=" + this.$route.params.id
        }

        await this.$store.dispatch("getCollection", params);
        await this.$store.dispatch("getHeaders", params.collection);
    },
    methods: {
    }
}
</script>