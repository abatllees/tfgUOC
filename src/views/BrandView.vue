<template>
    <h1 class="text-center">Marques</h1>
    <section class="row row-cols-5" id="toPDF">
        <div class="col-6 col-sm col-md-2 my-3" v-for="brand in this.brands" :key="brand">
            <router-link :to="{
                name: 'LlistatElements',
                params: {
                    brand: brand.id
                }
            }">
                <CardButton :title=brand.BrandName :subtitle="''" :icon="'bi bi-folder2-open'" :bg-color="'#bb0000'">
                </CardButton>
            </router-link>
        </div>
        <div class="col-6 col-sm col-md-2 my-3">
            <CardButton :title="'Afegir marca'" :owner="{}" :icon="'bi bi-plus-lg'" :bg-color="'#36333E'"
                data-toggle="modal" data-target="#ModalCreateCategory">
            </CardButton>
        </div>
    </section>
    <ModalComponent id="ModalCreateCategory">
        <template v-slot:header>
            <h6>Crear marca</h6>
        </template>
        <template v-slot:body>
            <div class="row">
                <label for="BrandName" class="col-12 col-sm-2 col-form-label">Nom:</label>
                <div class="col-sm">
                    <input type="text" name="BrandName" id="BrandName" class="form-control" v-model="BrandName">
                </div>
                <div class="alert my-2" v-if="BrandResponse" v-bind:class="BrandResponse.alertType">
                    <ul class="list-unstyled">
                        <li v-for="resposta in BrandResponse.message" :key="resposta"> {{ resposta }}</li>
                    </ul>
                </div>
            </div>
        </template>
        <template v-slot:footer>
            <button type="submit" class="btn btn-primary" @click="createBrand()">Crear marca</button>
        </template>
    </ModalComponent>
</template>

<script>
import CardButton from '@/components/CardButton.vue';
import ModalComponent from '@/components/ModalComponent.vue';
import store from "@/store/index.js"
export default {
    name: "BrandView",
    components: {
        CardButton,
        ModalComponent
    },
    data() {
        return {
            brands: null,

            BrandResponse: null,
            BrandName: null
        }
    },
    async created() {
        this.brands = await this.listBrands()
    },
    methods: {
        async createBrand() {
            let payload = {
                collection: "Brand",
                values: {
                    "BrandName": this.BrandName,
                }
            }
            const response = await store.dispatch("createItem", payload)
            this.BrandResponse = await store.dispatch("handlingError", response)
            this.brands = await this.listBrands()

        },
        async listBrands() {
            let params = {
                collection: "Brand",
                fields: "?fields=BrandName,id",
                filter: "",
                sort: "&sort[]=BrandName",
                limit: ""
            }
            const BrandList = await store.dispatch("getCollection", params)
            return BrandList.data.data
        }
    }
}
</script>

<style>

</style>