<template>
    <transition name="modal-fade">
        <div class="modal-backdrop">
            <div class="modal" role="dialog" aria-labelledby="modalTitle" aria-describedby="modalDescription">
                <header class="modal-header" id="modalTitle">
                    <slot name="header">
                        This is the default tile!
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
                        This is the default footer!
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
                { text: "Número magatzem", value: "NumMag" },
                { text: "Número de sèrie", value: "SerialNum" },
            ],
            sortBy: "NumMag",
            sortType: "asc"
        }
    },
    props: {
        model: Number
    },
    methods: {
        close() {
            this.$emit('close');
        },
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
    width: 80%;
    height: 50%;
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
    color: #4AAE9B;
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

.btn-green {
    color: white;
    background: #4AAE9B;
    border: 1px solid #4AAE9B;
    border-radius: 2px;
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