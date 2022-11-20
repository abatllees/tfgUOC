<template>
    <form @submit.prevent="searchElement()">
        <h4 class="text-center">Lliurament de material</h4>
        <div class="form-group mb-2">
            <input type="serach" class="form-control" id="inputPassword2" placeholder="Cerca">
        </div>
        <div class="row">
            <div class="col-12 col-sm-6 my-1">
                <label for="tipusMaterial">Tipus de material:</label>
                <select class="form-control" name="tipusMaterial" id="tipusMaterial" v-model="tipusMaterial" required>
                    <option v-for="subcategory in this.$store.state.Subcategory" :key="subcategory.id"
                        :value="subcategory.id">{{
                                subcategory.SubcategoryName
                        }}
                    </option>
                </select>
            </div>
            <div class="col-12 col-sm-6 my-1">
                <label for="model">Model:</label>
                <select class="form-control" name="model" id="model" v-model="model" required>
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
        <button type="button" class="btn btn-secondary my-2" @click="showModal">Cercar elements</button>
        <div class="row">
            <div class="col-12 col-sm-6">
                <label for="destinacio">Destinació:</label>
                <select class="form-control" name="destinacio" id="destinacio" v-model="destinacio">
                    <option value="Vielha">Vielha</option>
                    <option value="Maresme">Maresme</option>
                    <option value="Pirineus">Pirineus</option>
                </select>
            </div>
            <div class="col-12 col-sm-6">
                <label for="personaEntrega">Entrega:</label>
                <input type="text" class="form-control" id="personaEntrega" disabled placeholder="Usuari"
                    v-model="usuari">
            </div>
        </div>
        <input type="submit" value="Afegir a la llista" class="btn btn-primary my-2">
    </form>
    <ModalComponent :header="'Hola'" v-show="isModalVisible" @close="closeModal" :model="this.$store.state.Element" />
</template>
<script>
import ModalComponent from "@/components/ModalComponent.vue"
export default {
    name: 'LliuramentForm',
    components: {
        ModalComponent
    },
    data() {
        return {
            tipusMaterial: null,
            model: null,
            numMag: null,
            numSerie: null,
            destinacio: null,
            usuari: null,

            isModalVisible: false,

            results: null
        }
    },
    watch: {
        tipusMaterial() {
            console.log(this.tipusMaterial)
            let params = {
                collection: "Model",
                fields: "?fields=*.*",
                filter: "&filter[Subcategory][_eq]=" + this.tipusMaterial
            }

            this.$store.dispatch("getCollection", params);
        },
        async model() {
            let params = {
                collection: "Element",
                fields: "?fields=NumMag,SerialNum",
                filter: "&filter[Model][_eq]=" + this.model
            }

            await this.$store.dispatch("getCollection", params);
            console.log("Results", this.$store.state.Element)
        }
    },
    beforeMount() {

        let params = {
            collection: "Subcategory",
            fields: "?fields=*.*",
            filter: "&filter[status][_eq]=published"
        }

        this.$store.dispatch("getCollection", params);
    },
    mounted() {
        this.tipusMaterial = this.$store.state.Subcategory
    },
    methods: {
        addToList: function () {
            console.log(this.tipusMaterial)
        },
        searchElement: function () {
            console.log(this.tipusMaterial)
            console.log(this.model)
        },
        showModal() {
            this.isModalVisible = true;
        },
        closeModal() {
            this.isModalVisible = false;
        }
    }
}
</script>

<style scoped>
form {
    border: 2px solid #bb0000;
    border-right: 70px solid #bb0000;
    padding: 10px;
}

hr {
    height: 5px;
    background-color: black;
}
</style>