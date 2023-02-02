<template>
    <h1 class="text-center">Crea un element nou</h1>
    <div v-if="response" class="alert" :class="response.alertType">
        <ul class="list-unstyled">
            <li v-for="resposta in response.message" :key="resposta"> {{ resposta }}</li>
        </ul>
    </div>
    <secton class="row">
        <form class="col-lg-6 mx-auto" @submit.prevent="crearElement()">
            <div class="row">
                <div class="col-12 col-lg-6 mb-2">
                    <label for="NumSerie">Estat</label>
                    <select name="estat" id="estat" class="form-control" v-model="status">
                        <option value="published">Publicat</option>
                        <option value="draft">Arxivat</option>
                    </select>
                </div>
                <div class="col-12 col-lg-6 mb-2">
                    <label for="model">Model</label>
                    <input type="text" name="model" class="form-control" placeholder="Selecciona un model..."
                        @input="debounceSearch" v-model="model">

                    <ul class="list-group dropdown-menu" v-if="this.SearchResults">
                        <li class="list-group-item list-group-item-action" v-for="result in SearchResults"
                            :key="result">
                            <CardResult :result="result" @click="assignarModel(result)"></CardResult>
                        </li>
                    </ul>
                </div>

            </div>
            <div class="row">
                <div class="col-12 col-lg-6 mb-2">
                    <label for="NumMag">Número de magatzem</label>
                    <input type="text" class="form-control" name="NumMag" v-model="numMag">
                </div>
                <div class="col-12 col-lg-6 mb-2">
                    <label for="NumSerie">Número de sèrie</label>
                    <input type="text" class="form-control" name="NumSerie" v-model="SerialNum">
                </div>
            </div>
            <div class="row">
                <div class="col-12 col-lg mb-2">
                    <label for="DelegacioAssignada">Delegació assignada</label>
                    <select name="delegacioAssignada" id="delegacioAssignada" class="form-control"
                        v-model="delegacioAssignada">
                        <option :value="delegacio.ID" v-for="delegacio in delegacions" :key="delegacio">{{
                            delegacio.Name
                        }}
                        </option>
                    </select>
                </div>
                <div class="col-12 col-lg mb-2">
                    <label for="DelegacioActual">Delegació actual</label>
                    <select name="DelegacioActual" id="DelegacioActual" class="form-control" v-model="delegacioActual"
                        disabled>
                        <option :value="delegacio.ID" v-for="delegacio in delegacions" :key="delegacio">{{
                            delegacio.Name
                        }}
                        </option>
                    </select>
                </div>
            </div>
            <div class="row">
                <div class="col-12 col-lg mb-2">
                    <label for="observacions">Observacions</label>
                    <textarea name="observacions" id="observacions" rows="10" class="form-control"
                        v-model="observacions"></textarea>
                </div>
            </div>
            <button type="submit" class="btn btn-primary">Crear element</button>
        </form>
    </secton>
</template>
<script>
import store from "@/store/index.js"
import CardResult from "@/components/CardResult.vue"
export default {
    name: "CrearElement",
    components: {
        CardResult
    },
    data() {
        return {
            //Inici formulari
            status: null,
            model: null, //nomes ID
            numMag: null,
            SerialNum: null,
            delegacioAssignada: 22,
            delegacioActual: 22,
            observacions: null,
            //Fi formulari

            SearchResults: null,

            selectedModel: null, //objecte sencer

            response: null
        }
    },
    computed: {
        delegacions() {
            return store.getters.getDelegacions
        }
    },
    methods: {
        searchElement: async function () {
            let params = {
                collection: "Model",
                fields: "?fields=*.*.*",
                filter: "&filter[_or][1][ModelName][_contains]=" + this.model
                    + "&filter[_or][2][Brand][BrandName][_contains]=" + this.model,
                sort: "",
                limit: "&limit=-1"
            }
            const Model = await store.dispatch("getCollection", params)
            return Model.data.data
        },
        async debounceSearch() {
            setTimeout(async () => {
                this.SearchResults = await this.searchElement()
            }, 200)
        },
        assignarModel(model) {
            this.model = model.ModelName
            this.selectedModel = model
            this.SearchResults = null
        },
        async crearElement() {
            const payload = {
                collection: "Element",
                values: {
                    status: this.status,
                    Model: this.selectedModel,
                    NumMag: this.numMag,
                    SerialNum: this.SerialNum,
                    DelegacioAssignada: this.delegacioAssignada,
                    DelegacioActual: this.delegacioActual,
                    Observacions: this.observacions,
                }
            }
            const create = await store.dispatch("createItem", payload)
            const response = await store.dispatch("handlingError", create)
            console.log(response)
            this.response = response
        }
    }
}
</script>

<style>

</style>