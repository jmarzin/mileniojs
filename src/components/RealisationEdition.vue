<template>
    <div id="realisation-edition">
        Fonction non disponible !
    </div>
</template>

<script>
    export default {
        name: "realisationedition",
        props: ['donneesRealisations', 'index'],
        data() {
            return {
            }
        },
        methods: {

        },
        computed: {

        }
        , created() {
            this.$emit('abandon')
        }
    }
</script>
