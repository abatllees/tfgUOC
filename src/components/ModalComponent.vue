<template>
    <transition name="modal-fade">
        <div class="modal-backdrop">
            <div class="modal" role="dialog" aria-labelledby="modalTitle" aria-describedby="modalDescription">
                <header class="modal-header" id="modalTitle">
                    <slot name="header">
                        Seleccionar element
                    </slot>
                    <button type="button" class="btn btn-primary" @click="close" aria-label="Close modal">
                        x
                    </button>
                </header>
                <section class="modal-body" id="modalDescription">
                    <slot name="body">
                        <EasyDataTable :headers="this.headers" :items="this.$store.state.Element" alternating
                            buttons-pagination v-model:items-selected="itemsSelected" :sort-by="this.sortBy"
                            :sort-type="this.sortType">
                        </EasyDataTable>
                    </slot>
                </section>
                <footer class="modal-footer">
                    <slot name="footer">
                        <button class="btn btn-primary" @click="addElement(this.itemsSelected)">Afegeix element</button>
                    </slot>
                </footer>
            </div>
        </div>
    </transition>
</template>
<script>
export default {

    name: 'ModalComponent',
    components: {
        EasyDataTable: window['vue3-easy-data-table'],
    },
    data() {
        return {
            headers: [
                { text: "Núm. Mag", value: "NumMag", sortable: true },
                { text: "Model", value: "Model.ModelName", sortable: true },
                { text: "Número de sèrie", value: "SerialNum", sortable: true },
                { text: "Delegació", value: "DelegacioActual.Name", sortable: true },
            ],
            sortBy: "NumMag",
            sortType: "asc",
            itemsSelected: []
        }
    },

    methods: {
        close() {
            this.$emit('close');
        },
        addElement(itemsSelected) {
            //Add element to list
            console.log(itemsSelected)
            this.itemsSelected.forEach(item => this.$store.state.llistatLliurament.push(item))
            //this.$store.state.llistatLliurament.push(itemsSelected)
        }
    },
};
</script>
<style scoped>
.modal-backdrop {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.3);
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal {
    position: relative;
    width: 50%;
    height: auto;
    background: #FFFFFF;
    box-shadow: 2px 2px 20px 1px;
    overflow: none;
    display: flex;
    flex-direction: column;
}

.modal-header,
.modal-footer {
    padding: 15px;
    display: flex;
}

.modal-header {
    position: relative;
    border-bottom: 1px solid #eeeeee;
    color: #bb0000;
    justify-content: space-between;
}

.modal-footer {
    border-top: 1px solid #eeeeee;
    flex-direction: column;
}

.modal-body {
    position: relative;
    padding: 20px 10px;
}

.btn-close {
    position: absolute;
    top: 0;
    right: 0;
    border: none;
    font-size: 20px;
    padding: 10px;
    cursor: pointer;
    font-weight: bold;
    color: #4AAE9B;
    background: transparent;
}


.modal-fade-enter,
.modal-fade-leave-to {
    opacity: 0;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
    transition: opacity .5s ease;
}
</style>