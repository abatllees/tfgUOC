<template>
    <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
        aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <header class="modal-header" id="modalTitle">
                    <slot name="header">

                    </slot>
                    <button type="button" class="btn btn-secondary" data-dismiss="modal" aria-label="Close modal">
                        x
                    </button>
                </header>
                <section class="modal-body" id="modalDescription">
                    <slot name="body">
                        <p> Body</p>
                    </slot>
                </section>
                <footer class="modal-footer">
                    <slot name="footer">
                        <p>Footer</p>
                    </slot>
                </footer>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'ModalComponent',
    props: {
        items: Object
    },
    components: {
    },
    data() {
        return {

        }
    },

    methods: {
        close() {
            this.$emit('close');
        },

    },
};
</script>
<style scoped>
/*.modal-backdrop {
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
}*/
</style>