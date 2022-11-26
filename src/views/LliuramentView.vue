<template>
    <section class="row">
        <div class="col-12 col-sm-8 col-md-5 mx-auto">
            <LliuramentForm></LliuramentForm>
        </div>
    </section>
    <section class="w-100 my-5">
        <EasyDataTable :headers="this.headers" :items="this.$store.state.llistatLliurament" alternating
            buttons-pagination :sort-by="this.sortBy" :sort-type="this.sortType">
        </EasyDataTable>
        <button class="btn btn-primary mt-3" @click="realitzarLliurament()">Realitzar lliurament</button>
    </section>
</template>
<script>
import LliuramentForm from '@/components/LliuramentForm.vue';
export default {
    name: "LliuramentView",
    components: {
        LliuramentForm,
    },
    data() {
        return {
            headers: [
                { text: "Núm. Mag", value: "NumMag", sortable: true },
                { text: "Subcategoria", value: "Model.Subcategory.SubcategoryName", sortable: true },
                { text: "Marca", value: "Model.Brand.BrandName", sortable: true },
                { text: "Model", value: "Model.ModelName", sortable: true },
                { text: "Número de sèrie", value: "SerialNum", sortable: true },
                { text: "Delegació actual", value: "DelegacioActual.Name", sortable: true },
                { text: "Delegació actual", value: "DelegacioActual.ID", sortable: true },
            ],
            sortBy: "NumMag",
            sortType: "asc"
        }
    },
    methods: {
        realitzarLliurament: function () {
            console.log("Realitzar lliurament")
            this.$store.dispatch("handleEntrega", this.$store.state.llistatLliurament);
        }
    }
}
</script>