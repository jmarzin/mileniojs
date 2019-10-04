<template>
    <div id="image-accueil-affichage">
        <b-carousel v-if="carousel_accueil.length > 1" id="carousel1" style="text-shadow: 1px 1px 2px #333;"
                    controls indicators :interval="3000"
                    img-width="1024" v-model="slide"
                    @sliding-start="onSlideStart" @sliding-end="onSlideEnd">
            <div v-for="photo in carousel_accueil" :key="photo.photo">
                <b-carousel-slide class="fill" caption-tag="h3" :caption="photo.caption" :style="{ backgroundImage: 'url(' + photo.photo +')' }">
                    <img
                            slot="img"
                            class="d-block img-fluid w-100"
                            :src="imageBlanche"
                            :style="{ opacity: 0.0 }"
                            :alt="photo.caption"
                    >
                </b-carousel-slide>
            </div>
        </b-carousel>
        <div v-if="carousel_accueil.length === 1" class="h240 w-100">
            <div class="fill" :style="{ backgroundImage: 'url(' + carousel_accueil[0].photo +')' }">
                <div class="unique-caption">
                    <h2>{{carousel_accueil[0].caption}}</h2>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {BASE_URL} from '@/js/ServiceApi';
    export default {
        name: "imageaccueilaffichage",
        props: ['donneesCarousel'],
        data() {
            return {
                slide: 0,
                sliding: null
            }
        },
        methods: {
            onSlideStart() {
                this.sliding = true
            },
            onSlideEnd() {
                this.sliding = false
            }
        },
        computed: {
            imageBlanche() {
                return BASE_URL + '/contenu/blanc.jpg'
            },
            carousel_accueil() {
                return this.donneesCarousel.filter(p => p.affiche);
            },
        },
    }
</script>

<style scoped>
    .unique-caption {
        position: relative;
        top: 120px;
        z-index: 10;
        padding-top: 20px;
        padding-bottom: 20px;
        color: #fff;
        text-align: center;
    }
    .h240 {
        height: 240px
    }
    .fill {
        width: 100%;
        height: 100%;
        background-position: center;
        background-size: cover;
    }

</style>
