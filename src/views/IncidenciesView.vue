<template>
    <section class="w-100">
        <h1 class="text-center">Incidències</h1>
        <EasyDataTable :headers="headers" :items="incidencies" alternating buttons-pagination :sort-by="sortBy"
            :sort-type="sortType" :theme-color="this.$store.state.themeColor" @click-row="showDetail">
        </EasyDataTable>
    </section>
</template>

<script>
import store from "@/store"
export default {
    name: "IncidenciesView",
    data() {
        return {
            headers: [
                { text: "Estat", value: "status", sortable: true },
                { text: "Element", value: "ElementIncidencia", sortable: true },
                { text: "Subcategoria", value: "DescripcioIncidencia", sortable: true },
                { text: "Creada per", value: "user_created", sortable: true },
            ],
            sortBy: "NumMag",
            sortType: "asc",
            incidencies: [],
        }
    },
    async beforeMount() {
        const incidencies = await this.getIncidencies()
        this.incidencies = incidencies.data.data
    },
    methods: {
        getIncidencies: function () {
            //Obtenir els incidencies de l'element
            let payload = {
                collection: "Incidencia",
                fields: "?fields=*",
                filter: "",
                sort: "&sort[]=-date_created",
                limit: "&limit=-1"
            }
            return store.dispatch("getCollection", payload)
        }
    }
}
</script>

<style>

</style>