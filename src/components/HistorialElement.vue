<template>
    <h5>Històric</h5>
    <div class="list-group">
        <a href="#" class="list-group-item list-group-item-action" v-for="activity in activities" :key="activity">
            <div class="d-flex w-100 justify-content-between">
                <small>{{ activity.timestamp }}</small>
            </div>
            <p class="mb-1">{{ activity.action }}</p>
            <small>{{ activity.user.first_name }} {{ activity.user.last_name }}</small>
        </a>
    </div>
</template>
<script>
import api from "@/api"
export default {
    name: "HistorialElement",
    props: {
        item: String
    },
    data() {
        return {
            activities: null
        }
    },
    async beforeMount() {
        const params = {
            fields: "?fields=id,action,user.first_name,user.last_name,timestamp,colelction,item,revisions.*",
            filter: "&filter[item][_eq]=" + this.item,
            sort: "&sort[]=-timestamp",
            limit: "&limit=3"
        }
        const activities = await new Promise((resolve) => {
            api.get("activity/" + params.fields + params.filter + params.sort + params.limit)
                .then(response => {
                    resolve(response)
                })
                .catch(error => {
                    resolve(error.response)
                })
        })
        this.activities = activities.data.data


        this.activities.forEach(activity => {
            let dateFromatted = new Date(activity.timestamp)
            const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: 'numeric', minute: 'numeric' };
            activity.timestamp = dateFromatted.toLocaleDateString('ca-ES', options);
        });
        console.log(this.activities)
    }
}
</script>