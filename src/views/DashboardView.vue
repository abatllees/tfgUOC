<template>
  <main>
    <h1 class="text-center">Tauler principal</h1>
    <section class="row">
      <div class="col-6 col-sm-4 col-md-2" v-for="option in options" :key="option">
        <CardButton :msg="option.name" :id="option.id"></CardButton>
      </div>
    </section>
  </main>
</template>

<script>
import router from "@/router"

import CardButton from "@/components/CardButton.vue"
export default {
  name: 'DashboardView',
  components: {
    CardButton
  },
  data() {
    return {
      options: [
        {
          id: 0,
          icon: "none",
          name: "Lliurament de material"
        },
        {
          id: 1,
          icon: "plane",
          name: "Lliurament en préstec"
        },
        {
          id: 2,
          icon: "plane",
          name: "Retorn de material"
        }
      ]
    }
  },
  created() {
    if (!localStorage.getItem('access_token')) {
      router.push("/login")
    }
  }
}
</script>
