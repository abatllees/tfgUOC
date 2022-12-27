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
        </EasyDataTable>
        <label for="destinacio">Destinació:</label>
        <select class="form-control" name="destinacio" id="destinacio" v-model="this.$store.state.destinacio">
            <option v-for="delegacio in this.$store.state.Delegacions" :key="delegacio.id" :value="delegacio.ID">
                {{ delegacio.Name }}
            </option>
        </select>
        <button class="btn btn-primary mt-3" @click="realitzarLliurament()">Realitzar lliurament</button>
        <button class="btn btn-secondary mt-3" @click="exportPDF()">Export to PDF</button>
    </section>
    <section id="toPDF" class="w-100">
        <informePDF>
            <template v-slot:destinacio>
                Slot destinació
            </template>
            <template v-slot:dataMoviment>

            </template>
            <template v-slot:lliuratPer>
                {{ this.$store.state.user.first_name }} {{ this.$store.state.user.last_name }}
            </template>
            <template v-slot:entregatA>

            </template>
        </informePDF>
    </section>
</template>
<script>
import LliuramentForm from '@/components/LliuramentForm.vue';
import informePDF from "@/components/InformePDF.vue"
export default {
    name: "LliuramentView",
    components: {
        LliuramentForm,
        informePDF
    },
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

        }
    }
}
</script>