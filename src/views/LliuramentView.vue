<template>
    <section class="row">
        <div class="col-12 col-sm-8 col-md-5 mx-auto">
            <LliuramentForm></LliuramentForm>
        </div>
    </section>
    <section class="row my-5">
        <section class="col mx-auto">
            <EasyDataTable :headers="this.headers" :items="this.$store.state.llistatLliurament" alternating
                buttons-pagination v-model:items-selected="this.itemsSelected" :sort-by="this.sortBy"
                :sort-type="this.sortType">
            </EasyDataTable>
            <button class="btn btn-primary mt-3" @click="realitzarLliurament()">Realitzar lliurament</button>
        </section>
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
                { text: "Número magatzem", value: "NumMag", sortable: true },
                { text: "Subcategoria", value: "Subcategory", sortable: true },
                { text: "Marca", value: "Marca", sortable: true },
                { text: "Model", value: "Model", sortable: true },
                { text: "Número de sèrie", value: "SerialNum", sortable: true },
                { text: "Delegació actual", value: "DelegacioActual", sortable: true },
            ],
            itemsSelected: [],
            sortBy: "",
            sortType: ""
        }
    },
    methods: {
        realitzarLliurament: function () {
            console.log("Realitzar lliurament")
            this.$store.dispatch("handleEntrega");
        }
    }
}
</script>