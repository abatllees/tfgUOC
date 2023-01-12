<template>
    <p v-if="result.Model?.Subcategory">
        {{ result.Model.Subcategory.SubcategoryName }} {{ result.Model.Brand.BrandName }} {{
            result.Model.ModelName
        }}
        <br>{{ result?.NumMag }}<br>
        <span class="fw-bold">{{ result.SerialNum }}</span>
    </p>
    <p v-else>
        {{ result.ModelName }}
    </p>
</template>

<script>
export default {
    name: "CardResult",
    props: {
        result: Object
    },
    created() {
        console.log(this.result)
    }
}
</script>
<style>

</style>