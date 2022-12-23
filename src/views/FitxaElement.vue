<template>
    <section class="row">
        <div class="col-12 col-sm-6 col-lg-9">
            <h1>{{ element.Model.Subcategory.SubcategoryName }} {{ element.Model.Brand.BrandName }} {{
                    element.Model.ModelName
            }}
            </h1>
            <p>Número de sèrie: {{ element.SerialNum }}</p>
            <p>Número de magatzem: {{ element.NumMag }}</p>
            <p>Responsable: {{ }}</p>
            <p>Estat: <span class="dot"></span>
                {{ element.status }}</p>
            <p>Observacions:<br>
                {{ element.Observacions }}</p>
        </div>
        <div class="col-12 col-lg">
            <img src="" alt="Imatge del model" class="img">
        </div>
    </section>
    <section class="row">
        <div class="col-12 col-lg">
            <h6>Historial de moviments</h6>
            <EasyDataTable :headers="this.historialMoviments.headers" :items="this.historialMoviments.items" alternating
                buttons-pagination :sort-by="this.historialMoviments.sortBy"
                :sort-type="this.historialMoviments.sortType" :theme-color="this.$store.state.themeColor"
                :loading="this.historialMoviments.loading">
            </EasyDataTable>
        </div>
        <div class="col-12 col-lg">
            <h6>Incidències</h6>
            <EasyDataTable :headers="this.incidencies.headers" :items="this.incidencies.items" alternating
                buttons-pagination :sort-by="this.incidencies.sortBy" :sort-type="this.incidencies.sortType"
                :theme-color="this.$store.state.themeColor">
            </EasyDataTable>
            <button class="btn btn-primary mt-1">Crear incidència</button>
        </div>
        <div class="col-12 col-lg">
            <h6>Equips assignats</h6>
            <EasyDataTable :headers="this.accessoris.headers" :items="this.accessoris.items" alternating
                buttons-pagination :sort-by="this.accessoris.sortBy" :sort-type="this.accessoris.sortType"
                :theme-color="this.$store.state.themeColor">
            </EasyDataTable>
            <button class="btn btn-primary mt-1">Gestionar accessoris</button>
        </div>
    </section>
</template>
<script>
export default {
    name: "FitxaElement",
    data() {
        return {
            element: null,
            historialMoviments: {
                headers: [
                    { text: "Data", value: "date_created", sortable: true },
                    { text: "Origen", value: "Origen.Name", sortable: true },
                    { text: "Destí", value: "Desti.Name", sortable: true },
                    { text: "Realitzat per", value: "user_created.first_name", sortable: true },
                ],
                items: [],
                sortBy: "",
                sortType: "asc",
                loading: true
            },
            incidencies: {
                headers: [
                    { text: "Data", value: "date_created", sortable: true },
                    { text: "OPI", value: "Origen.Name", sortable: true },
                    { text: "Estat", value: "Desti.Name", sortable: true },
                    { text: "Registrada per", value: "user_created.first_name", sortable: true },
                ],
                items: [],
                sortBy: "",
                sortType: "asc"
            },
            accessoris: {
                headers: [
                    { text: "Model", value: "Model.Subcategory.SubcategoryName", sortable: true },
                    { text: "Model", value: "Model.ModelName", sortable: true },
                    { text: "Número de sèrie", value: "SerialNum", sortable: true },
                ],
                items: [],
                sortBy: "",
                sortType: "asc"
            }
        }
    },
    async beforeCreate() {
        let params = {
            collection: "Element",
            item: this.$route.params.SerialNum,
            fields: "?fields=*.*.*",
            filter: ""
        }
        this.element = await this.$store.dispatch("getElement", params)
        let payload = {
            collection: "Moviment",
            fields: "?fields=Element,date_created,Origen.Name,Desti.Name,user_created.first_name,user_created.last_name",
            filter: "&filter[status][_eq]=published&filter[Element][_eq]=" + this.$route.params.SerialNum,
            sort: ""
        }
        this.historialMoviments.items = await this.getItems(payload)
        this.historialMoviments.loading = !this.historialMoviments.loading

        payload = {
            collection: "Element",
            fields: "?fields=*.*.*",
            filter: "&filter[status][_eq]=published&filter[ElementPare][_eq]=" + this.$route.params.SerialNum,
            sort: ""
        }
        this.accessoris.items = await this.getItems(payload)

    },
    methods: {
        getItems: function (payload) {
            return this.$store.dispatch("getCollection", payload)
        }
    }
}
</script>
<style scoped>
.dot {
    height: 15px;
    width: 15px;
    background-color: #027505;
    border-radius: 50%;
    display: inline-block;
}
</style>