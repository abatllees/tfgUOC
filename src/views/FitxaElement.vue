<template>
    <section class="row">
        <div class="col-12 col-sm col-lg-9">
            <h1>{{ element.Model.Subcategory.SubcategoryName }} {{ element.Model.Brand.BrandName }} {{
        element.Model.ModelName
}} </h1>
            <form @submit.prevent="UpdateElement()">
                <div class="row">
                    <div class="col">
                        <label for="NumMag">Número de magatzem:</label>
                        <input type="text" name="NumMag" id="NumMag" class="form-control" v-model="NumMag" disabled>
                    </div>
                    <div class="col">
                        <label for="SerialNum">Número de sèrie:</label>
                        <input type="text" name="SerialNum" id="SerialNum" class="form-control" :value=element.SerialNum
                            disabled>
                    </div>
                </div>
                <label for="responsable">Responsable:</label>
                <input type="text" name="responsable" id="responsable" class="form-control" disabled>
                <label for="status">Estat:</label>
                <select name="status" id="status" class="form-control" disabled v-model="status">
                    <option v-for="state in this.statusValues.meta.display_options.choices" :value="state.value"
                        :key="state">
                        {{ state.text }}
                    </option>
                </select>
                <label for="observations">Observacions:</label>
                <textarea class="form-control" name="observations" id="observations" v-model="element.Observacions"
                    disabled></textarea>
                <button type="submit" class="btn btn-primary my-2" v-show="editMode">Desa els canvis</button>
            </form>
            <button class="btn btn-secondary my-2" @click="EditElement()" v-show="!editMode">Edita</button>
            <div class="alert" v-if="response" v-bind:class="alertType">
                {{ responseMessage }}
            </div>
        </div>
        <div class="col-12 col-lg">
            <img src="" alt="Imatge del model" class="img">
        </div>
    </section>
    <section class="row">
        <div class="col-12 col-lg">
            <h6>Historial de moviments</h6>
            <EasyDataTable :headers="this.historialMoviments.headers" :items="this.historialMoviments.items" alternating
                buttons-pagination :sort-by="this.historialMoviments.sortBy"
                :sort-type="this.historialMoviments.sortType" :theme-color="this.$store.state.themeColor"
                :loading="this.historialMoviments.loading">
            </EasyDataTable>
        </div>
        <div class="col-12 col-lg">
            <h6>Incidències</h6>
            <EasyDataTable :headers="this.incidencies.headers" :items="this.incidencies.items" alternating
                buttons-pagination :sort-by="this.incidencies.sortBy" :sort-type="this.incidencies.sortType"
                :theme-color="this.$store.state.themeColor">
            </EasyDataTable>
            <button class="btn btn-primary mt-1">Crear incidència</button>
        </div>
        <div class="col-12 col-lg">
            <h6>Equips assignats</h6>
            <EasyDataTable :headers="this.accessoris.headers" :items="this.accessoris.items" alternating
                buttons-pagination :sort-by="this.accessoris.sortBy" :sort-type="this.accessoris.sortType"
                :theme-color="this.$store.state.themeColor">
            </EasyDataTable>
            <button class="btn btn-primary mt-1">Gestionar accessoris</button>
        </div>
    </section>
</template>
<script>
export default {
    name: "FitxaElement",
    data() {
        return {
            element: null,
            statusValues: null,

            NumMag: "",
            status: "",
            observacions: "",

            editMode: false,

            response: null,
            responseMessage: "",

            alertType: "",

            historialMoviments: {
                headers: [
                    { text: "Data", value: "date_created", sortable: true },
                    { text: "Origen", value: "Origen.Name", sortable: true },
                    { text: "Destí", value: "Desti.Name", sortable: true },
                    { text: "Realitzat per", value: "user_created.first_name", sortable: true },
                ],
                items: [],
                sortBy: "",
                sortType: "asc",
                loading: true
            },
            incidencies: {
                headers: [
                    { text: "Data", value: "date_created", sortable: true },
                    { text: "OPI", value: "Origen.Name", sortable: true },
                    { text: "Estat", value: "Desti.Name", sortable: true },
                    { text: "Registrada per", value: "user_created.first_name", sortable: true },
                ],
                items: [],
                sortBy: "",
                sortType: "asc"
            },
            accessoris: {
                headers: [
                    { text: "Model", value: "Model.Subcategory.SubcategoryName", sortable: true },
                    { text: "Model", value: "Model.ModelName", sortable: true },
                    { text: "Número de sèrie", value: "SerialNum", sortable: true },
                ],
                items: [],
                sortBy: "",
                sortType: "asc"
            }
        }
    },
    async beforeMount() {
        let params = {
            collection: "Element",
            item: this.$route.params.SerialNum,
            fields: "?fields=*.*.*",
            filter: ""
        }
        this.element = await this.$store.dispatch("getElement", params)

        //Obté els possibles valors del desplegable
        let payload = {
            collection: "Element",
            field: "status"
        }
        this.statusValues = await this.$store.dispatch("getFields", payload)
        console.log(this.statusValues)


        //Obtenir els moviments de l'element
        payload = {
            collection: "Moviment",
            fields: "?fields=Element,date_created,Origen.Name,Desti.Name,user_created.first_name,user_created.last_name",
            filter: "&filter[status][_eq]=published&filter[Element][_eq]=" + this.$route.params.SerialNum,
            sort: ""
        }
        this.historialMoviments.items = await this.getItems(payload)
        this.historialMoviments.loading = !this.historialMoviments.loading

        //Obtenir els accessoris
        payload = {
            collection: "Element",
            fields: "?fields=*.*.*",
            filter: "&filter[status][_eq]=published&filter[ElementPare][_eq]=" + this.$route.params.SerialNum,
            sort: ""
        }

        this.status = this.element.status
        this.NumMag = this.element.NumMag
        this.observacions = this.element.Observacions
    },
    methods: {
        getItems: function (payload) {
            return this.$store.dispatch("getCollection", payload)
        },
        EditElement: function () { //Desactiva tots els elements del formulari per poder-los modificar
            document.getElementById("NumMag").disabled = false;
            //document.getElementById("SerialNum").disabled = false;
            //document.getElementById("responsable").disabled = false;
            document.getElementById("status").disabled = false;
            document.getElementById("observations").disabled = false;

            this.editMode = true
        },
        UpdateElement: async function () {
            document.getElementById("NumMag").disabled = true;
            //document.getElementById("SerialNum").disabled = true;
            //document.getElementById("responsable").disabled = true;
            document.getElementById("status").disabled = true;
            document.getElementById("observations").disabled = true;

            this.editMode = false

            let payload = {
                collection: "Element",
                SerialNum: this.$route.params.SerialNum,
                NumMag: this.NumMag,
                status: this.status,
                observacions: this.observacions
            }
            this.response = await this.$store.dispatch("updateItem", payload)

            this.responseMessage = ""
            //Comprova el codi d'error per prendre una acció o una altra
            switch (this.response.status) {
                case 403: {
                    this.alertType = "alert-danger"
                    //Genera un string amb tots els errors que retorna la API
                    for (let error = 0; error < this.response.data.errors.length; error++) {
                        this.responseMessage += this.response.data.errors[error].message;
                    }
                    break;
                }

                case 200: {
                    this.alertType = "alert-success"
                    this.responseMessage = "Element actualtizat amb èxit"
                    break;
                }

                default:
                    break;
            }
        },
    }
}
</script>
<style scoped>
.dot {
    height: 15px;
    width: 15px;
    background-color: #027505;
    border-radius: 50%;
    display: inline-block;
}
</style>