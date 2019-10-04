<template>
    <div id="actualites-affichage" v-if="ready">
        <div class="row">
            <div class="col-md-4">
                <b-carousel controls
                            indicators
                            :interval="3000">
                    <div v-for="p in carousel" :key="p.image">
                        <b-carousel-slide :img-src="adresse(p)">
                        </b-carousel-slide>
                    </div>
                </b-carousel>
            </div>
            <div class="col-md-8" v-html="donneesActualites.texte"></div>
        </div>
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import { toHttp } from '@/js/ServiceApi';
    export default {
        name: "actualitesaffichage",
        props: ['donneesActualites'],
        data() {
            return {
                networkError: null,
                viewMode: true
            }
        },
        methods: {
            adresse: function(photo) {
                return toHttp(this.donneesActualites.repertoire, [photo])
            }
        },
        computed: {
            ...mapState([
                'admin'
            ]),
            carousel: function () {
                return this.donneesActualites.photos.filter(p => p.affiche);
            },
            ready: function() {
                return 'photos' in this.donneesActualites && this.donneesActualites.photos.length > 0
            }
        }
    }
</script>
