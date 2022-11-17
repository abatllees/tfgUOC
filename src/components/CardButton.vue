<template>
  <div class="card text-white text-center h-100">
    <font-awesome-icon :icon="icon" size="4x" class="py-2" />
    <h5> {{ msg }}</h5>
  </div>
</template>

<script>

export default {
  name: 'CardButton',
  props: {
    msg: String,
    icon: String
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
