<template>
    <div class="card text-white text-center h-100">
        <h2>{{msg}}</h2>
    </div>
</template>

<script>

export default {
  name: 'CardButton',
  props: {
    msg: String
  }
}
</script>

<style scoped>
.card{
    background-color: #bb0000;
    border-radius: 0px;
}
</style>
