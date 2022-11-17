<template>
  <div class="card text-white text-center h-100">
    <font-awesome-icon :icon="icon" size="5x" />
    <h2> {{ msg }}</h2>
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
}

a {
  color: white;
  text-decoration: none;
}
</style>
