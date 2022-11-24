<template>
    <form @submit.prevent="realitzarLliurament()">
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
        <button type="submit" class="btn btn-secondary my-2">Cercar elements</button>
        <div class="row">
            <div class="col-12 col-sm-6">
                <label for="destinacio">Destinació:</label>
                <select class="form-control" name="destinacio" id="destinacio" v-model="this.$store.state.destinacio">
                    <option v-for="delegacio in this.$store.state.Delegacio" :key="delegacio.id" :value="delegacio.ID">
                        {{
                                delegacio.Name
                        }}
                    </option>
                </select>
            </div>
            <div class="col-12 col-sm-6">
                <label for="personaEntrega">Entrega:</label>
                <input type="text" class="form-control" id="personaEntrega" disabled placeholder="Usuari"
                    v-model="usuariEntrega">
            </div>
        </div>
    </form>
    <ModalComponent v-if="isModalVisible" @close="closeModal" :model="this.$store.state.ResultatCerca" />
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
            usuariEntrega: this.$store.state.user?.first_name + " " + this.$store.state.user?.last_name,

            isModalVisible: false,

            results: null,
        }
    },
    watch: {
        async tipusMaterial() {
            let params = {
                collection: "Model",
                fields: "?fields=*.*",
                filter: "&filter[Subcategory][_eq]=" + this.tipusMaterial
            }

            await this.$store.dispatch("getCollection", params);
        },
        async model() {
            let params = {
                collection: "Element",
                fields: "?fields=NumMag,SerialNum",
                filter: "&filter[Model][_eq]=" + this.model
            }

            await this.$store.dispatch("getCollection", params);
        }
    },
    async beforeMount() {
        const collectionsToGet = ["Subcategory", "Delegacio"]

        for await (let collection of collectionsToGet) {
            let params = {
                collection: collection,
                fields: "?fields=*.*",
                filter: "&filter[status][_eq]=published"
            }
            this.$store.dispatch("getCollection", params);
        }
    },
    mounted() {
        this.tipusMaterial = this.$store.state.Subcategory
    },
    methods: {
        realitzarLliurament() {
            if (this.tipusMaterial && this.model) {
                this.isModalVisible = true;

            }
        },
        closeModal() {
            this.isModalVisible = false;
        },
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