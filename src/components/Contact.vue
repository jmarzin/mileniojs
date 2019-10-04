<template>
    <div id="contact" :class="{ blue: !viewMode}">
        <b-button v-if="admin && viewMode" :variant="'link'" v-on:click="enterEditMode">
            <font-awesome-icon icon="pen"></font-awesome-icon>
        </b-button>
        <contact-affichage v-if="viewMode" :donneesContact=copieDonneesContact></contact-affichage>
        <contact-edition v-else :donneesContact=copieDonneesContact
                         v-on:abandon="viewMode=true" v-on:maj="maj($event)"></contact-edition>
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import ContactAffichage from '@/components/ContactAffichage.vue';
    import ContactEdition from '@/components/ContactEdition.vue';
    export default {
        name: "contact",
        props: ['donneesContact'],
        components: {
            ContactAffichage,
            ContactEdition
        },
        data() {
            return {
                viewMode: true,
                copieDonneesContact: this.donneesContact
            }
        },
        methods: {
            enterEditMode() {
                this.viewMode = false;
            },
            maj(donnees) {
                this.copieDonneesContact = donnees;
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
