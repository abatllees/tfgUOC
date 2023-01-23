<template>
    <section class="row">
        <div class="col-12 col-sm-8 col-lg-5 mx-auto form">
            <form @submit.prevent="">
                <h4 class="text-center">Lliurament de material</h4>
                <div class="row">
                    <div class="col-12 col-sm-6 my-1">
                        <label for="tipusMaterial">Tipus de material:</label>
                        <select class="form-control" name="tipusMaterial" id="tipusMaterial"
                            v-model="SubcategorySelected">
                            <option v-for="subcategory in SubcategoryList" :key="subcategory.id"
                                :value="subcategory.id">
                                {{ subcategory.SubcategoryName }}
                            </option>
                        </select>
                    </div>
                    <div class="col-12 col-sm-6 my-1">
                        <label for="model">Model:</label>
                        <select class="form-control" name="model" id="model" v-model="ModelSelected">
                            <option v-for="model in ModelList" :key="model.id" :value="model.id">{{
                                model.ModelName
                            }}
                            </option>
                        </select>
                    </div>
                </div>
                <button type="submit" class="btn btn-secondary my-2" data-toggle="modal"
                    data-target="#ModalAddElementLliuramentList">Cercar elements</button>
            </form>
            <div class="row">
                <div class="col-12 col-sm">
                    <label for="destinacio">Destinació:</label>
                    <select class="form-control" name="destinacio" id="destinacio" v-model="DestinationSelected">
                        <option v-for="delegacio in DestinationList" :key="delegacio.id" :value="delegacio.ID">
                            {{ delegacio.Name }}
                        </option>
                    </select>
                </div>
                <div class="col-12 col-sm">
                    <label for="dataRetorn">Data de retorn:</label>
                    <input type="date" name="dataRetorn" id="dataRetorn" class="form-control" v-model="dataRetorn">
                </div>
            </div>

            <div class="w-100 mt-1">
                <label for="personaEntrega">Entrega:</label>
                <input type="text" class="form-control" id="personaEntrega" disabled placeholder="Usuari"
                    v-model="usuariEntrega">
            </div>
        </div>
    </section>
    <section class="w-100 my-2" v-if="resultatMoviment">
        <div class="alert" v-bind:class="resultatMoviment.alertType">
            <ul class="list-unstyled">
                <li v-for="resposta in resultatMoviment.message" :key="resposta"> {{ resposta }}</li>
            </ul>
        </div>
    </section>
    <section class="w-100 my-5">
        <EasyDataTable :headers="taulaLliurament.headers" :items="taulaLliurament.items" alternating buttons-pagination
            :sort-by="taulaLliurament.sortBy" :sort-type="taulaLliurament.sortType" :theme-color="themeColor"
            :table-node-id="taulaLliurament.tableID">
            <template #item-operation="item">
                <div class="operation-wrapper">
                    <i class="bi bi-trash" style="font-size: 1rem" @click="deleteItem(item)"></i>
                </div>
            </template>
        </EasyDataTable>
        <button class="btn btn-primary mt-3" @click="realitzarLliurament()">Realitzar lliurament</button>
    </section>

    <ModalComponent id="ModalAddElementLliuramentList">
        <template v-slot:header>
            <h6>Resultats de la cerca</h6>
        </template>
        <template v-slot:body>
            <EasyDataTable :headers="taulaResultat.headers" :items="taulaResultat.items" alternating buttons-pagination
                v-model:items-selected="taulaResultat.itemsSelected" :sort-by="taulaResultat.sortBy"
                :sort-type="taulaResultat.sortType" :themeColor="themeColor">
            </EasyDataTable>
        </template>
        <template v-slot:footer>
            <button class="btn btn-primary" @click="addElement(this.itemsSelected)" data-dismiss="modal">Afegeix
                element</button>
        </template>
    </ModalComponent>
</template>
<script>
import ModalComponent from '@/components/ModalComponent.vue';
import store from "@/store/index.js"


export default {
    name: "LliuramentView",
    components: {
        ModalComponent
    },
    data() {
        return {
            SubcategorySelected: null,
            ModelSelected: null,
            ModelList: [],

            DestinationSelected: null,

            dataRetorn: null,

            taulaLliurament: {
                headers: [
                    { text: "Tipus de material", value: "Model.Subcategory.SubcategoryName", sortable: true },
                    { text: "Marca", value: "Model.Brand.BrandName", sortable: true },
                    { text: "Model", value: "Model.ModelName", sortable: true },
                    { text: "Núm. Mag", value: "NumMag", sortable: true },
                    { text: "Número de sèrie", value: "SerialNum", sortable: true },
                    { text: "Accions", value: "operation" },
                ],
                sortBy: "NumMag",
                sortType: "asc",
                items: [],
                itemsSelected: [],
                tableID: "TaulaLliuramentVar",
            },
            taulaResultat: {
                headers: [
                    { text: "Marca", value: "Model.Brand.BrandName", sortable: true },
                    { text: "Model", value: "Model.ModelName", sortable: true },
                    { text: "Núm. Mag", value: "NumMag", sortable: true },
                    { text: "Número de sèrie", value: "SerialNum", sortable: true },
                ],
                sortBy: "NumMag",
                sortType: "asc",
                items: [],
                itemsSelected: [],
            },


            resultatMoviment: null,
        }
    },
    computed: {
        usuariEntrega() {
            return store.getters.getUser.first_name + " " + store.getters.getUser.last_name
        },
        SubcategoryList() {
            return store.getters.getSubcategory
        },
        themeColor() {
            return store.getters.getThemeColor
        },
        DestinationList() {
            return store.getters.getDelegacions
        }
    },
    watch: {
        async SubcategorySelected() {
            let params = {
                collection: "Model",
                fields: "?fields=*.*.*",
                filter: "&filter[Subcategory][_eq]=" + this.SubcategorySelected,
                sort: "&sort[]=ModelName",
                limit: ""
            }
            this.ModelList = await this.$store.dispatch("getCollection", params)
            this.taulaResultat.items = await this.searchElements()
        },
        async ModelSelected() {
            this.taulaResultat.items = await this.searchElements()
        }
    },
    methods: {
        addElement() {
            this.taulaResultat.itemsSelected.forEach(item => this.taulaLliurament.items.push(item))
            this.taulaResultat.itemsSelected = []
        },
        realitzarLliurament: async function () {
            console.log("Realitzar lliurament")
            const response = await this.$store.dispatch("realitzarMoviment", {
                items: this.taulaLliurament.items,
                destinacio: this.DestinationSelected,
                dataRetorn: this.dataRetorn
            });
            //Genera l'informe PDF si el resultat és correcte
            if (response.status == 200) {
                const data = {
                    tipusMoviment: "Lliurament de material",
                    realitzatPer: this.usuariEntrega,
                    dataMoviment: new Date(),
                    destinacio: this.DestinationSelected,
                    table: this.taulaLliurament.tableID,
                    dataRetorn: this.dataRetorn
                }
                store.dispatch("exportPDF", data)
                //this.taulaLliurament.items = []
                this.dataRetorn = null
            }
            this.resultatMoviment = await this.$store.dispatch("handlingError", response)
        },
        deleteItem(item) {
            const findItem = this.taulaLliurament.items.find(e => e.SerialNum == item.SerialNum);
            const index = this.taulaLliurament.items.indexOf(findItem);
            this.taulaLliurament.items.splice(index, 1)
        },
        async searchElements() {
            let params = {
                collection: "Element",
                fields: "?fields=NumMag,Model.Subcategory.SubcategoryName,Model.Brand.BrandName,Model.ModelName,SerialNum,DelegacioActual.ID",
                filter: null,
                sort: "",
                limit: ""
            }
            if (this.ModelSelected) {
                const filter = "&filter[_and][1][Model][_eq]=" + this.ModelSelected
                    + "&filter[_and][2][Model][Subcategory][_eq]=" + this.SubcategorySelected
                    + "&filter[DelegacioActual][_eq]=22"
                params.filter = filter
            } else {
                const filter = "&filter[_or][1][Model][_eq]=" + this.ModelSelected
                    + "&filter[_or][2][Model][Subcategory][_eq]=" + this.SubcategorySelected
                    + "&filter[DelegacioActual][_eq]=22"
                params.filter = filter

            }

            return await store.dispatch("getCollection", params);
        }
    },
}

</script>