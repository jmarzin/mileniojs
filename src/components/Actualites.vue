<template>
    <div id="actualites">
        <div class="container">
            <div class="row">
                <div class="col-lg-12">
                    <h1 class="page-header">Actualités</h1>
                    <b-breadcrumb :items="items"/>
                    <b-button v-if="admin && viewMode" :variant="'link'" v-on:click="enterEditMode">
                        <font-awesome-icon icon="pen"></font-awesome-icon>
                    </b-button>
                    <b-alert v-if="erreurReseau" show variant="danger">{{erreurReseau}}</b-alert>
                    <actualites-affichage v-if="viewMode" :donneesActualites=donneesActualites></actualites-affichage>
                    <actualites-edition v-else :donneesActualites=donneesActualites v-on:abandon="viewMode=true"
                               v-on:maj="maj($event)"></actualites-edition>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import { mapState } from 'vuex';
    import ActualitesAffichage from '@/components/ActualitesAffichage.vue';
    import ActualitesEdition from '@/components/ActualitesEdition.vue';
    import {litActualites} from '@/js/ServiceApi';
    export default {
        name: "actualites",
        data() {
            return {
                items: [
                    {
                        text: 'Accueil',
                        to: "/",
                    }, {
                        text: "Actualités",
                        active: true
                    }
                ],
                donneesActualites: [],
                viewMode: true,
                erreurReseau: false,
            }
        },
        components: {
            ActualitesAffichage,
            ActualitesEdition
        },
        methods: {
            enterEditMode() {
                this.viewMode = false;
            },
            maj(valeurs) {
                this.donneesActualites = valeurs;
                this.viewMode = true;
            },
            lecture() {
                litActualites()
                    .then (res => {
                        this.donneesActualites = res;
                        this.erreurReseau = null;
                    })
                    .catch (err => {
                        this.erreurReseau = err.message;
                    })
            }
        },
        computed: {
            ...mapState([
                'admin'
            ]),
        },
        mounted() {
            this.lecture();
        }
    }
</script>
