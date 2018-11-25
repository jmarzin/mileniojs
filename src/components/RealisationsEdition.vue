<template>
    <div id="realisations-edition">
        Fonction non disponible !
    </div>
</template>

<script>
    export default {
        name: "realisationsedition",
        props: ['donneesRealisations', 'ensemble'],
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
