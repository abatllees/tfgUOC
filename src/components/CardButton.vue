<template>
  <div class="card text-white text-center h-100">
    <font-awesome-icon :icon="icon" size="4x" class="py-2" />
    <h5> {{ title }}</h5>
    <p class="text-right">{{ owner?.first_name }} {{ owner?.last_name }}</p>
  </div>
</template>

<script>

export default {
  name: 'CardButton',
  props: {
    title: String,
    icon: String,
    owner: String
  }
}
</script>

<style scoped>
.card {
  background-color: #bb0000;
  border-radius: 0px;
  padding: 8px 16px 8px 16px;
}

a {
  color: white;
  text-decoration: none;
}
</style>
