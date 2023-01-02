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
    <section class="w-100 my-5" id="toPDF">
        <EasyDataTable :headers="this.headers" :items="this.$store.state.llistatMoviment" alternating buttons-pagination
            :sort-by="this.sortBy" :sort-type="this.sortType" :theme-color="this.$store.state.themeColor">
            <template #item-operation="item">
                <div class="operation-wrapper">
                    <i class="bi bi-trash" style="font-size: 1rem" @click="deleteItem(item)"></i>
                </div>
            </template>
        </EasyDataTable>
        <button class="btn btn-primary mt-3" @click="realitzarLliurament()">Realitzar lliurament</button>
        <button class="btn btn-secondary mt-3" @click="exportPDF()">Export to PDF</button>
    </section>
</template>
<script>
import LliuramentForm from '@/components/LliuramentForm.vue';
import jsPDF from 'jspdf'
import html2pdf from "html2pdf"


export default {
    name: "LliuramentView",
    components: {
        LliuramentForm
    },
    data() {
        return {
            headers: [
                { text: "Tipus de material", value: "Model.Subcategory.SubcategoryName", sortable: true },
                { text: "Marca", value: "Model.Brand.BrandName", sortable: true },
                { text: "Model", value: "Model.ModelName", sortable: true },
                { text: "Núm. Mag", value: "NumMag", sortable: true },
                { text: "Número de sèrie", value: "SerialNum", sortable: true },
                { text: "Accions", value: "operation" },

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
        async exportPDF() {

            const contentCanvas = await html2pdf(document.getElementById("toPDF"));
            const image = contentCanvas.toDataURL("image/png");
            var doc = new jsPDF();
            doc.addImage(image, "png", 0, 0);
            doc.save("resumse.pdf");

            /*doc.html(document.getElementById("toPDF"), {
                callback: function (doc) {
                    doc.scale(0.2, 0.2)

                    doc.save();
                }
            })*/
            //doc.text("Hello world!", 10, 10);
            //doc.save("a4.pdf"); // will save the file in the current working directory
        },
        deleteItem(item) {
            const findItem = this.$store.state.llistatMoviment.find(e => e.SerialNum == item.SerialNum);
            const index = this.$store.state.llistatMoviment.indexOf(findItem);
            this.$store.state.llistatMoviment.splice(index, 1)
        }
    }
}
</script>