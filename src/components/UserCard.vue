<template>
    <div class="card">
        <img class="card-img-top w-100 my-2" :src="'https://weekob4y.directus.app/assets/' + this.imageURL"
            alt="Fotografia de perfil">
        <div class=" card-body">
            <h5 class="card-title text-center">{{ name }} {{ last_name }}</h5>
            <a v-if="email" :href="'mailto:' + email" class="btn btn-secondary w-100">Contacta</a>
        </div>
    </div>
</template>
<script>
import api from "@/api"
export default {
    name: "UserCard",
    components: {

    },
    props: {
        name: String,
        last_name: String,
        email: String,
        avatar: String
    },
    data() {
        return {
            imageURL: null,
        }
    },
    async beforeMount() {
        if (this.avatar) {
            console.log("I HAVE A FOTO", this.name + this.last_name, this.avatar)
            return this.imageURL = await new Promise((resolve, reject) => {
                api.get("assets/" + this.avatar.filename_disk + "?height=200")
                    .then(response => {
                        resolve(response.config.url)
                    })
                    .catch(error => reject(error.message))
            })
        }

    }
}
</script>

<style scoped>
.card {
    background-color: #bb0000;
    color: white;
    border-radius: 0;
    border-color: initial;
}

.card-img-top {
    background-color: #dddddd;
    height: 200px;
    border-radius: 0;
}
</style>