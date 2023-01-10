<template>
    <h1 class="text-center">El meu inventari</h1>
    <section class="row row-cols-5">
        <div class="col-6 col-sm col-md-2 my-3" v-for="subcategory in this.subcategories" :key="subcategory">
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


    <ModalComponent id="ModalCreateSubcategory">
        <template v-slot:header>
            <h6>Crear subcategoria</h6>
        </template>
        <template v-slot:body>
            <div class="row">
                <label for="CategoryName" class="col-12 col-sm-1 col-form-label">Nom:</label>
                <div class="col-sm">
                    <input type="text" name="CategoryName" id="CategoryName" class="form-control"
                        v-model="NomSubcategoria">
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
export default {
    name: "MeuInventari",
    components: {
        ModalComponent,
        CardButton
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

            respCreateCat: null,

            users: null,


            //CREAR CATEGORIA
            NomSubcategoria: null,
            //CREAR CATEGORIA
        }
    },
    async created() {
        this.subcategories = await this.$store.dispatch("getCollection", this.params)
        console.log(this.subcategories)
    },
    methods: {
        async crearSubcategoria() {
            let payload = {
                collection: "Subcategory",
                values: {
                    "SubcategoryName": this.NomSubcategoria,
                }
            }

            const response = await this.$store.dispatch("createItem", payload)
            this.respCreateCat = await this.$store.dispatch("handlingError", response)

        }
    }
}
</script>

<style>

</style>