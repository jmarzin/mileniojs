<template>
    <div id="realisations-affichage">
        <div class="row pb-2">
            <div class="col-md-4" v-for="(item, index) in donneesRealisations" :key="index">
                <b-card-group deck>
                    <b-card :title="item.titre"
                            img-fluid
                            img-top
                            :img-src="adresse(item.repertoire, item.photos)"
                            img-alt="Photo"
                            class="mb-2 img-responsive img-hover img-related pointer"
                            @click="$router.push(`/${element}/${avant + index}`)">
                        <p class="card-text">
                            {{item.sous_titre}}
                        </p>
                        <b-link to="`/${element}/${avant + index}`"
                                class="card-link">En savoir plus</b-link>
                    </b-card>
                </b-card-group>
            </div>
        </div>
    </div>
</template>

<script>
    import {toHttp} from '@/js/ServiceApi';
    export default {
        name: "realisationsaffichage",
        props: ['donneesRealisations', 'ensemble', 'avant'],
        methods: {
            adresse: function(rep, photos) {
                return toHttp(rep, photos)
            }
        },
        computed: {
            element: function() {
                if(this.ensemble === 'Réalisations') {
                    return 'realisation'
                } else if(this.ensemble === 'Cuisines') {
                    return 'cuisine'
                } else if(this.ensemble === 'Rangements') {
                    return 'rangement'
                } else {
                    return 'salle_de_bain'
                }
            }
        }
    }
</script>
<style scoped>
    .pointer {
        cursor: pointer;
    }
</style>
