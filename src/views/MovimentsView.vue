<template>
    <h1 class="text-center">Moviments</h1>
    <EasyDataTable :headers="this.headers" :items="this.$store.state.Moviment" alternating buttons-pagination
        :sort-by="this.sortBy" :sort-type="this.sortType">
        <template v-slot:loading>
            <img src="https://i.pinimg.com/originals/94/fd/2b/94fd2bf50097ade743220761f41693d5.gif"
                style="width: 100px; height: 80px;" />
        </template>
    </EasyDataTable>
</template>
<script>

export default {
    name: "MovimentsView",
    data() {
        return {
            headers: [
                { text: "Núm. Mag", value: "Element.NumMag", sortable: true },
                { text: "Subcategoria", value: "Element.Model.Subcategory.SubcategoryName", sortable: true },
                { text: "Marca", value: "Element.Model.Brand.BrandName", sortable: true },
                { text: "Model", value: "Element.Model.ModelName", sortable: true },
                { text: "Número de sèrie", value: "Element.SerialNum", sortable: true },
                { text: "Data", value: "date_created", sortable: true },
                { text: "Realitzat per", value: "user_created.first_name", sortable: true },
                { text: "", value: "user_created.last_name", sortable: true },
                { text: "Origen", value: "Origen.Name", sortable: true },
                { text: "Destí", value: "Desti.Name", sortable: true },
            ],
            sortBy: "",
            sortType: "asc"
        }
    },

    async beforeMount() {
        let params = {
            collection: "Moviment",
            //fields: "?fields=*.*.*",
            fields: "?fields=Element.*.*.*,Origen.Name,Desti.Name,user_created.first_name,user_created.last_name,date_created",
            filter: "&filter[status][_eq]=published"
        }
        await this.$store.dispatch("getCollection", params);


        //this.headers = await this.$store.dispatch("getHeaders", params.collection);
    },
}
</script>