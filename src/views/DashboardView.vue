<template>
  <main>
    <h1 class="text-center">Tauler principal</h1>
    <section class="row">
      <div class="col-6 col-sm-4 col-md-2" v-for="option in options" :key="option">
        <router-link :to="{ path: option.router, params: { id: '2' } }">
          <CardButton :msg="option.name" :icon="option.icon"></CardButton>
        </router-link>
      </div>
    </section>
    <section class="row">

    </section>
    <section class="row">
      <h5>Material en préstec pendent de retornar</h5>
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
          icon: "fa-solid fa-plane-departure",
          router: "lliurament",
          name: "Lliurament de material"
        },
        {
          id: 2,
          icon: "fa-solid fa-plane-arrival",
          router: "retorn",
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
