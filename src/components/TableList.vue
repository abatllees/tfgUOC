<template>
    <EasyDataTable :headers="this.headers" :items="this.items" />
</template>
  
<script >
export default {
    name: "TableList",
    components: {
        EasyDataTable: window['vue3-easy-data-table'],
    },
    data() {
        return {
            headers: [
                { text: "PLAYER", value: "player" },
                { text: "TEAM", value: "team" },
                { text: "NUMBER", value: "number" },
                { text: "POSITION", value: "position" },
                { text: "HEIGHT", value: "indicator.height" },
                { text: "WEIGHT (lbs)", value: "indicator.weight", sortable: true },
                { text: "LAST ATTENDED", value: "lastAttended" },
                { text: "COUNTRY", value: "country" },
            ],
            items: [
                { player: "Stephen Curry", team: "GSW", number: 30, position: 'G', indicator: { "height": '6-2', "weight": 185 }, lastAttended: "Davidson", country: "USA" },
            ]
        }
    }
}
</script>