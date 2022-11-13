<template>
    <h1 class="text-center">Collections view</h1>
    <section class="row">
        <div class="col col-md-3 col-sm-9">
            
        </div>
        {{this.$store.state}}
    </section>
</template>
<script>
export default {
    name: 'LoginView',
    components:{
    },
    data(){
        return{
            categories: null
        }
    },
    created(){
        
    },
    async mounted(){
        await this.$store.commit("getItem","Category")
        this.categories = this.$store.getters.getCategories
        console.log("Mounted categories",this.categories)

    },
    computed:{

    },
    methods:{

    }
}
</script>