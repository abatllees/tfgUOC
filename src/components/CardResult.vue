<template>
    <p>{{ result.Model?.Subcategory.SubcategoryName }} {{ result.Model?.Brand.BrandName }} {{ result.Model?.ModelName }}
        <br>{{ result?.NumMag }}<br>
        <span class="fw-bold">{{ result.SerialNum }}</span>
    </p>
</template>

<script>
export default {
    name: "CardResult",
    props: {
        result: Object
    }
}
</script>
<style>

</style>