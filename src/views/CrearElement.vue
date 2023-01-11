<template>
    <h1 class="text-center">Crea un element nou</h1>
    <secton class="row">


        <form class="col-lg-6 mx-auto">
            <div class="row">
                <div class="col-12 col-lg-6 mb-2">
                    <label for="NumSerie">Estat</label>
                    <select name="estat" id="estat" class="form-control">
                        <option value="published">Publicat</option>
                        <option value="draft">Arxivat</option>
                    </select>
                </div>
                <div class="col-12 col-lg-6 mb-2">
                    <label for="model">Model</label>
                    <input type="text" name="model" class="form-control" placeholder="Selecciona un model...">
                </div>
            </div>
            <div class="row">
                <div class="col-12 col-lg-6 mb-2">
                    <label for="NumMag">Número de magatzem</label>
                    <input type="text" class="form-control" name="NumMag">
                </div>
                <div class="col-12 col-lg-6 mb-2">
                    <label for="NumSerie">Número de sèrie</label>
                    <input type="text" class="form-control" name="NumSerie">
                </div>
            </div>
            <div class="row">
                <div class="col-12 col-lg mb-2">
                    <label for="DelegacioAssignada">Delegació assignada</label>
                    <input type="text" class="form-control" name="DelegacioAssignada">
                </div>
                <div class="col-12 col-lg mb-2">
                    <label for="DelegacioActual">Delegació actual</label>
                    <input type="text" class="form-control" name="DelegacioActual">
                </div>
            </div>
            <div class="row">
                <div class="col-12 col-lg mb-2">
                    <label for="observacions">Observacions</label>
                    <textarea name="observacions" id="observacions" rows="10" class="form-control"></textarea>
                </div>
            </div>
            <button type="submit" class="btn btn-primary">Crear element</button>
        </form>
    </secton>
</template>
<script>
export default {
    name: "CrearElement"
}
</script>

<style>

</style>