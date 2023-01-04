<template>
    <section class="row">
        <div class="col-12 col-sm col-lg-9">
            <h1>{{ element?.Model.Subcategory.SubcategoryName }} {{ element?.Model.Brand.BrandName }} {{
        element?.Model.ModelName
}} </h1>
            <form @submit.prevent="UpdateElement()">
                <div class="row">
                    <div class="col-12 col-sm-4">
                        <label for="NumMag">Número de magatzem:</label>
                        <input type="text" name="NumMag" id="NumMag" class="form-control" v-model="NumMag" disabled>
                    </div>
                    <div class="col-12 col-sm-4">
                        <label for="SerialNum">Número de sèrie:</label>
                        <input type="text" name="SerialNum" id="SerialNum" class="form-control"
                            :value=element?.SerialNum disabled>
                    </div>
                    <div class="col-12 col-sm-4">
                        <label for="responsable">Responsable:</label>
                        <input type="text" name="responsable" id="responsable" class="form-control" disabled
                            :value="responsable.first_name + ' ' + responsable.last_name">
                    </div>
                    <div class="col-12 col-sm-4">
                        <label for="status">Estat:</label>
                        <select name="status" id="status" class="form-control" disabled v-model="status"
                            v-if="this.statusValues">
                            <option v-for="state in this.statusValues.meta.display_options.choices" :value="state.value"
                                :key="state">
                                {{ state.text }}
                            </option>
                        </select>
                    </div>
                    <div class="col-12 col-sm-4">
                        <label for="delegacioAssignada">Delegació assignada:</label>
                        <select name="delegacioAssignada" id="delegacioAssignada" class="form-control" disabled
                            v-model="DelegacioAssignada">
                            <option v-for="delegacio in this.delegacionsValues" :value="delegacio.ID" :key="delegacio">
                                {{ delegacio.Name }}
                            </option>
                        </select>
                    </div>
                    <div class="col-12 col-sm-4">
                        <label for="delegacioActual">Delegació actual:</label>
                        <input type="text" name="delegacioActual" id="delegacioActual" class="form-control" disabled
                            :value="element.DelegacioActual.Name">
                    </div>
                </div>

                <label for="observations">Observacions:</label>
                <textarea class="form-control" name="observations" id="observations" v-model="element.Observacions"
                    disabled></textarea>
                <button type="submit" class="btn btn-primary my-2" v-show="editMode">Desa els canvis</button>
            </form>
            <button class="btn btn-secondary my-2" @click="EditElement()" v-show="!editMode">Edita</button>

            <div class="alert" v-if="respEditElement" v-bind:class="respEditElement.alertType">
                <ul class="list-unstyled">
                    <li v-for="resposta in respEditElement.message" :key="resposta"> {{ resposta }}</li>
                </ul>
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
                :theme-color="this.$store.state.themeColor" :loading="this.incidencies.loading">
            </EasyDataTable>
            <button class="btn btn-primary mt-1">Crear incidència</button>
        </div>
        <div class="col-12 col-lg">
            <h6>Equips assignats</h6>
            <EasyDataTable :headers="this.accessoris.headers" :items="this.accessoris.items" alternating
                buttons-pagination :sort-by="this.accessoris.sortBy" :sort-type="this.accessoris.sortType"
                :theme-color="this.$store.state.themeColor" :loading="this.accessoris.loading">
                <template #item-operation="item">
                    <div class="operation-wrapper">
                        <i class="bi bi-trash" style="font-size: 1rem" @click="deleteItem(item)"></i>
                    </div>
                </template>
            </EasyDataTable>
            <button class="btn btn-primary mt-1" data-toggle="modal" data-target="#gestionarAccessoris"
                @click="obtenirelements('Element')">Afegir un
                accessori</button>
        </div>
    </section>

    <ModalComponent id="gestionarAccessoris">
        <template v-slot:header>
            <h6>Afegir un accessori</h6>
        </template>
        <template v-slot:body>
            <div class="form-group row mb-2">
                <label for="tipusMaterial" class="col-sm col-form-label">Tipus de material: </label>
                <div class="col-sm-8">
                    <select class="form-control" name="tipusMaterial" id="tipusMaterial" v-model="tipusMaterial">
                        <option v-for="subcategory in this.subcategory" :key="subcategory.id" :value="subcategory.id">
                            {{ subcategory.SubcategoryName }}
                        </option>
                    </select>
                </div>
            </div>
            <EasyDataTable :headers="this.nousAccessoris.headers" :items="this.nousAccessoris.items" alternating
                buttons-pagination v-model:items-selected="this.nousAccessoris.itemsSelected"
                :sort-by="this.nousAccessoris.sortBy" :sort-type="this.nousAccessoris.sortType"
                :theme-color="this.$store.state.themeColor" :loading="this.nousAccessoris.loading">
            </EasyDataTable>
        </template>
        <template v-slot:footer>

        </template>
    </ModalComponent>
</template>
<script>
import ModalComponent from "@/components/ModalComponent.vue"

export default {
    name: "FitxaElement",
    components: {
        ModalComponent
    },
    data() {
        return {
            element: null,
            statusValues: null,

            NumMag: "",
            status: "",
            observacions: "",
            responsable: "",

            delegacionsValues: this.getDelegacions(),
            DelegacioAssignada: "",

            subcategory: [],
            tipusMaterial: null,

            editMode: false,

            response: null,
            respEditElement: null,

            historialMoviments: {
                headers: [
                    { text: "Data", value: "date_created", sortable: true },
                    { text: "Origen", value: "Origen.Name", sortable: true },
                    { text: "Destí", value: "Desti.Name", sortable: true },
                    { text: "Realitzat per", value: "user_created.first_name", sortable: true },
                ],
                items: [],
                sortBy: "date_created",
                sortType: "desc",
                loading: true
            },
            incidencies: {
                headers: [
                    { text: "Data", value: "date_created", sortable: true },
                    { text: "OPI", value: "Origen.Name", sortable: true },
                    { text: "Estat", value: "status", sortable: true },
                    { text: "Registrada per", value: "user_created.first_name", sortable: true },
                ],
                items: [],
                sortBy: "",
                sortType: "asc",
                loading: true
            },
            accessoris: {
                headers: [
                    { text: "Model", value: "Model.Subcategory.SubcategoryName", sortable: true },
                    { text: "Model", value: "Model.ModelName", sortable: true },
                    { text: "Número de sèrie", value: "SerialNum", sortable: true },
                    { text: "Accions", value: "operation" },

                ],
                items: [],
                sortBy: "",
                sortType: "asc",
                loading: true
            },
            nousAccessoris: {
                headers: [
                    { text: "Model", value: "Model.Subcategory.SubcategoryName", sortable: true },
                    { text: "Model", value: "Model.ModelName", sortable: true },
                    { text: "Número de sèrie", value: "SerialNum", sortable: true },
                    { text: "Accions", value: "operation" },

                ],
                items: [],
                sortBy: "",
                sortType: "asc",
                itemsSelected: [],
                loading: true
            }
        }
    },
    async created() {
        await this.getData()
        this.delegacions = this.getDelegacions()

        let params = {
            collection: "Subcategory",
            fields: "?fields=id,SubcategoryName",
            filter: "",
            sort: "&sort[]=SubcategoryName"
        }
        this.subcategory = await this.$store.dispatch("getCollection", params)

    },
    watch: {
        '$route'() {
            this.$router.push({ name: 'Fitxa', params: { SerialNum: this.$route.params.SerialNum } })
            this.getData()
        },
        async tipusMaterial() {
            this.nousAccessoris.loading = true
            this.nousAccessoris.items = []
            let params = {
                collection: "Element",
                fields: "?fields=SerialNum,NumMag,Model.ModelName,Model.Subcategory",
                filter: "&filter[Model][Subcategory][_eq]=" + this.tipusMaterial,
                sort: "&sort[]=Model.ModelName"
            }
            this.nousAccessoris.items = await this.$store.dispatch("getCollection", params)
            this.nousAccessoris.loading = false
        }
    },
    computed: {

    },
    methods: {
        getItems: function (payload) {
            return this.$store.dispatch("getCollection", payload)
        },
        getDelegacions() {
            return this.$store.getters.getDelegacions
        },
        EditElement: function () { //Desbloqueja tots els elements del formulari per poder-los modificar
            document.getElementById("NumMag").disabled = false;
            document.getElementById("status").disabled = false;
            document.getElementById("observations").disabled = false;
            document.getElementById("delegacioAssignada").disabled = false;

            this.editMode = true
        },
        UpdateElement: async function () { //Bloqueja tots els elements del formulari per poder-los modificar
            document.getElementById("NumMag").disabled = true;
            document.getElementById("status").disabled = true;
            document.getElementById("observations").disabled = true;
            document.getElementById("delegacioAssignada").disabled = true;

            this.editMode = false

            let payload = {
                collection: "Element",
                item: this.$route.params.SerialNum,
                NumMag: this.NumMag,
                status: this.status,
                DelegacioAssignada: this.DelegacioAssignada,
                observacions: this.observacions
            }
            const response = await this.$store.dispatch("updateItem", payload)
            this.respEditElement = await this.$store.dispatch("handlingError", response)
        },
        getData: async function () {
            //Obté informació de l'element
            let params = {
                collection: "Element",
                item: this.$route.params.SerialNum,
                fields: "?fields=*.*.*.*",
                filter: ""
            }
            this.element = await this.$store.dispatch("getElement", params)

            //Obté els possibles valors del desplegable de l'estat
            let payload = {
                collection: "Element",
                field: "status"
            }
            this.statusValues = await this.$store.dispatch("getFields", payload)

            //Obtenir l'usuari responsable
            payload = {
                id: this.element.Model.Subcategory.Category.CategoryOwner,
                fields: "?fields=first_name,last_name",
                filter: "",
                sort: ""
            }
            this.responsable = await this.$store.dispatch("getUsers", payload)

            //Obtenir els moviments de l'element
            payload = {
                collection: "Moviment",
                fields: "?fields=Element,date_created,Origen.Name,Desti.Name,user_created.first_name,user_created.last_name",
                filter: "&filter[status][_eq]=published&filter[Element][_eq]=" + this.$route.params.SerialNum,
                sort: ""
            }
            this.historialMoviments.items = await this.getItems(payload)
            this.historialMoviments.loading = false
            console.log("MOVIMENTS", this.historialMoviments.items)

            this.historialMoviments.items.forEach(moviment => {
                let dateFromatted = new Date(moviment.date_created)
                const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
                moviment.date_created = dateFromatted.toLocaleDateString('ca-ES', options);
            });

            //Obtenir les incidències
            payload = {
                collection: "Incidencia",
                fields: "?fields=*.*.*",
                filter: "&filter[ElementIncidencia][_eq]=" + this.$route.params.SerialNum,
                sort: ""
            }
            this.incidencies.items = await this.getItems(payload)
            this.incidencies.loading = false

            this.incidencies.items.forEach(incidencia => {
                let dateFromatted = new Date(incidencia.date_created)
                const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
                incidencia.date_created = dateFromatted.toLocaleDateString('ca-ES', options);
            });


            //Obtenir els accessoris assignats actualment
            payload = {
                collection: "Element",
                fields: "?fields=*.*.*",
                filter: "&filter[ElementPare][_eq]=" + this.$route.params.SerialNum,
                sort: ""
            }
            this.accessoris.items = await this.getItems(payload)
            this.accessoris.loading = false

            this.status = this.element.status
            this.NumMag = this.element.NumMag
            this.observacions = this.element.Observacions
            this.DelegacioAssignada = this.element.DelegacioAssignada.ID
        }
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