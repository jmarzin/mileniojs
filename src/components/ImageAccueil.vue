<template>
    <div id="image-accueil">
        <b-button v-if="admin" :variant="'link'" v-on:click="enterEditMode">
            <font-awesome-icon icon="pen"></font-awesome-icon>
        </b-button>
        <image-accueil-affichage v-if="viewMode" :donneesCarousel=donneesCarousel></image-accueil-affichage>
        <image-accueil-edition v-else :donneesCarousel=copieDonneesCarousel v-on:abandon="viewMode=true"
        v-on:maj="maj($event)"></image-accueil-edition>
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import ImageAccueilAffichage from '@/components/ImageAccueilAffichage.vue';
    import ImageAccueilEdition from '@/components/ImageAccueilEdition.vue';
    export default {
        name: "imageaccueil",
        props: ['donneesCarousel'],
        data() {
            return {
                copieDonneesCarousel: this.donneesCarousel,
                sliding: null,
                viewMode: true
            }
        },
        components: {
            ImageAccueilAffichage,
            ImageAccueilEdition
        },
        methods: {
            enterEditMode() {
                this.viewMode = false;
            },
            maj(valeurs) {
                this.copieDonneesCarousel = valeurs;
                this.viewMode = true;
            }
        },
        computed: {
            ...mapState([
                'admin'
            ])
        }
    }
</script>
