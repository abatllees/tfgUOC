<template>
  <div class="card text-white text-center h-100">
    <h1> {{ count }}</h1>
    <p> Model: {{ model }}</p>
  </div>
</template>

<script>

export default {
  name: 'CardCount',
  props: {
    count: Number,
    model: String
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
