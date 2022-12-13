<template>
    <h1 class="text-center">{{ this.delegacio.Name }}</h1>
    <section class="row justify-content-end">
        <div class="col-12 col-md-6 col-lg-3">
            <ContactCard v-if="this.delegacio.ResponsableDelegacio"
                :contactPerson="this.delegacio.ResponsableDelegacio"></ContactCard>
        </div>
    </section>
    <h5>Material a la delegació</h5>
    <EasyDataTable :headers="this.headers" :items="this.items" alternating buttons-pagination
        :items-selected="itemsSelected" :sort-by="this.sortBy" :sort-type="this.sortType">
    </EasyDataTable>
    <button class="btn btn-secondary mt-3 float-right">Imprimeix</button>
</template>
<script>
import ContactCard from '@/components/ContactCard.vue'
export default {
    name: "DelegacioView",
    components: {
        EasyDataTable: window['vue3-easy-data-table'],
        ContactCard
    },
    data() {
        return {
            headers: [
                { text: "Núm. Mag", value: "NumMag", sortable: true },
                { text: "Tipus de material", value: "Model.Subcategory.SubcategoryName", sortable: true },
                { text: "Model", value: "Model.ModelName", sortable: true },
                { text: "Número de sèrie", value: "SerialNum", sortable: true },
                { text: "Data d'entrada", value: "DataEntrada", sortable: true },
                { text: "Entrat per", value: "user_created.first_name", sortable: true },
            ],
            items: [],
            itemsSelected: [],
            sortBy: "",
            sortType: "asc",
            delegacio: null
        }
    },
    async created() {
        this.delegacio = await this.getDelegacio()
        //this.items = await this.getElements()
    },
    methods: {
        getDelegacio: function () {
            let params = {
                collection: "Delegacio",
                item: this.$route.params.id,
                fields: "?fields=Name,ResponsableDelegacio.first_name,ResponsableDelegacio.last_name,ResponsableDelegacio.email",
                filter: ""
            }
            return this.$store.dispatch("getElement", params)
        },
        getElements: async function () {
            let params = {
                collection: "Element",
                fields: "?fields=SerialNum",
                filter: "&filter[DelegacioActual][_eq]=" + this.$route.params.id
            }
            await this.$store.dispatch("getCollection", params)
        }
    }
}
</script>
<style>

</style>