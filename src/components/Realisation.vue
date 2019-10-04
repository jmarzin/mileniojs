<template>
    <div id="realisation">
        <div class="container">
            <div class="row">
                <div class="col-lg-12">
                    <h1 class="page-header">{{ items[2].text }}</h1>
                    <b-breadcrumb :items="items"/>
                    <b-button v-if="admin && viewMode" :variant="'link'" v-on:click="enterEditMode">
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
                        text: '',
                        to: ''
                    },
                    {
                        text: '',
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
                let arg = this.$route.name === 'salle_de_bain' ? 'salles_de_bain' : this.$route.name + 's';
                litRealisations(arg)
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
            if(this.$route.name === 'realisation') {
                this.items[1].text = 'Réalisations';
                this.items[1].to = '/realisations';
                this.items[2].text = 'Réalisation';
            } else if(this.$route.name === 'cuisine') {
                this.items[1].text = 'Cuisines';
                this.items[1].to = '/cuisines';
                this.items[2].text = 'Cuisine';
            } else if(this.$route.name === 'rangement') {
                this.items[1].text = 'Rangements';
                this.items[1].to = '/rangements';
                this.items[2].text = 'Rangement';
            } else {
                this.items[1].text = 'Salles de bain';
                this.items[1].to = '/salles_de_bain';
                this.items[2].text = 'Salle de bain';
            }
            this.lecture();
        }
    }
</script>
