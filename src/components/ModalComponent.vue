<script>
export default {
    name: 'ModalComponent',
};
</script>
<template>
    <transition name="modal-fade">
        <div class="modal-backdrop">
            <div class="modal" role="dialog">
                <header class="modal-header" id="modalTitle">
                    <slot name="header">
                        <h5>Resultats de la cerca </h5>
                        <button type="button" class="close" @click="$emit('close')">
                            X
                        </button>
                    </slot>
                </header>
                <section class="modal-body" id="modalDescription">
                    <slot name="body">
                        Aquí es mostren els resultats
                    </slot>
                </section>
            </div>
        </div>
    </transition>
</template>
<style>
.modal-backdrop {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal {
    position: relative;
    background: #eeeeee;
    width: 50%;
    height: 30%;
    box-shadow: 2px 2px 20px 1px;
    overflow-x: auto;
    display: flex;
    flex-direction: column;
}

.modal-header {
    padding: 15px;
    display: flex;

    border-bottom: 1px solid black;
    font-size: 30px;
    color: #bb0000;
}

.modal-body {}

.close {
    border: none;
    font-size: 30px;
    margin-left: 100px;
    cursor: pointer;
    font-weight: bold;
    color: black;
    background: transparent;
}
</style>