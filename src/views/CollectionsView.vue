<template>
    <h1 class="text-center">Categories</h1>
    <section class="row row-cols-5" id="toPDF">
        <div class="col-6 col-sm col-md-2 my-3" v-for="category in this.categories" :key="category">
            <router-link :to="{
                name: 'subcollection',
                params: {
                    id: category.id
                }
            }">
                <CardButton :title=category.CategoryName
                    :subtitle="category.CategoryOwner?.first_name + ' ' + category.CategoryOwner?.last_name"
                    :icon="'bi bi-folder2-open'" :bg-color="'#bb0000'"></CardButton>
            </router-link>
        </div>
        <div class="col-6 col-sm col-md-2 my-3">
            <CardButton :title="'Afegir categoria'" :owner="{}" :icon="'bi bi-plus-lg'" :bg-color="'#36333E'"
                data-toggle="modal" data-target="#ModalCreateCategory">
            </CardButton>
        </div>
    </section>


    <ModalComponent id="ModalCreateCategory">
        <template v-slot:header>
            <h6>Crear categoria</h6>
        </template>
        <template v-slot:body>
            <div class="row">
                <label for="CategoryName" class="col-12 col-sm-1 col-form-label">Nom:</label>
                <div class="col-sm">
                    <input type="text" name="CategoryName" id="CategoryName" class="form-control"
                        v-model="NomCategoria">
                </div>
                <label for="CategoryOwner" class="col-12 col-sm-2 col-form-label">Responsable:</label>
                <div class="col-sm">
                    <select class="form-control" name="CategoryOwner" id="CategoryOwner" v-model="ResponsableCategoria"
                        required>
                        <option v-for="usuari in this.users" :key="usuari.id" :value="usuari.id">{{
                            usuari.first_name + ' ' + usuari.last_name
                        }}
                        </option>
                    </select>
                </div>
                <small>Si ets un usuari restringit, nom??s pots crear categories de la teva propietat</small>
                <div class="alert" v-if="respCreateCat" v-bind:class="respCreateCat.alertType">
                    <ul class="list-unstyled">
                        <li v-for="resposta in respCreateCat.message" :key="resposta"> {{ resposta }}</li>
                    </ul>
                </div>
            </div>
        </template>
        <template v-slot:footer>
            <button type="submit" class="btn btn-primary" @click="crearCategoria()">Crear categoria</button>
        </template>
    </ModalComponent>
</template>
<script>
import CardButton from '@/components/CardButton.vue'
import ModalComponent from "@/components/ModalComponent.vue"

export default {
    name: 'CollectionsView',
    components: {
        CardButton,
        ModalComponent


    },
    data() {
        return {
            params: {
                collection: "Category",
                fields: "?fields=CategoryName,id,CategoryOwner.first_name,CategoryOwner.last_name",
                filter: "&filter[status][_eq]=published&filter[CategoryName][_neq]=NULL",
                sort: "&sort[]=CategoryName",
                limit: ""
            },
            categories: [],

            respCreateCat: null,

            users: null,


            //CREAR CATEGORIA
            NomCategoria: null,
            ResponsableCategoria: null
            //CREAR CATEGORIA
        }
    },
    async mounted() {
        this.categories = await this.$store.dispatch("getCollection", this.params)
        await this.listusers()
    },
    methods: {
        async listusers() {
            let params = {
                id: "",
                collection: "",
                fields: "?fields=first_name,last_name,id",
                filter: "&filter[status][_eq]=active",
                sort: "&sort=first_name",
                limit: ""
            }
            this.users = await this.$store.dispatch("getUsers", params)
        },
        async crearCategoria() {
            let payload = {
                collection: "Category",
                values: {
                    "CategoryName": this.NomCategoria,
                    "CategoryOwner": this.ResponsableCategoria
                }
            }

            const response = await this.$store.dispatch("createItem", payload)
            this.respCreateCat = await this.$store.dispatch("handlingError", response)

        }
    }
}
</script>