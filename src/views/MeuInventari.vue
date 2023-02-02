<template>
    <h1 class="text-center">El meu inventari</h1>
    <section class="row row-cols-5">
        <div class="col-6 col-sm col-md-2 my-3" v-for="subcategory in subcategories" :key="subcategory">
            <router-link :to="{
                name: 'LlistatElements', params: { id: subcategory.id }
            }">
                <CardButton :title=subcategory.SubcategoryName :subtitle="subcategory.Category.CategoryName"
                    :icon="'bi bi-folder2-open'" :bg-color="'#bb0000'"></CardButton>
            </router-link>
        </div>
        <div class="col-6 col-sm col-md-2 my-3">
            <CardButton :title="'Afegir subcategoria'" :subtitle="''" :icon="'bi bi-plus-lg'" :bg-color="'#36333E'"
                data-toggle="modal" data-target="#ModalCreateSubcategory">
            </CardButton>
        </div>
    </section>
    <section class="w-100">
        <EasyDataTable :headers="headers" :items="inventari" alternating buttons-pagination :sort-by="sortBy"
            :sort-type="sortType" :loading="loading" @click-row="showDetail" :theme-color="$store.state.themeColor">
        </EasyDataTable>
        <router-link to="crearElement" class="btn btn-primary mt-2">Crea un element nou</router-link>
    </section>

    <ModalComponent id="ModalCreateSubcategory">
        <template v-slot:header>
            <h6>Crear subcategoria</h6>
        </template>
        <template v-slot:body>
            <div class="row mb-2">
                <label for="SubcategoryName" class="col-12 col-lg col-sm-4 col-form-label">Nom:</label>
                <div class="col-sm col-lg">
                    <input type="text" name="SubcategoryName" id="SubcategoryName" class="form-control"
                        v-model="NomSubcategoria">
                </div>
            </div>
            <div class="row mb-2">
                <label for="Category" class="col-12 col-lg col-sm-4 col-form-label">Categoria:</label>
                <div class="col-sm col-lg">
                    <select name="Category" id="" class="form-control" v-model="Categoria">
                        <option v-for="categoria in CategoriesPropietat" :key="categoria.id" :value="categoria">
                            {{ categoria.CategoryName }}
                        </option>
                    </select>
                </div>
            </div>
            <div class="alert" v-if="respCreateCat" v-bind:class="respCreateCat.alertType">
                <ul class="list-unstyled">
                    <li v-for="resposta in respCreateCat.message" :key="resposta"> {{ resposta }}</li>
                </ul>
            </div>
        </template>
        <template v-slot:footer>
            <button type="submit" class="btn btn-primary" @click="crearSubcategoria()">Crear subcategoria</button>
        </template>
    </ModalComponent>
</template>

<script>
import ModalComponent from '@/components/ModalComponent.vue'
import CardButton from '@/components/CardButton.vue'

import store from "@/store/index.js"
export default {
    name: "MeuInventari",
    components: {
        ModalComponent,
        CardButton,
    },
    data() {
        return {
            params: {
                collection: "Subcategory",
                fields: "?fields=SubcategoryName,id,Category.CategoryName",
                filter: "&filter[Category][CategoryOwner][_eq]=$CURRENT_USER",
                sort: "&sort[]=SubcategoryName",
                limit: ""
            },
            subcategories: [],

            CategoriesPropietat: null,

            //CREAR CATEGORIA
            NomSubcategoria: null,
            Categoria: null,
            respCreateCat: null,
            //CREAR CATEGORIA

            //ELS MEUS ELEMENTS
            headers: [
                { text: "Estat", value: "status", sortable: true },
                { text: "Núm. Mag", value: "NumMag", sortable: true },
                { text: "Tipus d'element", value: "Model.Subcategory.SubcategoryName", sortable: true },
                { text: "Marca", value: "Model.Brand.BrandName", sortable: true },
                { text: "Model", value: "Model.ModelName", sortable: true },
                { text: "Número de sèrie", value: "SerialNum", sortable: true },
                { text: "Data d'entrada", value: "DataEntrada", sortable: true },
                { text: "Delegació actual", value: "DelegacioActual.Name", sortable: true },
                { text: "Delegació assignada", value: "DelegacioAssignada.Name", sortable: true },
            ],
            inventari: [],
            sortBy: "",
            sortType: "asc",
            loading: true
        }
    },
    async created() {
        const subcategories = await store.dispatch("getCollection", this.params)
        this.subcategories = subcategories.data.data
        this.CategoriesPropietat = await this.mostrarCategories()
        this.inventari = await this.mostrarElements()
        this.loading = false
    },
    methods: {
        showDetail: function (element) {
            this.$router.push({ name: 'Fitxa', params: { SerialNum: element.SerialNum } })
        },
        async crearSubcategoria() {
            let payload = {
                collection: "Subcategory",
                values: {
                    "SubcategoryName": this.NomSubcategoria,
                    "Category": this.Categoria,
                }
            }

            const response = await store.dispatch("createItem", payload)
            this.respCreateCat = await store.dispatch("handlingError", response)

        },
        async mostrarCategories() {
            let params = {
                collection: "Category",
                fields: "?fields=CategoryName,id,CategoryOwner",
                filter: "",
                sort: "&sort[]=CategoryName",
                limit: ""
            }
            const categories = await store.dispatch("getCollection", params)
            return categories.data.data
        },
        async mostrarElements() {
            let params = {
                collection: "Element",
                fields: "?fields=status,NumMag,DataEntrada,DelegacioActual.Name,DelegacioAssignada.Name,Model.ModelName,Model.Brand.BrandName,Model.Subcategory.Category.CategoryName,Model.Subcategory.SubcategoryName,SerialNum",
                filter: "&filter[Model][Subcategory][Category][CategoryOwner][_eq]=$CURRENT_USER",
                sort: "",
                limit: ""
            }
            const elements = await store.dispatch("getCollection", params);
            return elements.data.data
        }
    }
}
</script>

<style>

</style>