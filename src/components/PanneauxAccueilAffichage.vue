<template>
    <div id="panneaux-accueil">
        <div class="row">
            <div class="col-lg-12">
                <h1 class="page-header">
                    {{donneesPanneaux.titre}}
                </h1>
            </div>
        </div>
        <div class="row">
            <div :class="calculeCol" v-for="(panneau, index) in panneaux_accueil" :key="index">
                <b-card>
                    <h6 slot="header">
                        <font-awesome-icon icon="check"></font-awesome-icon>
                        {{panneau.titre}}
                    </h6>
                    <b-card-body v-html="panneau.text" class="panneau"></b-card-body>
                </b-card>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    export default {
        name: "panneauxaccueil",
        props: ['donneesPanneaux'],
        data() {
            return {
                networkError: null,
                viewMode: true
            }
        },
        methods: {

        },
        computed: {
            ...mapState([
                'admin'
            ]),
            panneaux_accueil() {
                return this.donneesPanneaux.cartes.filter(p => p.affiche);
            },
            calculeCol() {
                switch (this.donneesPanneaux.colonnes) {
                    case 1 : return "col-md-12";
                    case 2 : return "col-md-6";
                    default: return "col-md-4";
                }
            }
        }
    }
</script>

<style scoped>
    .page-header {
        padding-bottom: 9px;
        margin: 40px 0 20px;
        border-bottom: 1px solid #eee;
    }
    .panneau {
        padding: 0;
        font-size: 14px;
        height: 120px;
        overflow-y: hidden;
    }
</style>
