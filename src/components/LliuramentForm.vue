<template>
    <form @submit.prevent="">
        <h4 class="text-center">Lliurament de material</h4>
        <div class="row">
            <div class="col-12 col-sm-6 my-1">
                <label for="tipusMaterial">Tipus de material:</label>
                <select class="form-control" name="tipusMaterial" id="tipusMaterial" v-model="tipusMaterial">
                    <option v-for="subcategory in this.subcategory" :key="subcategory.id" :value="subcategory.id">
                        {{ subcategory.SubcategoryName }}
                    </option>
                </select>
            </div>
            <div class="col-12 col-sm-6 my-1">
                <label for="model">Model:</label>
                <select class="form-control" name="model" id="model" v-model="model">
                    <option v-for="model in this.$store.state.Model" :key="model.id" :value="model.id">{{
                        model.ModelName
                    }}
                    </option>
                </select>
            </div>
        </div>
        <button type="submit" class="btn btn-secondary my-2" data-toggle="modal"
            data-target="#ModalAddElementLliuramentList">Cercar elements</button>
        <div class="row">
            <div class="col-12 col-sm">
                <label for="destinacio">Destinació:</label>
                <select class="form-control" name="destinacio" id="destinacio" v-model="this.destinacio">
                    <option v-for="delegacio in this.$store.state.Delegacions" :key="delegacio.id"
                        :value="delegacio.ID">
                        {{ delegacio.Name }}
                    </option>
                </select>
            </div>
            <div class="col-12 col-sm">
                <label for="dataRetorn">Data de retorn:</label>
                <input type="date" name="dataRetorn" id="dataRetorn" class="form-control"
                    v-model="this.$store.state.dataRetorn">
            </div>
        </div>

        <div class="w-100 mt-1">
            <label for="personaEntrega">Entrega:</label>
            <input type="text" class="form-control" id="personaEntrega" disabled placeholder="Usuari"
                v-model="usuariEntrega">
        </div>
    </form>
    <ModalComponent id="ModalAddElementLliuramentList">
        <template v-slot:header>
            <h6>Resultats de la cerca</h6>
        </template>
        <template v-slot:body>
            <EasyDataTable :headers="this.headers" :items="this.results" alternating buttons-pagination
                v-model:items-selected="itemsSelected" :sort-by="this.sortBy" :sort-type="this.sortType"
                :themeColor="this.$store.state.themeColor">
            </EasyDataTable>
        </template>
        <template v-slot:footer>
            <button class="btn btn-primary" @click="addElement(this.itemsSelected)" data-dismiss="modal">Afegeix
                element</button>
        </template>
    </ModalComponent>
</template>
<script>
import ModalComponent from "@/components/ModalComponent.vue"

import store from "@/store/index.js"
export default {
    name: 'LliuramentForm',
    components: {
        ModalComponent,
        EasyDataTable: window['vue3-easy-data-table'],

    },
    data() {
        return {
            tipusMaterial: null,
            subcategory: store.getters.getSubcategory,
            model: null,
            numMag: null,
            numSerie: null,
            destinacio: null,
            dataRetorn: null,

            usuariEntrega: store.state.user?.first_name + " " + store.state.user?.last_name,

            results: [],

            //MODAL START
            headers: [
                { text: "Núm. Mag", value: "NumMag", sortable: true },
                { text: "Model", value: "Model.ModelName", sortable: true },
                { text: "Número de sèrie", value: "SerialNum", sortable: true },
            ],
            sortBy: "NumMag",
            sortType: "asc",
            itemsSelected: [],
            //MODAL END
        }
    },
    watch: {
        async tipusMaterial() {
            let params = {
                collection: "Model",
                fields: "?fields=*.*.*",
                filter: "&filter[Subcategory][_eq]=" + this.tipusMaterial,
                sort: "&sort[]=ModelName",
                limit: ""
            }
            store.state.Model = await store.dispatch("getCollection", params);

            this.results = await this.searchElements()
        },
        async model() {
            this.results = await this.searchElements()
        },
        destinacio() {
            store.state.destinacio = this.destinacio
        },
        dataRetorn() {
            store.state.dataRetorn = this.dataRetorn
        }
    },
    methods: {
        addElement() {
            //Add element to list
            this.itemsSelected.forEach(item => store.state.llistatMoviment.push(item))
            this.itemsSelected = []
        },
        async searchElements() {
            let params = {
                collection: "Element",
                fields: "?fields=NumMag,Model.Subcategory.SubcategoryName,Model.Brand.BrandName,Model.ModelName,SerialNum,DelegacioActual.ID",
                filter: null,
                sort: "",
                limit: ""
            }
            if (this.model) {
                const filter = "&filter[_and][1][Model][_eq]=" + this.model
                    + "&filter[_and][2][Model][Subcategory][_eq]=" + this.tipusMaterial
                    + "&filter[DelegacioActual][_eq]=22"
                params.filter = filter
            } else {
                const filter = "&filter[_or][1][Model][_eq]=" + this.model
                    + "&filter[_or][2][Model][Subcategory][_eq]=" + this.tipusMaterial
                    + "&filter[DelegacioActual][_eq]=22"
                params.filter = filter

            }

            return await store.dispatch("getCollection", params);
        }
    },
}
</script>

<style scoped>
form {
    border: 2px solid #bb0000;
    border-right: 70px solid #bb0000;
    padding: 10px;
}
</style>