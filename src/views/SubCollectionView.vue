<template>
    <section class="row">
        <h1 class="text-center w-100"> {{ category.CategoryName }}</h1>
        <div class="col-6 col-sm-4 col-md-3  my-1" v-for="subcategory in subcategory" :key="subcategory">
            <router-link :to="{
                name: 'LlistatElements', params: { id: subcategory.id }
            }">
                <CardButton :title=subcategory.SubcategoryName :subtitle="null" :icon="'bi bi-folder2-open'"
                    :bg-color="'#bb0000'">
                </CardButton>
            </router-link>
        </div>
        <div class="col-6 col-sm-4 col-md-3  my-1">
            <CardButton :title="'Afegir subcategoria'" :subtitle="''" :icon="'bi bi-plus-lg'" :bg-color="'#36333E'"
                data-toggle="modal" data-target="#ModalCreateSubCategory">
            </CardButton>
        </div>
    </section>
    <router-link :to="{
        name: 'LlistatElements',
        params: {
            category: this.$route.params.id
        },
    }" class="btn btn-secondary">Mostra tots els elements</router-link>


    <ModalComponent id="ModalCreateSubCategory">
        <template v-slot:header>
            <h6>Crear subcategoria</h6>
        </template>
        <template v-slot:body>
            <div class="row">
                <label for="CategoryName" class="col-12 col-sm-1 col-form-label">Nom:</label>
                <div class="col-sm">
                    <input type="text" name="CategoryName" id="CategoryName" class="form-control"
                        v-model="NomCategoria">
                </div>
            </div>
            <div class="alert" v-if="respCreateCat" v-bind:class="respCreateCat.alertType">
                <ul class="list-unstyled">
                    <li v-for="resposta in respCreateCat.message" :key="resposta"> {{ resposta }}</li>
                </ul>
            </div>
        </template>
        <template v-slot:footer>
            <button type="submit" class="btn btn-primary" @click="crearCategoria()">Crear subcategoria</button>
        </template>
    </ModalComponent>
</template>
<script>
import CardButton from '@/components/CardButton.vue';
import ModalComponent from "@/components/ModalComponent.vue"

export default {
    name: "SubCollectionViewVue",
    components: {
        CardButton,
        ModalComponent
    },
    data() {
        return {
            category: null,
            subcategory: [],
            //CREAR CATEGORIA
            NomCategoria: null,
            CategoriaPare: this.$route.params.id,
            //CREAR CATEGORIA

            respCreateCat: null
        }
    },
    async beforeMount() {
        let params = {
            collection: "Subcategory",
            fields: "?fields=SubcategoryName,id",
            filter: "&filter[status][_eq]=published&filter[Category][_eq]=" + this.$route.params.id,
            sort: "&sort[]=SubcategoryName",
            limit: ""
        }
        const subcategory = await this.$store.dispatch("getCollection", params)
        this.subcategory = subcategory.data.data

        this.category = await this.getCategory()
    },
    methods: {
        async crearCategoria() {
            let payload = {
                collection: "Subcategory",
                values: {
                    "SubcategoryName": this.NomCategoria,
                    "Category": await this.getCategory()
                }
            }

            const response = await this.$store.dispatch("createItem", payload)
            this.respCreateCat = await this.$store.dispatch("handlingError", response)
        },
        async getCategory() {
            const params = {
                collection: "Category",
                item: this.$route.params.id,
                fields: "?fields=*",
                filter: "&filter[Category][_eq]=" + this.$route.params.id,
                sort: "",
                limit: ""
            }

            const category = await this.$store.dispatch("getElement", params)
            return category.data.data
        }
    }
}
</script>