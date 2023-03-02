<template>
    <section class="w-100" v-if="!this.$route.params.id">
        <h1 class="text-center">Incidències</h1>
        <EasyDataTable :headers="headers" :items="incidencies" alternating buttons-pagination :sort-by="sortBy"
            :loading="this.loading" :sort-type="sortType" :theme-color="this.$store.state.themeColor"
            @click-row="showDetail">
        </EasyDataTable>
    </section>
    <section class="w-100" v-else>
        <h1 class="text-center">Detall d'incidència</h1>
        {{ incidencia }}
    </section>
</template>

<script>
import store from "@/store"
export default {
    name: "IncidenciesView",
    data() {
        return {
            headers: [
                { text: "ID", value: "id", sortable: true },
                { text: "Estat", value: "status", sortable: true },
                { text: "Creada per", value: "user_created.email", sortable: true },
                { text: "Data de creació", value: "date_created", sortable: true },
                { text: "Número de sèrie", value: "ElementIncidencia.SerialNum", sortable: true },
                { text: "Tipus d'element", value: "ElementIncidencia.Model.Subcategory.SubcategoryName", sortable: true },
                { text: "Model", value: "ElementIncidencia.Model.ModelName", sortable: true },
                { text: "Descripció", value: "DescripcioIncidencia", sortable: true },
            ],
            sortBy: "NumMag",
            sortType: "asc",
            incidencies: [],
            loading: true,

            incidencia: null
        }
    },
    async beforeMount() {
        this.incidencies = await this.getIncidencies(null)
        this.incidencies.forEach(incidencia => {
            let dateFromatted = new Date(incidencia.date_created)
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            incidencia.date_created = dateFromatted.toLocaleDateString('ca-ES', options);
        });
    },
    watch: {
        '$route.params.id': async function (id) {
            this.incidencia = await this.getIncidencies(id)
        }
    },
    methods: {
        getIncidencies: async function (id) {
            this.loading = true
            //Obtenir els incidencies de l'element
            let payload = {
                collection: "Incidencia",
                fields: "?fields=*.*.*.*",
                filter: "",
                sort: "&sort[]=-date_created",
                limit: "&limit=-1"
            }
            if (id) {
                payload.filter = "&filter[id][_eq]=" + id
            }
            const incidencia = await store.dispatch("getCollection", payload)
            console.log(await store.dispatch("handlingError", incidencia))
            this.loading = false
            return incidencia.data.data
        },
        showDetail: function (incidencia) {
            this.$router.push({ name: 'Incidencies', params: { id: incidencia.id } })
        },
        formatDate: function (date) {
            let dateFromatted = new Date(date)
            const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
            return dateFromatted.toLocaleDateString('ca-ES', options);
        },
    }
}
</script>