<template>
    <p v-if="result.Model?.Subcategory">
        {{ result.Model.Subcategory.SubcategoryName }} {{ result.Model.Brand.BrandName }} {{
            result.Model.ModelName
        }}
        <br>{{ result?.NumMag }}<br>
        <span class="fw-bold">{{ result.SerialNum }}</span>
    </p>
    <div v-else>
        {{ result.Subcategory?.SubcategoryName }} {{ result.Brand?.BrandName }} {{ result.ModelName }}
    </div>
</template>

<script>
export default {
    name: "CardResult",
    props: {
        result: Object
    },
}
</script>
<style>

</style>