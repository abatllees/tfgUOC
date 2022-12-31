<template>
    <section class="row">
        <div class="col-12 col-sm-8 col-lg-5 mx-auto">
            <LliuramentForm></LliuramentForm>
        </div>
    </section>
    <section class="w-100 my-2" v-if="this.resultatMoviment">
        <div class="alert" v-bind:class="resultatMoviment.alertType">
            <ul class="list-unstyled">
                <li v-for="resposta in resultatMoviment.message" :key="resposta"> {{ resposta }}</li>
            </ul>
        </div>
    </section>
    <section class="w-100 my-5">
        <EasyDataTable :headers="this.headers" :items="this.$store.state.llistatMoviment" alternating buttons-pagination
            :sort-by="this.sortBy" :sort-type="this.sortType" :theme-color="this.$store.state.themeColor">
            <template #item-operation="item">
                <div class="operation-wrapper">
                    <i class="bi bi-trash"></i>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                        class="bi bi-trash" viewBox="0 0 16 16" @click="deleteItem(item)">
                        <path
                            d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                        <path fill-rule="evenodd"
                            d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
                    </svg>
                </div>
            </template>
        </EasyDataTable>
        <button class="btn btn-primary mt-3" @click="realitzarLliurament()">Realitzar lliurament</button>
        <button class="btn btn-secondary mt-3" @click="exportPDF()">Export to PDF</button>
    </section>
</template>
<script>
import LliuramentForm from '@/components/LliuramentForm.vue';
export default {
    name: "LliuramentView",
    components: {
        LliuramentForm
    },
    data() {
        return {
            headers: [
                { text: "Núm. Mag", value: "NumMag", sortable: true },
                { text: "Subcategoria", value: "Model.Subcategory.SubcategoryName", sortable: true },
                { text: "Marca", value: "Model.Brand.BrandName", sortable: true },
                { text: "Model", value: "Model.ModelName", sortable: true },
                { text: "Número de sèrie", value: "SerialNum", sortable: true },
                { text: "Operation", value: "operation" },

            ],
            sortBy: "NumMag",
            sortType: "asc",

            resultatMoviment: null,


        }
    },
    methods: {
        realitzarLliurament: async function () {
            console.log("Realitzar lliurament")
            const response = await this.$store.dispatch("realitzarMoviment", this.$store.state.llistatMoviment);
            this.resultatMoviment = await this.$store.dispatch("handlingError", response)
        },
        exportPDF() {
            const payload = {
                idItem: "toPDF",
                options: {
                    margin: 2,
                    filename: 'export.pdf',
                    html2canvas: { scale: 10 },
                    jsPDF: { unit: 'cm', format: 'a3', orientation: 'portrait' },
                    quality: 2
                }
            }
            this.$store.dispatch("exportToPDF", payload)
        },
        deleteItem(item) {
            const findItem = this.$store.state.llistatMoviment.find(e => e.SerialNum == item.SerialNum);
            const index = this.$store.state.llistatMoviment.indexOf(findItem);
            this.$store.state.llistatMoviment.splice(index, 1)
        }
    }
}
</script>