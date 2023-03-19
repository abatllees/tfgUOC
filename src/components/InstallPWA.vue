<!-- PWAPrompt.vue -->
<template>
    <div v-if="shown">
        Has provat la nostra APP?
        <button @click="installPWA">
            Sí!
        </button>

        <button @click="dismissPrompt">
            No, gràcies
        </button>
    </div>
</template>

<script>
export default {
    data: () => ({
        shown: false,
    }),

    beforeMount() {
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault()
            this.installEvent = e
            this.shown = true
        })
    },

    methods: {
        dismissPrompt() {
            this.shown = false
        },

        installPWA() {
            this.installEvent.prompt()
            this.installEvent.userChoice.then((choice) => {
                this.dismissPrompt() // Hide the prompt once the user's clicked
                if (choice.outcome === 'accepted') {
                    // Do something additional if the user chose to install
                } else {
                    // Do something additional if the user declined
                }
            })
        },
    }
}
</script>