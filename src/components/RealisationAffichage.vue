<template>
    <div id="realisation-affichage" v-if="ready">
        <div class="row">
            <div class="col-md-8">
                <b-carousel controls
                            indicators
                            :interval="3000">
                    <div v-for="(photo, index) in carousel" :key="index">
                        <b-carousel-slide :img-src="getAdress(donneesRealisation.repertoire, [photo])">
                        </b-carousel-slide>
                    </div>
                </b-carousel>
            </div>
            <div class="col-md-4" v-html="donneesRealisation.texte"></div>
        </div>
        <div class="row" v-if="donneesRealisation.repertoires_lies.length > 0">
            <div class="col-lg-12">
                <h3 class="page-header">Items voisins</h3>
            </div>
            <hr>
            <div class="col-sm-3 col-xs-6" v-for="(lie, idx) in donneesRealisation.repertoires_lies" :key="idx">
                <router-link :to="{ name: $route.name, params: { id: lienVers(lie) }}">
                    <img class="img-responsive img-fluid img-hover img-related"
                         :src="adresse(lie)"
                         alt="">
                </router-link>
            </div>
        </div>
    </div>
</template>

<script>
    import {toHttp} from '@/js/ServiceApi';
    export default {
        name: "realisationaffichage",
        props: ['donneesRealisations', 'index'],
        methods: {
            getAdress: function(repertoire, photos) {
                return toHttp(repertoire, photos)
            },
            adresse: function (repertoire) {
                for( let i = 0 ; i < this.donneesRealisations.length ; i++) {
                    if(this.donneesRealisations[i].repertoire === repertoire) {
                        return toHttp(repertoire, this.donneesRealisations[i].photos)
                    }
                }
                return '#'
            },
            lienVers: function (repertoire) {
                for( let i = 0 ; i < this.donneesRealisations.length ; i++) {
                    if(this.donneesRealisations[i].repertoire === repertoire) {
                        return i
                    }
                }
                return 'inconnue'
            }
        },

        computed: {
            donneesRealisation: function() {
              return this.donneesRealisations[this.index]
            },
            ready: function() {
                return 'length' in this.donneesRealisations && this.donneesRealisations.length > 0
            },
            carousel: function () {
                return this.donneesRealisation.photos.filter(p => p.affiche);
            }
        }
    }
</script>
