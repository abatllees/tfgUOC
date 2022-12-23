<template>
    <h1 class="text-center">Retorn de material</h1>
    <section class="row">
        <div class="col col-lg-3">
            <input type="text" class="form-control mb-2" name="search" placeholder="Comença a cercar"
                v-model="this.LlistatRetorn.searchValue">
        </div>
    </section>
    <section class="row">
        <div class="col">
            <EasyDataTable :headers="this.LlistatRetorn.headers" :items="this.LlistatRetorn.items" alternating
                buttons-pagination v-model:items-selected="this.LlistatRetorn.itemsSelected"
                :sort-by="this.LlistatRetorn.sortBy" :sort-type="this.LlistatRetorn.sortType"
                :loading="this.LlistatRetorn.loading" :theme-color="this.$store.state.themeColor"
                :search-value="this.LlistatRetorn.searchValue">
            </EasyDataTable>
        </div>
    </section>
    <button class="btn btn-primary my-2" @click="realitzarRetorn(this.LlistatRetorn.itemsSelected)">Retornar material
        seleccionat</button>
    {{ LlistatRetorn.itemsSelected }}
</template>

<script>
export default {
    name: "RetornView",
    components: {

    },
    data() {
        return {
            LlistatRetorn: {
                headers: [
                    { text: "Núm. Mag", value: "NumMag", sortable: true },
                    { text: "Subcategoria", value: "Model.Subcategory.SubcategoryName", sortable: true },
                    { text: "Marca", value: "Model.Brand.BrandName", sortable: true },
                    { text: "Model", value: "Model.ModelName", sortable: true },
                    { text: "Número de sèrie", value: "SerialNum", sortable: true },
                    { text: "Delegació actual", value: "DelegacioActual.Name", sortable: true },
                ],
                items: [],
                itemsSelected: [],
                searchValue: "",
                sortBy: "",
                sortType: "asc",
                loading: true,
            }
        }
    },
    async beforeMount() {
        let payload = {
            collection: "Element",
            fields: "?fields=*.*.*",
            filter: "&filter[status][_eq]=published&filter[DelegacioActual][_neq]=22",
            sort: ""
        }
        this.LlistatRetorn.items = await this.$store.dispatch("getCollection", payload)
        this.LlistatRetorn.loading = false
    },
    methods: {
        realitzarRetorn: function () {
            console.log("Realitzar retorn")
            this.$store.state.destinacio = 22
            this.$store.dispatch("realitzarMoviment", this.LlistatRetorn.itemsSelected);
        }
    }
}
</script>

<style>

</style>