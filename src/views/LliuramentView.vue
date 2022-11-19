<template>
    <section class="row">
        <div class="col-12 col-sm-8 col-md-5 mx-auto">
            <LliuramentForm></LliuramentForm>
        </div>
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

        }
    }
}
</script>