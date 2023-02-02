<template>
    <h1 class="text-center">Entrada de material</h1>
    <section class="row">
        <div class="col col-lg-3">
            <input type="text" class="form-control mb-2" name="search" placeholder="Comença a cercar"
                v-model="LlistatRetorn.searchValue">
        </div>
    </section>
    <section class="w-100 my-2" v-if="LlistatRetorn.response">
        <div class="alert" v-bind:class="LlistatRetorn.response.alertType">
            <ul class="list-unstyled">
                <li v-for="resposta in LlistatRetorn.response.message" :key="resposta"> {{ resposta }}</li>
            </ul>
        </div>
    </section>
    <section class="w-100">
        <EasyDataTable :headers="LlistatRetorn.headers" :items="LlistatRetorn.items" alternating buttons-pagination
            v-model:items-selected="LlistatRetorn.itemsSelected" :sort-by="LlistatRetorn.sortBy"
            :sort-type="LlistatRetorn.sortType" :loading="LlistatRetorn.loading" :theme-color="$store.state.themeColor"
            :search-value="LlistatRetorn.searchValue" :table-node-id="LlistatRetorn.tableID">
        </EasyDataTable>
    </section>
    <button class="btn btn-primary my-2" @click="realitzarRetorn(LlistatRetorn.itemsSelected)">Retornar material
        seleccionat</button>
</template>

<script>
import store from "@/store/index.js"
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
                tableID: "TaulaRetorn",
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
            //const destinacio = 22

            //Buscar a la taula de moviments el darrer moviment de l'element seleccionat i comprovar si és vigent
            for (const elementARetornar of this.LlistatRetorn.itemsSelected) {
                let found = await this.comprovarPrestec(elementARetornar)
                //Si és vigent actualitzar-lo a no vigent (és préstec. Al actualitzar-lo ja no surt a la llista de pendent de retorn)

                if (found.length) {
                    let payload = {
                        collection: "Moviment",
                        item: found[0].id,
                        data: {
                            MovimentVigent: false
                        }
                    }
                    const eliminarVigencia = await store.dispatch("updateItem", payload)
                    console.log(await store.dispatch("handlingError", eliminarVigencia))
                }
                //Si no és vigent (no és préstec) no cal fer res 
            }
            //Realitzar el moviment dels elements seleccionats
            const response = await store.dispatch("realitzarMoviment", {
                items: this.LlistatRetorn.itemsSelected,
                destinacio: 22
            });
            console.log("RESPONSE ENTRADA", response)
            this.LlistatRetorn.response = await store.dispatch("handlingError", response)

            //Genera l'informe PDF si el resultat és correcte
            if (response.status == 200) {
                const data = {
                    tipusMoviment: "Entrada de material",
                    realitzatPer: store.getters.getUser.first_name + " " + store.getters.getUser.last_name,
                    dataMoviment: new Date(),
                    destinacio: 22,
                    table: this.LlistatRetorn.tableID,
                }
                store.dispatch("exportPDF", data)
                //this.taulaLliurament.items = []
                this.dataRetorn = null
            }
            this.resultatMoviment = await this.$store.dispatch("handlingError", response)
            this.LlistatRetorn.loading = true
            this.LlistatRetorn.items = await this.elementsPendentRetorn()
            this.LlistatRetorn.loading = false

        },
        elementsPendentRetorn: async function () {
            let payload = {
                collection: "Element",
                fields: "?fields=NumMag,Model.Subcategory.SubcategoryName,Model.Brand.BrandName,Model.ModelName,SerialNum,DelegacioActual.ID,DelegacioActual.Name",
                filter: "&filter[DelegacioActual][_neq]=22",
                sort: "",
                limit: ""
            }
            const LlistatPendentRetorn = await store.dispatch("getCollection", payload)
            return LlistatPendentRetorn.data.data
        },
        comprovarPrestec: async function (element) {
            let payload = {
                collection: "Moviment",
                fields: "?fields=Element,MovimentVigent,id",
                filter: "&filter[MovimentVigent][_eq]=true&filter[Element][_eq]=" + element.SerialNum,
                sort: "",
                limit: ""
            }
            const ComprovarPrestec = await store.dispatch("getCollection", payload)
            return ComprovarPrestec.data.data
        }
    }
}
</script>