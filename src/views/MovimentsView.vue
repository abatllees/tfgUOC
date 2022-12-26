<template>
    <h1 class="text-center">Moviments</h1>
    <form class="my-3">
        <div class="row">
            <div class="form-group col-md-3 mb-2">
                <label for="delegacio">Selecciona una delegació</label>
                <select class="form-control" id="delegacio" name="delegacio" v-model="FiltreDelegacio">
                    <option value="">--TOTES LES DELEGACIONS--</option>
                    <option v-for="delegacio in this.$store.state.Delegacions" :key="delegacio" :value="delegacio.ID">{{
                            delegacio.Name
                    }}
                    </option>
                </select>
            </div>
        </div>
    </form>
    <EasyDataTable :headers="this.headers" :items="this.moviments" alternating buttons-pagination :sort-by="this.sortBy"
        :sort-type="this.sortType" :loading="this.loading" :theme-color="this.$store.state.themeColor">
    </EasyDataTable>
</template>
<script>

export default {
    name: "MovimentsView",
    data() {
        return {
            headers: [
                { text: "Núm. Mag", value: "Element.NumMag", sortable: true },
                { text: "Subcategoria", value: "Element.Model.Subcategory.SubcategoryName", sortable: true },
                { text: "Marca", value: "Element.Model.Brand.BrandName", sortable: true },
                { text: "Model", value: "Element.Model.ModelName", sortable: true },
                { text: "Número de sèrie", value: "Element.SerialNum", sortable: true },
                { text: "Data", value: "date_created", sortable: true },
                { text: "Realitzat per", value: "user_created.first_name", sortable: true },
                { text: "", value: "user_created.last_name", sortable: true },
                { text: "Origen", value: "Origen.Name", sortable: true },
                { text: "Destí", value: "Desti.Name", sortable: true },
            ],
            moviments: [],
            sortBy: "",
            sortType: "asc",

            FiltreDelegacio: "",

            loading: true,
            params: {
                collection: "Moviment",
                fields: "?fields=Element.*.*.*,Origen.Name,Desti.Name,user_created.first_name,user_created.last_name,date_created",
                filter: "&filter[status][_eq]=published&limit=-1",
                sort: ""
            },
        }
    },
    watch: {
        async FiltreDelegacio() {
            //Si el desplegable és un número filtra per la ID de la delegació
            this.loading = true
            if (typeof (this.FiltreDelegacio) == "number") {
                this.params.filter = "&filter[_or][1][Origen][_eq]=" + this.FiltreDelegacio + "&filter[_or][2][Desti][_eq]=" + this.FiltreDelegacio

            } else {
                //Mostra tots els moviments
                this.params.filter = "&filter[status][_eq]=published"
            }

            this.moviments = await this.getMoviments()

            this.loading = false
        },
    },
    methods: {
        async getMoviments() {
            return await this.$store.dispatch("getCollection", this.params);
        }
    },
    async beforeMount() {
        this.moviments = await this.getMoviments()
        this.loading = false
    },
}
</script>