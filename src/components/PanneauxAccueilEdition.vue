<template>
    <div id="panneaux-accueil-edition">
            <div class="form-group" :class="{ 'form-group--error': $v.item.titre.$error }">
                <label for="tit" class="form__label">Titre</label>
                <span class="error" v-if="!$v.item.titre.required"> obligatoire</span>
                <br>
                <input id="tit" class="form__input" v-model.trim="$v.item.titre.$model" :class="status($v.item.titre)"
                       size="30"/>
            </div>
            <div>
                <label class="form__label">Colonnes</label>
                <b-form-select v-model="item.colonnes" :options="options"></b-form-select>
            </div>
            <hr>
            <h2>Panneaux</h2>
            <b-row>
                <div class="col-md-4">
                    <h2>Sélectionnées</h2>
                    <draggable class="list-group" v-model="list" :options="dragOptions" :move="onMove"
                               @start="isDragging=true" @end="isDragging=false" @remove="decIndex">
                        <transition-group class="list-group" type="transition" :name="'flip-list'">
                            <li class="list-group-item" v-for="(element, index) in list" :key="index">
                                <font-awesome-icon icon="pen" size="xs" @click="editItem(index)"></font-awesome-icon>
                                <span>&nbsp;</span>
                                <font-awesome-icon icon="trash" size="xs" v-if="element.titre === ''"
                                                   @click="delItem(index)"></font-awesome-icon>
                                <br>
                                <b-card>
                                    <small slot="header">
                                        <font-awesome-icon icon="check"></font-awesome-icon>
                                        {{element.titre}}
                                    </small>
                                    <b-card-body v-html="element.text" class="panneauEdition"></b-card-body>
                                </b-card>
                            </li>
                        </transition-group>
                        <button slot="footer" @click="addItem">
                            <font-awesome-icon slot="footer" icon="plus" size="xs"></font-awesome-icon>
                        </button>
                    </draggable>
                </div>

                <div class="col-md-4">
                    <h2>En réserve</h2>
                    <draggable element="span" class="list-group" v-model="list2" :options="dragOptions" :move="onMove">
                        <transition-group name="no" class="list-group" tag="ul">
                            <li class="list-group-item" v-for="(element, index) in list2" :key="index">
                                <b-card>
                                    <small slot="header">
                                        <font-awesome-icon icon="check"></font-awesome-icon>
                                        {{element.titre}}
                                    </small>
                                    <b-card-body v-html="element.text" class="panneauEdition"></b-card-body>
                                </b-card>
                            </li>
                        </transition-group>
                    </draggable>
                </div>

                <div class="list-group col-md-4" v-if="list.length > 0">
                    <h2>Edition</h2>
                    <div class="form-group" :class="{ 'form-group--error': $v.carteEnCours.titre.$error }">
                        <label for="titc" class="form__label">Titre</label>
                        <span class="error" v-if="!$v.carteEnCours.titre.required"> obligatoire</span>
                        <br>
                        <input id="titc" class="form__input" v-model.trim="$v.carteEnCours.titre.$model"
                               :class="status($v.carteEnCours.titre)" size="30"/>
                    </div>
                    <div class="form-group" :class="{ 'form-group--error': $v.carteEnCours.text.$error }">
                        <label for="text" class="form__label">Titre</label>
                        <span class="error" v-if="!$v.carteEnCours.text.required"> obligatoire</span>
                        <br>
                        <textarea id="text" rows="5" cols="40" class="form__input"
                                  v-model.trim="$v.carteEnCours.text.$model"
                                  :class="status($v.carteEnCours.text)"></textarea>
                    </div>
                    <div v-if="list2.length > 0">
                        <h2>Gestion des panneaux en attente</h2>
                        <hr>
                        <input type="checkbox" id="checkbox" v-model="menage">
                        <label for="checkbox">Faire le ménage sur le serveur à la validation</label>
                    </div>
                </div>
            </b-row>
            <button class="btn btn-secondary" @click="$emit('abandon')">Abandon</button>
            <span>&nbsp;</span>
            <button :disabled="$v.carteEnCours.invalid || $v.item.invalid" class="btn btn-primary" @click="validation">
                Validation
            </button>
            <div v-if="networkError">
                {{networkError.message}}
            </div>
        </div>
</template>

<script>
    import {required} from 'vuelidate/lib/validators';
    import draggable from "vuedraggable";
    import {postPanneauxAccueil} from "@/js/ServiceApi";

    export default {
        name: "panneauxaccueiledition",
        props: ['donneesPanneaux'],
        components: {
            draggable
        },
        data() {
            return {
                list: [],
                list2: [],
                editable: true,
                isDragging: false,
                delayedDragging: false,
                indexCourant: null,
                carteEnCours: {
                    titre: '',
                    text: ''
                },
                networkError: null,
                menage: false,
                item: {
                    titre: '',
                    colonnes: 3,
                    cartes: []
                },
                options: [{value: 1, text: 1}, {value: 2, text: 2}, {value: 3, text: 3}]
            }
        },
        validations: {
            carteEnCours: {
                titre: {
                    required,
                    copie(value) {
                        this.list[this.indexCourant].titre = value;
                        return true
                    }
                },
                text: {
                    required,
                    copie(value) {
                        this.list[this.indexCourant].text = value;
                        return true
                    }
                }
            },
            item: {
                titre: {
                    required
                },
                colonnes: {
                    required
                },
            }
        },
        methods: {
            status(validation) {
                return {
                    error: validation.$error,
                    dirty: validation.$dirty
                }
            },
            addItem() {
                this.list.push({titre: '', texte: '', affiche: true});
                this.indexCourant = this.list.length - 1;
            },
            decIndex() {
                this.indexCourant = this.indexCourant === 0 ? 0 : this.indexCourant - 1;
            },
            delItem(index) {
                this.list.splice(index, 1);
                this.decIndex();
            },
            editItem(index) {
                this.indexCourant = index;
            },
            onMove({relatedContext, draggedContext}) {
                if (this.list.length === 1) return false;
                const relatedElement = relatedContext.element;
                const draggedElement = draggedContext.element;
                return (
                    (!relatedElement || !relatedElement.fixed) && !draggedElement.fixed
                );
            },
            validation() {
                this.item.cartes = this.list.map(e => {
                    e.affiche = true;
                    return e
                });
                if (!this.menage) {
                    this.item.cartes = this.item.cartes.concat(this.list2.map(e => {
                        e.affiche = false;
                        return e
                    }));
                }
                postPanneauxAccueil(this.item, this.password)
                    .then(() => {
                        this.$emit('maj', this.item)
                    })
                    .catch(e => {
                        this.networkError = e;
                    })
            }
        },
        computed: {
            dragOptions() {
                return {
                    animation: 0,
                    group: "description",
                    disabled: !this.editable,
                    ghostClass: "ghost",
                    draggable: '.list-group-item'
                };
            },
            password() {
                return this.$store.state.admin
            },
        },
        watch: {
            indexCourant(val) {
                this.carteEnCours.titre = this.list[val].titre;
                this.carteEnCours.text = this.list[val].text;
            },
            list(val) {
                if (this.indexCourant >= val.length) {
                    this.decIndex()
                } else {
                    this.carteEnCours.titre = this.list[this.indexCourant].titre;
                    this.carteEnCours.text = this.list[this.indexCourant].text;
                }
            },
            isDragging(newValue) {
                if (newValue) {
                    this.delayedDragging = true;
                    return;
                }
                this.$nextTick(() => {
                    this.delayedDragging = false;
                });
            }
        },
        created() {
            this.item = this.donneesPanneaux;
            this.menage = false;
            this.indexCourant = 0;
            this.list = this.item.cartes.filter(p => p.affiche);
            this.list2 = this.item.cartes.filter(p => !p.affiche);
        }
    }
</script>
<style scoped>
    .panneauEdition {
        padding: 0;
        font-size: 0.8rem;
        height: 2.5rem;
        overflow-y: hidden;
    }
</style>
