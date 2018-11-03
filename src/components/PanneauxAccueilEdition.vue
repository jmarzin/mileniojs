<template>
    <div id="panneaux-accueil-edition">
        Fonction non disponible !
    </div>
</template>

<script>
    export default {
        name: "panneauxaccueiledition",
        props: ['donneesPanneaux'],
        data() {
            return {
            }
        },
        methods: {

        },
        computed: {

        }
        , created() {
            this.$emit('abandon', this.donneesContact)
        }
    }
</script>
