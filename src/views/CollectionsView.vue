<template>
    <h1 class="text-center">Collections view</h1>
    <section class="row">
        <div class="col col-md-3 col-sm-9">
            
        </div>
        {{this.$store.state}}
    </section>
</template>
<script>
import { mapState, mapGetters } from 'vuex'

export default {
    name: 'CollectionsView',
    components:{
    },
    data(){
        return{
        }
    },
    created(){
        
    },
    mounted(){
        this.$store.dispatch('getItem',"Category")
        this.$store.dispatch('getItem',"Subcategory")

    },
    computed:{
        ...mapState(['Category']),
        ...mapGetters(['getCategories'])
    },
    methods:{

    }
}
</script>