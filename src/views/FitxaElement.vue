<template>
    <section class="w-100">
        <h1>{{ element.Model.Subcategory.SubcategoryName }} {{ element.Model.Brand.BrandName }} {{
            element.Model.ModelName
        }} </h1>
    </section>
    <section class="row">
        <div class="col-12 col-sm col-lg-9">
            <form @submit.prevent="UpdateElement()">
                <div class="row">
                    <div class="col-12 col-sm-4">
                        <label for="NumMag">Número de magatzem:</label>
                        <input type="text" name="NumMag" id="NumMag" class="form-control" v-model="element.NumMag"
                            disabled>
                    </div>
                    <div class="col-12 col-sm-4">
                        <label for="SerialNum">Número de sèrie:</label>
                        <input type="text" name="SerialNum" id="SerialNum" class="form-control" :value=element.SerialNum
                            disabled>
                    </div>
                    <div class="col-12 col-sm-4">
                        <label for="responsable">Responsable:</label>
                        <input type="text" name="responsable" id="responsable" class="form-control" disabled
                            :value="responsable.first_name + ' ' + responsable.last_name">
                    </div>
                    <div class="col-12 col-sm-4">
                        <label for="status">Estat:</label>
                        <select name="status" id="status" class="form-control" disabled v-model="element.status"
                            v-if="statusValues">
                            <option v-for="state in statusValues.meta.display_options.choices" :value="state.value"
                                :key="state">
                                {{ state.text }}
                            </option>
                        </select>
                    </div>
                    <div class="col-12 col-sm-4">
                        <label for="delegacioAssignada">Delegació assignada:</label>
                        <select name="delegacioAssignada" id="delegacioAssignada" class="form-control" disabled
                            v-model="element.DelegacioAssignada">
                            <option v-for="delegacio in delegacionsValues" :value="delegacio.ID" :key="delegacio">
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
                <editor api-key="01ip8sucmcp0yvrrfeed05p8sfkchlu2osrreplih48qih29" :init="{
                    height: 200,
                    menubar: false,
                    plugins: [
                        'advlist autolink lists link image charmap print preview anchor',
                        'searchreplace visualblocks code fullscreen',
                        'insertdatetime media table paste code help wordcount'
                    ],
                    toolbar:
                        'undo redo | formatselect | bold italic backcolor | \
                                                                                                                                                                                                                                                                                alignleft aligncenter alignright alignjustify | \
                                                                                                                                                                                                                                                                                bullist numlist outdent indent | removeformat | help'
                }" v-model="element.Observacions" id="observations" :disabled=tinyDisabled />
                <button type="submit" class="btn btn-primary my-2" v-show="editMode">Desa els canvis</button>
            </form>
            <button class="btn btn-secondary my-2" @click="EditElement()" v-show="!editMode">Edita</button>
            <div class="alert" v-if="respEditElement" v-bind:class="respEditElement.alertType">
                <ul class="list-unstyled">
                    <li v-for="resposta in respEditElement.message" :key="resposta"> {{ resposta }}</li>
                </ul>
            </div>
        </div>
    </section>
    <section class="row">
        <div class="col-12 col-lg">
            <h6>Historial de moviments</h6>
            <EasyDataTable :headers="historialMoviments.headers" :items="historialMoviments.items" alternating
                buttons-pagination :sort-by="historialMoviments.sortBy" :sort-type="historialMoviments.sortType"
                :theme-color="this.$store.state.themeColor" :loading="historialMoviments.loading">
            </EasyDataTable>
        </div>
        <div class="col-12 col-lg">
            <h6>Incidències</h6>
            <EasyDataTable :headers="incidencies.headers" :items="incidencies.items" alternating buttons-pagination
                :sort-by="incidencies.sortBy" :sort-type="incidencies.sortType"
                :theme-color="this.$store.state.themeColor" :loading="incidencies.loading">
            </EasyDataTable>
            <button class="btn btn-primary mt-1" data-toggle="modal" data-target="#incidencia">Crear
                incidència</button>
        </div>
        <div class="col-12 col-lg">
            <h6>Equips assignats</h6>
            <EasyDataTable :headers="accessoris.headers" :items="accessoris.items" alternating buttons-pagination
                :sort-by="accessoris.sortBy" :sort-type="accessoris.sortType"
                :theme-color="this.$store.state.themeColor" :loading="accessoris.loading">
                <template #item-operation="item">
                    <div class="operation-wrapper">
                        <i class="bi bi-trash" style="font-size: 1rem" @click="deleteAccessori(item)"></i>
                    </div>
                </template>
            </EasyDataTable>
            <button class="btn btn-primary mt-1" data-toggle="modal" data-target="#gestionarAccessoris"
                @click="obtenirelements('Element')">Afegir un accessori</button>
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
                        <option v-for="subcategory in subcategory" :key="subcategory.id" :value="subcategory.id">
                            {{ subcategory.SubcategoryName }}
                        </option>
                    </select>
                </div>
            </div>
            <EasyDataTable :headers="nousAccessoris.headers" :items="nousAccessoris.items" alternating
                buttons-pagination v-model:items-selected="nousAccessoris.itemsSelected"
                :sort-by="nousAccessoris.sortBy" :sort-type="nousAccessoris.sortType"
                :theme-color="this.$store.state.themeColor" :loading="nousAccessoris.loading">
            </EasyDataTable>
        </template>
        <template v-slot:footer>
            <button class="btn btn-primary" @click="associar(nousAccessoris.itemsSelected)"
                data-dismiss="modal">Associar elements</button>
        </template>
    </ModalComponent>
    <ModalComponent id="incidencia">
        <template v-slot:header>
            <h6>Nova incidència</h6>
        </template>
        <template v-slot:body>
            <div class="alert" v-if="respIncidencia" v-bind:class="respIncidencia.alertType">
                <ul class="list-unstyled">
                    <li v-for="resposta in respIncidencia.message" :key="resposta"> {{ resposta }}</li>
                </ul>
            </div>
            <form>
                <div class="form-group">
                    <label for="incidencia">Descripció de la incidència:</label>
                    <textarea name="incidencia" id="incidencia" rows="5" v-model="incidencia"
                        class="form-control"></textarea>
                </div>
            </form>
        </template>
        <template v-slot:footer>
            <button class="btn btn-primary" @click="CrearIncidencia()">Enregistrar
                incidència</button>
        </template>

    </ModalComponent>
</template>
<script>
import ModalComponent from "@/components/ModalComponent.vue"
import store from "@/store/index.js"

import Editor from '@tinymce/tinymce-vue'

export default {
    name: "FitxaElement",
    components: {
        ModalComponent,
        'editor': Editor
    },
    data() {
        return {
            element: null, //Objecte amb tota la informació de l'item
            statusValues: null, //Valors disponibles de l'estat de l'item

            responsable: "",

            delegacionsValues: store.getters.getDelegacions,

            subcategory: store.getters.getSubcategory,
            tipusMaterial: null,

            editMode: false,
            tinyDisabled: true,

            incidencia: null,
            respIncidencia: null,

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
                    { text: "Registrada per", value: "user_created.first_name", sortable: true },
                    { text: "Descripcio", value: "DescripcioIncidencia", sortable: true },
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
                    { text: "", value: "operation" },

                ],
                items: [],
                itemsSelected: [],
                sortBy: "",
                sortType: "asc",
                loading: true
            },
            nousAccessoris: {
                headers: [
                    { text: "Núm. Mag", value: "NumMag", sortable: true },
                    { text: "Model", value: "Model.ModelName", sortable: true },
                    { text: "Número de sèrie", value: "SerialNum", sortable: true },
                ],
                items: [],
                sortBy: "",
                sortType: "asc",
                itemsSelected: [],
                loading: true,
            }
        }
    },
    async beforeMount() {
        this.element = await this.getElementInfo()

    },
    watch: {
        /*'$route'() {
            this.$router.replace({ name: 'Fitxa', params: { SerialNum: this.$route.params.SerialNum } })
            this.getData()
        },
        async tipusMaterial() {
            await this.llistarAccessoris()
        }*/
    },
    methods: {
        getElementInfo: async function () {
            //Obté informació de l'element
            let params = {
                collection: "Element",
                item: this.$route.params.SerialNum,
                fields: "?fields=*.*.*.*",
                filter: ""
            }


            //Obté els possibles valors del desplegable de l'estat
            let payload = {
                collection: "Element",
                field: "status"
            }
            this.statusValues = await store.dispatch("getFields", payload)


            const element = await store.dispatch("getElement", params)
            return element.data.data
            /*

            
                        //Obtenir l'usuari responsable
                        payload = {
                            id: this.element.Model.Subcategory.Category.CategoryOwner,
                            fields: "?fields=first_name,last_name",
                            filter: "",
                            sort: "",
                            limit: ""
                        }
                        const responsable = await store.dispatch("getUsers", payload)
                        this.responsable = responsable.data.data
            
                        this.status = this.element.status
                        this.NumMag = this.element.NumMag
                        this.observacions = this.element.Observacions
                        this.DelegacioAssignada = this.element.DelegacioAssignada.ID*/
        },
        EditElement: function () { //Desbloqueja tots els elements del formulari per poder-los modificar
            document.getElementById("NumMag").disabled = false;
            document.getElementById("status").disabled = false;
            document.getElementById("delegacioAssignada").disabled = false;
            this.tinyDisabled = false
            this.editMode = true
        },
        UpdateElement: async function () { //Bloqueja tots els elements del formulari per poder-los modificar
            document.getElementById("NumMag").disabled = true;
            document.getElementById("status").disabled = true;
            document.getElementById("delegacioAssignada").disabled = true;
            this.tinyDisabled = true
            this.editMode = false

            let payload = {
                collection: "Element",
                item: this.$route.params.SerialNum,
                data: {
                    NumMag: this.NumMag,
                    status: this.status,
                    DelegacioAssignada: this.DelegacioAssignada,
                    Observacions: this.observacions
                }
            }
            const response = await store.dispatch("updateItem", payload)
            this.respEditElement = await store.dispatch("handlingError", response)
        },
        CrearIncidencia: async function () {
            let payload = {
                collection: "Incidencia",
                values: {
                    ElementIncidencia: this.$route.params.SerialNum,
                    DescripcioIncidencia: this.incidencia

                }
            }
            const novaIncidencia = await store.dispatch("createItem", payload)
            this.respIncidencia = await store.dispatch("handlingError", novaIncidencia)
            this.incidencies.loading = true
            this.getIncidencies()
        },
        getMoviments: async function () {
            //Obtenir els moviments de l'element
            let payload = {
                collection: "Moviment",
                fields: "?fields=Element,date_created,Origen.Name,Desti.Name,user_created.first_name,user_created.last_name",
                filter: "&filter[status][_eq]=published&filter[Element][_eq]=" + this.$route.params.SerialNum,
                sort: "&sort[]=-date_created",
                limit: "&limit=10"
            }
            const historialMoviments = await store.dispatch("getCollection", payload)
            this.historialMoviments.items = historialMoviments.data.data
            this.historialMoviments.loading = false

            this.historialMoviments.items.forEach(moviment => {
                let dateFromatted = new Date(moviment.date_created)
                const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
                moviment.date_created = dateFromatted.toLocaleDateString('ca-ES', options);
            });
        },
        getIncidencies: async function () {
            //Obtenir les incidències
            let payload = {
                collection: "Incidencia",
                fields: "?fields=*.*.*",
                filter: "&filter[ElementIncidencia][_eq]=" + this.$route.params.SerialNum,
                sort: "",
                limit: ""
            }
            const incidencies = await store.dispatch("getCollection", payload)
            this.incidencies.items = incidencies.data.data
            this.incidencies.loading = false

            this.incidencies.items.forEach(incidencia => {
                let dateFromatted = new Date(incidencia.date_created)
                const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
                incidencia.date_created = dateFromatted.toLocaleDateString('ca-ES', options);
            });
        },
        getAccessoris: async function () {
            this.accessoris.loading = true
            //Obtenir els accessoris assignats actualment
            let payload = {
                collection: "Element",
                fields: "?fields=SerialNum,Model.ModelName,Model.Subcategory.SubcategoryName",
                filter: "&filter[ElementPare][_eq]=" + this.$route.params.SerialNum,
                sort: "",
                limit: ""
            }
            this.accessoris.loading = false
            const accessoris = await store.dispatch("getCollection", payload)
            return accessoris.data.data
        },
        getData: async function () {
            await this.getElementInfo()
            /*await this.getMoviments()
            await this.getIncidencies()
            this.accessoris.items = await this.getAccessoris()*/
        },
        llistarAccessoris: async function () {
            this.nousAccessoris.loading = true
            let params = {
                collection: "Element",
                fields: "?fields=SerialNum,NumMag,Model.ModelName,Model.Subcategory,ElementPare",
                filter: "&filter[Model][Subcategory][_eq]=" + this.tipusMaterial + "&filter[ElementPare][_null]=true",
                sort: "&sort[]=Model.ModelName",
                limit: ""
            }
            this.nousAccessoris.items = await store.dispatch("getCollection", params)
            this.nousAccessoris.loading = false
        },
        associar: async function (elements) {
            let updateKeys = []
            elements.forEach(element => {
                updateKeys.push(element.SerialNum)
            });
            const payload = {
                collection: "Element",
                data: {
                    keys: updateKeys,
                    data: {
                        "ElementPare": this.$route.params.SerialNum
                    }
                }
            }
            const response = store.dispatch("updateMultipleItems", payload)
            const resposta = await store.dispatch("handlingError", response)
            console.log(resposta)
            this.nousAccessoris.itemsSelected = []
            this.accessoris.items = await this.getAccessoris()
        },

        deleteAccessori: async function (item) {
            this.accessoris.loading = true
            let payload = {
                collection: "Element",
                item: item.SerialNum,
                data: {
                    ElementPare: null,
                }
            }
            await store.dispatch("updateItem", payload)
            //const resposta = await store.dispatch("handlingError", response)

            this.accessoris.items = await this.getAccessoris()
            this.accessoris.loading = false

        }
    }

}

</script>