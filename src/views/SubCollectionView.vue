<template>
    <section class="row">
        <h1 class="text-center w-100"> {{ category?.CategoryName }}</h1>
        <div class="col-6 col-sm-4 col-md-3  my-1" v-for="subcategory in this.subcategory" :key="subcategory">
            <router-link :to="{
                name: 'LlistatElements', params: { id: subcategory.id }
            }">
                <CardButton :title=subcategory.SubcategoryName :icon="'fa-solid fa-folder-open'" :bg-color="'#bb0000'">
                </CardButton>
            </router-link>
        </div>
        <div class="col-6 col-sm-4 col-md-3  my-1">
            <CardButton :title="'Afegir subcategoria'" :owner="{}" :icon="'fa-solid fa-plus'" :bg-color="'#36333E'"
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
            //CREAR CATEGORIA
        }
    },
    async beforeMount() {
        let params = {
            collection: "Subcategory",
            fields: "?fields=SubcategoryName,id",
            filter: "&filter[status][_eq]=published&filter[Category][_eq]=" + this.$route.params.id,
            sort: "&sort[]=SubcategoryName"
        }

        this.subcategory = await this.$store.dispatch("getCollection", params);

        params = {
            collection: "Category",
            item: this.$route.params.id,
            fields: "?fields=CategoryName",
            filter: "&filter[status][_eq]=published&filter[Category][_eq]=" + this.$route.params.id,
            sort: ""
        }

        this.category = await this.$store.dispatch("getElement", params);
    },
    methods: {
        async crearCategoria() {
            let payload = {
                collection: "Subcategory",
                values: {
                    "SubcategoryName": this.NomCategoria,
                    //"CategoryOwner": this.ResponsableCategoria
                }
            }

            const response = await this.$store.dispatch("createItem", payload)
            if (response) {
                console.log("RESPONSE", response)
                alert(response)
            }
        }
    }
}
</script>