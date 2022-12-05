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
      <EasyDataTable :headers="this.headers" :items="this.items" alternating buttons-pagination
        v-model:items-selected="itemsSelected" :sort-by="this.sortBy" :sort-type="this.sortType">
      </EasyDataTable>
    </section>
  </main>
</template>

<script>
import router from "@/router"

import CardButton from "@/components/CardButton.vue"
export default {
  name: 'DashboardView',
  components: {
    CardButton,
    EasyDataTable: window['vue3-easy-data-table']
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
      ],
      headers: [],
      items: [],
      itemsSelected: [],
      sortBy: "",
      sortType: "asc"
    }
  },
  created() {
    if (!sessionStorage.getItem('access_token')) {
      router.push("/login")
    }
  }
}
</script>
