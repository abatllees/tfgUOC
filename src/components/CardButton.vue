<template>
  <div class="card text-white text-center h-100">
    <h2>
      <router-link :to="{ name: 'subcollection', params: { id: this.id } }">{{ msg }} </router-link>
    </h2>
  </div>
</template>

<script>

export default {
  name: 'CardButton',
  props: {
    msg: String,
    id: Number
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

a:hover {
  color: inherit;
  text-decoration: underline;
}
</style>
