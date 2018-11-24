<template>
    <div id="realisation">
        <div class="container">
            <div class="row">
                <div class="col-lg-12">
                    <h1 class="page-header">Réalisation</h1>
                    <b-breadcrumb :items="items"/>
                    <b-button v-if="admin" :variant="'link'" v-on:click="enterEditMode">
                        <font-awesome-icon icon="pen"></font-awesome-icon>
                    </b-button>
                    <b-alert v-if="erreurReseau" show variant="danger">{{erreurReseau}}</b-alert>
                    <realisation-affichage v-if="viewMode" :donneesRealisations="donneesRealisations" :index="index"></realisation-affichage>
                    <realisation-edition v-else :donneesRealisations="donneesRealisations" :index="index" v-on:abandon="viewMode=true"
                               v-on:maj="maj($event)"></realisation-edition>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import { mapState } from 'vuex';
    import RealisationAffichage from '@/components/RealisationAffichage.vue';
    import RealisationEdition from '@/components/RealisationEdition.vue';
    import {litRealisations} from '@/js/ServiceApi';
    export default {
        name: "realisation",
        data() {
            return {
                items: [
                    {
                        text: 'Accueil',
                        to: "/",
                    },
                    {
                        text: 'Réalisations',
                        to: '/realisations'
                    },
                    {
                        text: 'Réalisation',
                        active: true
                    }
                ],
                donneesRealisations: [],
                index: null,
                viewMode: true,
                erreurReseau: false,
            }
        },
        components: {
            RealisationAffichage,
            RealisationEdition
        },
        watch: {
            '$route'() {
                this.lecture()
            }
        },
        methods: {
            enterEditMode() {
                this.viewMode = false;
            },
            maj(valeurs) {
                this.donneesRealisations = valeurs;
                this.viewMode = true;
            },
            lecture() {
                litRealisations()
                    .then (res => {
                        let index = parseInt(this.$route.params.id);
                        if(index >=0 && index < res.length && res[index].affiche) {
                            this.donneesRealisations = res;
                            this.index = index;
                            this.erreurReseau = null;
                        } else {
                            this.erreurReseau = "réalisation inconnue";
                        }
                    })
                    .catch (err => {
                        this.erreurReseau = err.message;
                    })
            }
        },
        computed: {
            ...mapState([
                'admin'
            ])
        },
        mounted() {
            this.lecture();
        }
    }
</script>
