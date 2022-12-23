<template>
    <section class="row">
        <div class="col-12 col-sm-8 col-lg-5 mx-auto">
            <LliuramentForm></LliuramentForm>
        </div>
    </section>
    <section class="w-100 my-2" v-if="false">
        <div class="alert alert-success">
            {{ resultatMoviment }}
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
            ],
            sortBy: "NumMag",
            sortType: "asc",

            resultatMoviment: null
        }
    },
    methods: {
        realitzarLliurament: async function () {
            console.log("Realitzar lliurament")
            this.resultatMoviment = await this.$store.dispatch("realitzarMoviment", this.$store.state.llistatMoviment);
            alert("Res", this.resultatMoviment)
        }
    }
}
</script>