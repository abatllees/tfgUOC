<template>
    <h1 class="text-center">{{ this.$store.state.GettedElement?.Name }}</h1>
    <section class="row justify-content-end">
        <div class="col-12 col-md-6 col-lg-3">
            <ContactCard v-if="this.$store.state.GettedElement?.ResponsableDelegacio"
                :contactPerson="this.$store.state.GettedElement.ResponsableDelegacio"></ContactCard>
        </div>
    </section>
    <h5>Material a la delegació</h5>
    <EasyDataTable :headers="this.headers" :items="this.$store.state.Element" alternating buttons-pagination
        v-model:items-selected="itemsSelected" :sort-by="this.sortBy" :sort-type="this.sortType">
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
            IDdelegacio: this.$route.params.id,
            headers: [
                { text: "Núm. Mag", value: "NumMag", sortable: true },
                { text: "Tipus de material", value: "Model.Subcategory.SubcategoryName", sortable: true },
                { text: "Model", value: "Model.ModelName", sortable: true },
                { text: "Número de sèrie", value: "SerialNum", sortable: true },
                { text: "Data d'entrada", value: "DataEntrada", sortable: true },
                { text: "Entrat per", value: "user_created.first_name", sortable: true },
            ],
            items: this.$store.state.Element,
            itemsSelected: [],
            sortBy: "",
            sortType: "asc"
        }
    },
    created() {
        this.getDelegacio()
        this.getElements()
    },
    methods: {
        getDelegacio: async function () {
            await this.$store.dispatch("getElement", { collection: "Delegacio", item: this.$route.params.id })
        },
        getElements: async function () {
            let params = {
                collection: "Element",
                fields: "?fields=*.*.*",
                filter: "&filter[DelegacioActual][_eq]=" + this.$route.params.id
            }
            await this.$store.dispatch("getCollection", params)
        }
    },
    watch: {
        '$route.params.id'() {
            this.getElements()
            this.getDelegacio()
        }
    }
}
</script>
<style>

</style>