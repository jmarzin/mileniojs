<template>
    <div id="image-accueil">
        <b-alert v-if="erreurReseau" show variant="danger">{{erreurReseau}}</b-alert>
        <div v-if="pageLue">
            <image-accueil :donneesCarousel=donneesCarousel></image-accueil>
            <div class="container">
                <panneaux-accueil :donneesPanneaux=donneesPanneaux></panneaux-accueil>
                <contact :donneesContact=donneesContact></contact>
            </div>
        </div>
    </div>
</template>

<script>
    import ImageAccueil from '@/components/ImageAccueil.vue';
    import PanneauxAccueil from '@/components/PanneauxAccueil';
    import Contact from '@/components/Contact';
    import {litAccueil} from '@/js/ServiceApi';
    export default {
        name: 'Accueil',
        data() {
            return {
                pageLue: false,
                erreurReseau: false,
                donneesCarousel: null,
                donneesPanneaux: null,
                donneesContact: null
            }
        },
        components: {
            ImageAccueil,
            PanneauxAccueil,
            Contact
        },
        created() {
            litAccueil()
                .then (res => {
                    this.pageLue = true;
                    this.donneesCarousel = res[0];
                    this.donneesPanneaux = res[1];
                    this.donneesContact = res[2];
                    this.erreurReseau = null;
                })
                .catch (err => {
                    this.erreurReseau = err.message;
                })
        }
    }
</script>
