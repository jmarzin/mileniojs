<template>
    <div id="actualites-edition">
        Fonction non disponible !
    </div>
</template>

<script>
    export default {
        name: "actualitesedition",
        props: ['donneesActualites'],
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
