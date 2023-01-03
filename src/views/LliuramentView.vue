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
            :sort-by="this.sortBy" :sort-type="this.sortType" :theme-color="this.$store.state.themeColor" id="data">
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
import autoTable from 'jspdf-autotable'



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
            const doc = new jsPDF()

            //Capçaleres de la taula
            let head = []
            //Array d'elements. 
            let elements = []
            //Omplena les dades de la taula
            this.headers.forEach(titol => {
                head.push(titol.text)
            })
            this.$store.state.llistatMoviment.forEach(element => {
                elements.push([
                    element.Model.Subcategory.SubcategoryName,
                    element.Model.Brand.BrandName,
                    element.Model.ModelName,
                    element.NumMag,
                    element.SerialNum
                ])

            })



            const amplada = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
            const desti = await this.obtenirDestinacio(this.$store.state.destinacio)


            //Títol
            doc.setFontSize(22)
            doc.text("Magatzem de rodatges", amplada / 2, 40, { align: "center" })
            //Subtítol
            doc.setFontSize(15)
            doc.text("Lliurament de material", amplada / 2, 48, { align: "center" })
            //Informació del moviment
            doc.setFontSize(12)
            doc.text("Data:", 10, 65)
            doc.text("Destinació: " + desti.Name, amplada - amplada / 2, 65)
            doc.text("Realitzat per: " + this.$store.state.user.first_name + " " + this.$store.state.user.last_name, 10, 71)
            doc.text("Entregat a: " + desti.ResponsableDelegacio.first_name + " " + desti.ResponsableDelegacio.last_name, amplada - amplada / 2, 71)
            //Mostra la taula
            autoTable(doc, {
                head: [head],
                body: elements,
                startY: 80,
                margin: 10,
                headStyles: { fillColor: [187, 0, 0] }
            },)
            doc.save('table.pdf')
        },
        obtenirDestinacio: async function (destinacio) {
            let params = {
                collection: "Delegacio",
                item: destinacio,
                fields: "?fields=Name,ResponsableDelegacio.*",
                filter: "",
                sort: ""
            }
            return await this.$store.dispatch("getElement", params);
            //this.resultatMoviment =  this.$store.dispatch("handlingError", response)

        }
    },
    deleteItem(item) {
        const findItem = this.$store.state.llistatMoviment.find(e => e.SerialNum == item.SerialNum);
        const index = this.$store.state.llistatMoviment.indexOf(findItem);
        this.$store.state.llistatMoviment.splice(index, 1)
    },

}

</script>