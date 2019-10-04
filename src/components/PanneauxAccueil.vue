<template>
    <div id="panneaux-accueil" :class="{ blue: !viewMode}">
        <b-button v-if="admin && viewMode" :variant="'link'" v-on:click="enterEditMode">
            <font-awesome-icon icon="pen"></font-awesome-icon>
        </b-button>
        <panneaux-accueil-affichage v-if="viewMode" :donneesPanneaux=copieDonneesPanneaux></panneaux-accueil-affichage>
        <panneaux-accueil-edition v-else :donneesPanneaux=copieDonneesPanneaux
                                  v-on:abandon="viewMode=true" v-on:maj="maj($event)"></panneaux-accueil-edition>
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import PanneauxAccueilAffichage from '@/components/PanneauxAccueilAffichage.vue';
    import PanneauxAccueilEdition from '@/components/PanneauxAccueilEdition.vue';
    export default {
        name: "panneauxaccueil",
        props: ['donneesPanneaux'],
        components: {
            PanneauxAccueilAffichage,
            PanneauxAccueilEdition
        },
        data() {
            return {
                viewMode: true,
                copieDonneesPanneaux: this.donneesPanneaux
            }
        },
        methods: {
            enterEditMode() {
                this.viewMode = false;
            },
            maj(donnees) {
                this.copieDonneesPanneaux = donnees;
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
