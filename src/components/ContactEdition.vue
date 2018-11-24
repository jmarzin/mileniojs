<template>
    <div id="contact-edition">
        Fonction non disponible !
    </div>
</template>

<script>
    export default {
        name: "contactedition",
        props: ['donneesContact'],
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
