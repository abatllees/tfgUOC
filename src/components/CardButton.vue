<template>
  <div class="card text-white text-center h-100" :style="style">
    <i size="4x" class="py-2 4x" v-bind:class="icon" style="font-size: 3.5rem"></i>
    <h5> {{ title }}</h5>
    <p class="text-right">{{ subtitle }}</p>
  </div>
</template>

<script>

export default {
  name: 'CardButton',
  props: {
    title: String,
    icon: String,
    subtitle: String,
    bgColor: String
  },
  data() {
    return {
      style: {
        backgroundColor: this.bgColor
      }
    }
  }
}
</script>

<style scoped>
.card {

  border-radius: 0px;
  padding: 8px 16px 8px 16px;
}

a {
  color: white;
  text-decoration: none;
}
</style>
