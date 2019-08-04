<template>
    <div id="realisations">
        <div class="container">
            <div class="row">
                <div class="col-lg-12">
                    <h1 class="page-header">{{ensemble}}</h1>
                    <b-breadcrumb :items="items"/>
                    <b-button v-if="admin" :variant="'link'" v-on:click="enterEditMode">
                        <font-awesome-icon icon="pen"></font-awesome-icon>
                    </b-button>
                    <b-alert v-if="erreurReseau" show variant="danger">{{erreurReseau}}</b-alert>
                    <realisations-pagination v-if="viewMode" :donneesRealisations=donneesRealisations :ensemble="ensemble" nbpp=9></realisations-pagination>
                    <realisations-edition v-else :donneesRealisations=donneesRealisations :ensemble="ensemble" v-on:abandon="viewMode=true"
                               v-on:maj="maj($event)"></realisations-edition>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import { mapState } from 'vuex';
    import RealisationsPagination from '@/components/RealisationsPagination.vue';
    import RealisationsEdition from '@/components/RealisationsEdition.vue';
    import {litRealisations} from '@/js/ServiceApi';
    export default {
        name: "realisations",
        data() {
            return {
                items: [
                    {
                        text: 'Accueil',
                        to: "/",
                    }, {
                        text: "",
                        active: true
                    }
                ],
                donneesRealisations: [],
                viewMode: true,
                erreurReseau: false,
            }
        },
        components: {
            RealisationsPagination,
            RealisationsEdition
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
                litRealisations(this.$route.name)
                    .then (res => {
                        this.donneesRealisations = res;
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
            ensemble: function() {
                if(this.$route.name === "realisations") {
                    return "Réalisations"
                } else if(this.$route.name === "cuisines") {
                    return "Cuisines"
                } else if(this.$route.name === "rangements") {
                    return "Rangements"
                } else {
                    return "Salles de bains"
                }
            }
        },
        mounted() {
             this.items[1].text = this.ensemble;
             this.lecture();
        },
        updated() {
            this.items[1].text = this.ensemble;
        }
    }
</script>
