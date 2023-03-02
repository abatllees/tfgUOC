<template>
    <h1 class="text-center">{{ delegacio.Name }}</h1>
    <section class="row justify-content-end">
        <div class="col-12 col-md-6 col-lg-3">
            <ContactCard v-if="delegacio.ResponsableDelegacio" :contactPerson="delegacio.ResponsableDelegacio">
            </ContactCard>
        </div>
    </section>
    <h5>Material a la delegació</h5>
    <EasyDataTable :headers="headers" :items="items" alternating buttons-pagination :sort-by="sortBy" :sort-type="sortType"
        :theme-color="$store.state.themeColor" :loading="loading">
    </EasyDataTable>
    <button class="btn btn-secondary mt-3 float-right">Imprimeix</button>
</template>
<script>
import ContactCard from '@/components/ContactCard.vue'
import store from "@/store/index.js"
export default {
    name: "DelegacioView",
    components: {
        EasyDataTable: window['vue3-easy-data-table'],
        ContactCard
    },
    data() {
        return {
            headers: [
                { text: "Estat", value: "status", sortable: true },
                { text: "Tipus de material", value: "Model.Subcategory.SubcategoryName", sortable: true },
                { text: "Model", value: "Model.ModelName", sortable: true },
                { text: "Núm. Mag", value: "NumMag", sortable: true },
                { text: "Número de sèrie", value: "SerialNum", sortable: true },
                { text: "Data d'entrada", value: "DataEntrada", sortable: true },
            ],
            items: [],
            sortBy: "",
            sortType: "asc",
            delegacio: [],
            loading: true
        }
    },
    async beforeMount() {
        this.getData()

    },
    watch: {
        '$route.params.id': async function () {
            this.getData()
        }
    },
    methods: {
        getData: async function () {
            this.loading = true
            this.delegacio = await this.getDelegacio()
            this.items = await this.getElements()
            this.loading = false
        },
        getDelegacio: async function () {
            let params = {
                collection: "Delegacio",
                item: this.$route.params.id,
                fields: "?fields=Name,ResponsableDelegacio.first_name,ResponsableDelegacio.last_name,ResponsableDelegacio.email",
                filter: "",
                sort: "",
                limit: ""
            }
            const Delegacio = await store.dispatch("getElement", params)
            return Delegacio.data.data
        },
        getElements: async function () {
            let params = {
                collection: "Element",
                fields: "?fields=*.*.*",
                filter: "&filter[DelegacioActual][_eq]=" + this.$route.params.id,
                sort: "",
                limit: ""
            }
            const ElementsDelegacio = await store.dispatch("getCollection", params)
            return ElementsDelegacio.data.data
        }
    }
}
</script>