<template>
    <h1 class="text-center">Retorn de material</h1>
    <section class="row">
        <div class="col col-lg-3">
            <input type="text" class="form-control mb-2" name="search" placeholder="Comença a cercar"
                v-model="this.LlistatRetorn.searchValue">
        </div>
    </section>
    <section class="w-100 my-2" v-if="this.response">
        <div class="alert" v-bind:class="response.alertType">
            <ul class="list-unstyled">
                <li v-for="resposta in response.message" :key="resposta"> {{ resposta }}</li>
            </ul>
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

                response: null
            }
        }
    },
    async beforeMount() {
        this.LlistatRetorn.items = await this.elementsPendentRetorn()

        this.LlistatRetorn.loading = false
    },
    methods: {
        realitzarRetorn: async function () {
            console.log("Realitzar retorn")
            this.$store.state.destinacio = 22
            this.$store.dispatch("realitzarMoviment", this.LlistatRetorn.itemsSelected);
            this.response = await this.$store.dispatch("handlingError", this.LlistatRetorn.itemsSelected)
            this.LlistatRetorn.items = await this.elementsPendentRetorn()
        },
        elementsPendentRetorn: async function () {
            let payload = {
                collection: "Element",
                fields: "?fields=NumMag,Model.Subcategory.SubcategoryName,Model.Brand.BrandName,Model.ModelName,SerialNum,DelegacioActual.ID,DelegacioActual.Name",
                filter: "&filter[DelegacioActual][_neq]=22",
                sort: ""
            }
            return await this.$store.dispatch("getCollection", payload)
        }
    }
}
</script>

<style>

</style>