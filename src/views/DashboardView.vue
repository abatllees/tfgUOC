<template>
  <main>
    <h1 class="text-center">Tauler principal</h1>
    <section class="row">
      <div class="col-6 col-sm-4 col-md-2" v-for="option in options" :key="option">
        <CardButton :msg="option.name"></CardButton>
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
          icon: "none",
          name: "Lliurament de material"
        },
        {
          icon: "plane",
          name: "Lliurament en préstec"
        }, {
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
