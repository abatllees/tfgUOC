<template>
    <form @submit.prevent="cercarElements()">
        <h4 class="text-center">Lliurament de material</h4>
        <div class="form-group mb-2">
            <input type="serach" class="form-control" id="inputPassword2" placeholder="Cerca">
        </div>
        <div class="row">
            <div class="col-12 col-sm-6 my-1">
                <label for="tipusMaterial">Tipus de material:</label>
                <select class="form-control" name="tipusMaterial" id="tipusMaterial" v-model="subcategory" required>
                    <option v-for="subcategory in this.subcategory" :key="subcategory.id" :value="subcategory.id">
                        {{ subcategory }}
                    </option>
                </select>
            </div>
            <div class="col-12 col-sm-6 my-1">
                <label for="model">Model:</label>
                <select class="form-control" name="model" id="model" v-model="model" required>
                    <option v-for="model in this.model" :key="model.id" :value="model.id">{{
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
                <select class="form-control" name="destinacio" id="destinacio" v-model="delegacions">
                    <option v-for="delegacio in this.delegacions" :key="delegacio.id" :value="delegacio.ID">
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
    <ModalComponent v-if="isModalVisible" @close="closeModal" :model="this.results" />
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
            subcategory: [],
            model: [],
            numMag: null,
            numSerie: null,

            delegacions: null,
            usuariEntrega: this.$store.state.user?.first_name + " " + this.$store.state.user?.last_name,

            isModalVisible: false,

            results: [],
        }
    },
    async beforeCreate() {
        let params = {
            collection: "Subcategory",
            fields: "?fields=SubcategoryName,id",
            //filter: "&filter[status][_eq]=published&filter[Model]=" + this.model
            filter: "&filter[status][_eq]=published&sort[]=SubcategoryName"
        }

        this.subcategory = await this.$store.dispatch("getCollection", params);

        params = {
            collection: "Delegacio",
            fields: "?fields=Name, ID",
            filter: "&sort=Name"
        }
        this.delegacions = await this.$store.dispatch("getCollection", params)

    },
    methods: {
        /*async cercarElements() {

            let params = {
                collection: "Element",
                fields: "?fields=*.*.*",
                filter: "&filter[status][_eq]=published&filter[Model]=" + this.model
            }
            await this.$store.dispatch("getCollection", params);

            if (this.tipusMaterial && this.model) {
                this.isModalVisible = true;
            }
        },
        closeModal() {
            this.isModalVisible = false;
        },*/
    },
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