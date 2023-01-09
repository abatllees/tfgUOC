<template>
    <h1 class="text-center">Entrada de material</h1>
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
                sortBy: "NumMag",
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
            //Buscar a la taula de moviments el darrer moviment de l'element seleccionat i comprovar si és vigent

            for (const elementARetornar of this.LlistatRetorn.itemsSelected) {
                let found = await this.comprovarPrestec(elementARetornar)
                //Si és vigent actualitzar-lo a no vigent (és préstec. Al actualitzar-lo ja no surt a la llista de pendent de retorn)

                if (found.length) {
                    let payload = {
                        collection: "Moviment",
                        item: found[0].id,
                        MovimentVigent: false
                    }
                    let eliminarVigencia = await this.$store.dispatch("updateItem", payload)
                    console.log(await this.$store.dispatch("handlingError", eliminarVigencia))
                }
                //Si no és vigent no cal fer res (no és préstec)

            }
            //Realitzar el moviment dels elements seleccionats
            const response = await this.$store.dispatch("realitzarMoviment", this.LlistatRetorn.itemsSelected);
            console.log("RESPONSE ENTRADA", response)
            this.response = await this.$store.dispatch("handlingError", response)

            if (response.status == 200) {
                const data = {
                    tipusMoviment: "Entrada de material",
                    realitzatPer: this.$store.state.user.first_name + " " + this.$store.state.user.last_name,
                    dataMoviment: new Date(),
                    destinacio: 22,
                    table: {
                        headers: this.LlistatRetorn.headers,
                        data: this.LlistatRetorn.itemsSelected
                    }
                }
                this.$store.dispatch("exportPDF", data)
                this.$store.state.llistatMoviment = []
            }
            this.LlistatRetorn.items = []
            this.LlistatRetorn.loading = true
            this.LlistatRetorn.items = await this.elementsPendentRetorn()
            this.LlistatRetorn.loading = false

        },
        elementsPendentRetorn: async function () {
            let payload = {
                collection: "Element",
                fields: "?fields=NumMag,Model.Subcategory.SubcategoryName,Model.Brand.BrandName,Model.ModelName,SerialNum,DelegacioActual.ID,DelegacioActual.Name",
                filter: "&filter[DelegacioActual][_neq]=22",
                sort: ""
            }
            return await this.$store.dispatch("getCollection", payload)
        },
        comprovarPrestec: async function (element) {
            let payload = {
                collection: "Moviment",
                fields: "?fields=Element,MovimentVigent,id",
                filter: "&filter[MovimentVigent][_eq]=true&filter[Element][_eq]=" + element.SerialNum,
                sort: ""
            }
            return await this.$store.dispatch("getCollection", payload)
        }
    }
}
</script>

<style>

</style>