<template>
    <h1 class="text-center">Magatzem de rodatges C.E.I.</h1>
    <section class="row my-3">
        <div class="col">Data del moviment: <slot name="dataMoviment"></slot> {{ today }}
        </div>
        <div class="col">Destinació: <slot name="destinacio">Destinació</slot>
        </div>
    </section>
    <EasyDataTable :headers="this.headers" :items="this.$store.state.llistatMoviment" alternating buttons-pagination
        :sort-by="this.sortBy" :sort-type="this.sortType" :theme-color="this.$store.state.themeColor">
    </EasyDataTable>
    <section class="row my-3">
        <div class="col">Lliurat per: <slot name="lliuratPer">Lliurat per</slot>
        </div>
        <div class="col">Entregat a:<slot name="entregatA">Entregat a</slot>
        </div>
    </section>
</template>
<script>
export default {
    name: "InformePDF.vue",
    data() {
        return {
            headers: [
                { text: "Núm. Mag", value: "NumMag", sortable: true },
                { text: "Subcategoria", value: "Model.Subcategory.SubcategoryName", sortable: true },
                { text: "Marca", value: "Model.Brand.BrandName", sortable: true },
                { text: "Model", value: "Model.ModelName", sortable: true },
                { text: "Número de sèrie", value: "SerialNum", sortable: true },
            ],
            sortBy: "NumMag",
            sortType: "asc",

            today: null
        }
    }, created() {
        const month = [
            "Gener", "Febrer", "Març", "Abril", "Maig", "Juny", "Juliol", "Agost", "Setembre", "Octubre", "Novembre", "Desembre",
        ];
        const today = new Date();
        this.today = today.getDate() + " de " + (month[today.getMonth()]) + " del " + today.getFullYear();
    }
}
</script>

<style scoped>

</style>>