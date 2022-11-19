<template>
    <section class="row">
        <div class="col-12 col-sm-8 col-md-5 mx-auto">
            <LliuramentForm></LliuramentForm>
        </div>
    </section>
    <section class="row my-5">
        <section class="col mx-auto">
            <TableList></TableList>
        </section>
    </section>
</template>
<script>
import TableList from '@/components/TableList.vue';
import LliuramentForm from '@/components/LliuramentForm.vue';
export default {
    name: "LliuramentView",
    components: {
        LliuramentForm,
        TableList,
    },
    data() {
        return {

        }
    }
}
</script>