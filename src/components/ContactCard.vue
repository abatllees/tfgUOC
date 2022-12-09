<template>
    <div class="card p-2">
        <div class="float-left">
            <p><span class="font-weight-bold">Persona de contacte</span><br>
                {{ (contactPerson?.first_name + " " + contactPerson?.last_name) }}</p>
            <p><span class="font-weight-bold">Informació de contacte</span><br>
                <a :href="'mailto:${contactPerson.email}'">{{ contactPerson.email }}</a>
            </p>
        </div>
        <div class="float-right">
            <img src="@/assets/logo.png" style="width: 100px" alt="ImageNotFound">
        </div>
    </div>
</template>
<script>
export default {
    name: "ContactCard",
    props: {
        contactPerson: Object
    },
    components: {

    },
    data() {
        return {

        }
    }
}
</script>

<style scoped>
.card {
    border: 0;
    border-radius: 0;
    background-color: #bb0000;
    color: white
}

a {
    color: inherit;
}

a:hover {
    color: inherit
}
</style>