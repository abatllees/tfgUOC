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
</template>

<script>
import CardButton from '@/components/CardButton.vue';
export default {
    name: "BrandView",
    components: {
        CardButton
    },
    data() {
        return {
            brands: null,
        }
    },
    async created() {
        let params = {
            collection: "Brand",
            fields: "?fields=BrandName,id",
            filter: "",
            sort: "&sort[]=BrandName",
            limit: ""
        }

        this.brands = await this.$store.dispatch("getCollection", params)
    }
}
</script>

<style>

</style>