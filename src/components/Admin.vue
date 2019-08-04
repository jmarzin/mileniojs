<template>
    <div>
        <b-alert v-if="admin" show variant="danger">Vous êtes désormais administrateur</b-alert>
        <b-alert v-else show>Vous n'êtes pas administrateur</b-alert>
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import md5 from 'js-md5'
    export default {
        name: "admin",
        data() {
            return {
                password: "",
            }
        },
        computed: {
            ...mapState([
                'admin'
            ])
        },
        mounted() {
            this.password = md5(this.$route.params.password);
            if (this.password === "38b5188c3032225c37392ef863057344") {
                this.$store.commit('change');
            }
        }
    }
</script>
