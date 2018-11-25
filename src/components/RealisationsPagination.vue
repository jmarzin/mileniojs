<template>
    <div id="realisations-pagination">
        <RealisationsAffichage v-bind:donneesRealisations=tranche :ensemble="ensemble"></RealisationsAffichage>
        <b-pagination-nav v-if="donneesRealisations.length > nbpp" align="center" base-url="#" :number-of-pages=numberOfPages :value="currentPage"/>
    </div>
</template>

<script>
    import RealisationsAffichage from '@/components/RealisationsAffichage.vue'
    export default {
        name: "realisationspagination",
        props: {
            donneesRealisations: Array[Object],
            ensemble : String,
            nbpp: [Number, String]
        },
        components: {
            RealisationsAffichage
        }
        ,
        computed: {
            tranche: function () {
                var list = this.donneesRealisations;
                return list.slice((this.currentPage - 1) * this.nbpp, Math.min(list.length,
                    this.currentPage * this.nbpp))
            },
            currentPage: function () {
                return Math.min(parseInt(this.$route.hash.substring(1)) || 1, this.numberOfPages)
            },
            numberOfPages: function () {
                return Math.ceil((this.donneesRealisations.length + 1) / this.nbpp)
            }
        }
    }
</script>
