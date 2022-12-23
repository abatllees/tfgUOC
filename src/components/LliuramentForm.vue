<template>
    <form @submit.prevent="cercarElements()">
        <h4 class="text-center">Lliurament de material</h4>
        <div class="form-group mb-2">
            <input type="serach" class="form-control" id="inputPassword2" placeholder="Cerca">
        </div>
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
        <div class="row">
            <div class="col-12 col-sm-6 my-1">
                <label for="numMag">Número de magatzem:</label>
                <input type="text" class="form-control" id="numMag" v-model="numMag">
            </div>
            <div class="col-12 col-sm-6 my-1">
                <label for="numSerie">Número de sèrie:</label>
                <input type="text" class="form-control" id="numSerie" v-model="numSerie">
            </div>
        </div>
        <button type="submit" class="btn btn-secondary my-2" data-toggle="modal"
            data-target="#ModalAddElementLliuramentList">Cercar elements</button>
        <div class="row">
            <div class="col-12 col-sm">
                <label for="personaEntrega">Entrega:</label>
                <input type="text" class="form-control" id="personaEntrega" disabled placeholder="Usuari"
                    v-model="usuariEntrega">
            </div>
        </div>
    </form>
    <ModalComponent id="ModalAddElementLliuramentList">
        <template v-slot:header>
            <h6>Resultats de la cerca</h6>
        </template>
        <template v-slot:body>
            <EasyDataTable :headers="this.headers" :items="this.results" alternating buttons-pagination
                v-model:items-selected="itemsSelected" :sort-by="this.sortBy" :sort-type="this.sortType">
            </EasyDataTable>
        </template>
        <template v-slot:footer>
            <button class="btn btn-primary" @click="addElement(this.itemsSelected)">Afegeix element</button>
        </template>
    </ModalComponent>
</template>
<script>
import ModalComponent from "@/components/ModalComponent.vue"
export default {
    name: 'LliuramentForm',
    components: {
        ModalComponent,
        EasyDataTable: window['vue3-easy-data-table'],

    },
    data() {
        return {
            tipusMaterial: null,
            subcategory: this.$store.state.Subcategory,
            model: null,
            numMag: null,
            numSerie: null,

            usuariEntrega: this.$store.state.user?.first_name + " " + this.$store.state.user?.last_name,

            isModalVisible: false,

            results: [],

            //MODAL START
            headers: [
                { text: "Núm. Mag", value: "NumMag", sortable: true },
                { text: "Model", value: "Model.ModelName", sortable: true },
                { text: "Número de sèrie", value: "SerialNum", sortable: true },
                { text: "Delegació", value: "DelegacioActual.Name", sortable: true },
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
                filter: "&filter[status][_eq]=published&filter[Subcategory][_eq]=" + this.tipusMaterial,
                sort: "&sort[]=ModelName"
            }
            this.$store.state.Model = await this.$store.dispatch("getCollection", params);
        },
        async model() {
            let params = {
                collection: "Element",
                fields: "?fields=NumMag,Model.Subcategory.SubcategoryName,Model.Brand.BrandName,Model.ModelName,SerialNum,DelegacioActual.Name,DelegacioActual.ID",
                filter: "&filter[status][_eq]=published&filter[Model][_eq]=" + this.model,
                sort: ""
            }
            this.results = await this.$store.dispatch("getCollection", params);
        }
    },
    methods: {
        addElement(itemsSelected) {
            //Add element to list
            console.log(itemsSelected)
            this.itemsSelected.forEach(item => this.$store.state.llistatMoviment.push(item))
            this.itemsSelected = []
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