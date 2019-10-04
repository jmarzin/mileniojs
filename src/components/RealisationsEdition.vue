<template>
    <div id="realisations-edition" class="blue">
            <b-row>
                <div class="col-md-4">
                    <h2>Sélectionnées</h2>
                    <draggable class="list-group" v-model="list" :options="dragOptions" :move="onMove"
                               @start="isDragging=true" @end="isDragging=false" @remove="decIndex">
                        <transition-group class="list-group" type="transition" :name="'flip-list'">
                            <li class="list-group-item" v-for="(element, index) in list" :key="index">
                                <font-awesome-icon icon="pen" size="xs" @click="editItem(index)"></font-awesome-icon>
                                <span>&nbsp;</span>
                                <font-awesome-icon icon="trash" size="xs" v-if="element.photos.length === 0"
                                                   @click="delItem(index)"></font-awesome-icon>
                                <span> </span>
                                {{element.repertoire}}
                                <br>
                                <img v-if="adresse(element.repertoire, element.photos) !== '#'" class="img-fluid" style="max-height: 40px; width: auto" :src="adresse(element.repertoire, element.photos)" alt="image">
                                <br>{{element.commentaire_prive}}
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
                                <i :icon="element.fixed? 'anchor' : 'glyphicon glyphicon-pushpin'"
                                   @click=" element.fixed=! element.fixed" aria-hidden="true"></i>
                                {{element.repertoire.split('/').pop()}}
                                <img class="img-fluid" style="max-height: 40px; width: auto" :src="adresse(element.repertoire, element.photos)" alt="image">
                                <br>{{element.commentaire_prive}}
                            </li>
                        </transition-group>
                    </draggable>
                </div>

                <div class="list-group col-md-4" v-if="list.length > 0">
                    <h2>Edition</h2>

                    <div class="form-group" :class="{ 'form-group--error': $v.item.repertoire.$error }">
                        <label for="rep" class="form__label">Répertoire:</label>
                        <span class="error" v-if="!$v.item.repertoire.required"> obligatoire</span>
                        <span class="error" v-if="!$v.item.repertoire.correct"> incomplet ou déjà pris</span>
                        <br>
                        <input id="rep" :readonly="list[indexCourant].photos.length !== 0" class="form__input" v-model.trim="$v.item.repertoire.$model" :class="status($v.item.repertoire)" size="30"/>
                    </div>

                    <div class="form-group" :class="{ 'form-group--error': $v.item.commentaire_prive.$error }">
                        <label for="com" class="form__label">Commentaire privé:</label>
                        <br>
                        <input id="com" class="form__input" v-model.trim="$v.item.commentaire_prive.$model" :class="status($v.item.commentaire_prive)" size="30"/>
                    </div>

                    <div class="form-group" :class="{ 'form-group--error': $v.item.titre.$error }">
                        <label for="tit" class="form__label">Titre:</label>
                        <span class="error" v-if="!$v.item.titre.required"> obligatoire</span>
                        <br>
                        <input id="tit" class="form__input" v-model.trim="$v.item.titre.$model" :class="status($v.item.titre)" size="30"/>
                    </div>

                    <div class="form-group" :class="{ 'form-group--error': $v.item.sous_titre.$error }">
                        <label for="stit" class="form__label">Sous-titre:</label>
                        <span class="error" v-if="!$v.item.sous_titre.required"> obligatoire</span>
                        <br>
                        <input id="stit" class="form__input" v-model.trim="$v.item.sous_titre.$model" :class="status($v.item.sous_titre)" size="30"/>
                    </div>

                    <div class="form-group" :class="{ 'form-group--error': $v.item.photo.$error }">
                        <label for="pho" class="form__label">1ère photo:</label>
                        <span class="error" v-if="!$v.item.photo.check"> obligatoire</span>
                        <br>
                        <input v-if="list[indexCourant].photos.length > 0" readonly v-model.trim="$v.item.photo.$model" size="30"/>
                        <input v-else id="pho" class="form__input" type="file" accept=".png, .jpg, .jpeg" name="photo" @change="onChangePhoto"/>
                    </div>
                    <div v-if="networkError">
                        {{networkError.message}}
                    </div>
                    <div v-if="list2.length > 0">
                       <hr>
                        <input type="checkbox" id="checkbox" v-model="menage">
                        <label for="checkbox">Faire le ménage sur le serveur à la validation</label>
                    </div>
                </div>
            </b-row>
            <button class="btn btn-secondary" @click="$emit('abandon')">Abandon</button>
            <span>&nbsp;</span>
            <button :disabled="$v.item.invalid || this.list[this.indexCourant].photos.length === 0" class="btn btn-primary" @click="validation">Validation</button>
        </div>
</template>

<script>
    import draggable from "vuedraggable";
    import {photoUpload, postDonneesRealisations, toHttp} from '@/js/ServiceApi';
    import {required} from 'vuelidate/lib/validators';

    export default {
        name: "realisationsedition",
        components: {
            draggable
        },
        props: ['donneesRealisations', 'ensemble'],
        data() {
            return {
                list: [],
                list2: [],
                editable: true,
                isDragging: false,
                delayedDragging: false,
                indexCourant: null,
                networkError: null,
                menage: false,
                repObjets: '',
                item: {
                    repertoire: '',
                    commentaire_prive: '',
                    titre: '',
                    sous_titre: '',
                    photo: ''
                }
            }
        },
        validations: {
            item: {
                repertoire: {
                    required,
                    correct(value) {
                        if (!value.startsWith(this.repObjets)) {
                            this.item.repertoire = this.repObjets;
                            return false
                        }
                        if (value === this.repObjets) return false;
                        this.item.repertoire = value.replace(' ', '_');
                        for (let i = 0; i < this.list.length; i++) {
                            if (i !== this.indexCourant && this.list[i].repertoire === value) return false
                        }
                        this.list[this.indexCourant].repertoire = value;
                        return true
                    }
                },
                titre: {
                    required,
                    copie(value) {
                        this.list[this.indexCourant].titre = value;
                        return true
                    }
                },
                sous_titre: {
                    required,
                    copie(value) {
                        this.list[this.indexCourant].sous_titre = value;
                        return true
                    }
                },
                commentaire_prive: {
                    copie(value) {
                        this.list[this.indexCourant].commentaire_prive = value;
                        return true
                    }
                },
                photo: {
                    check(value) {
                        return value !== '';
                    }
                },
            },
        },
        methods: {
            status(validation) {
                return {
                    error: validation.$error,
                    dirty: validation.$dirty
                }
            },
            adresse: function(rep, photos) {
                if (!photos || photos.length === 0) return '#';
                else
                    return toHttp(rep, photos)
            },
            onMove({relatedContext, draggedContext}) {
                const relatedElement = relatedContext.element;
                const draggedElement = draggedContext.element;
                return (
                    (!relatedElement || !relatedElement.fixed) && !draggedElement.fixed
                );
            },
            editItem(index) {
                this.indexCourant = index;
            },
            decIndex() {
                this.indexCourant = this.indexCourant === 0 ? 0 : this.indexCourant - 1;
            },
            delItem(index) {
                this.list.splice(index, 1);
                this.decIndex();
            },
            addItem() {
                for (let i = 0; i < this.list.length; i++) {
                    if (this.list[i].commentaire_prive === "" &&
                        this.list[i].repertoire === "" &&
                        this.list[i].photos.length === 0 &&
                        this.list[i].titre === "") return;
                }
                let parties = this.list[0].repertoire.split('/');
                this.list.push({repertoire: parties.slice(0, parties.length -1).join('/') + '/',commentaire_prive: '', titre: '', sous_titre: '', texte: '', photos: [], repertoires_lies: [], affiche: true});
                this.indexCourant = this.list.length - 1;
            },
            onChangePhoto(event) {
                photoUpload(event.target, this.item.repertoire, this.password)
                    .then(() => {
                        this.item.photo = event.target.files[0].name;
                        this.list[this.indexCourant].photos.push({image: this.item.photo, affiche: true});
                        this.networkError = null;
                    }).catch(e => {
                    this.networkError = e;
                })
            },
            validation() {
                let newList = this.list.map(e => {
                    e.affiche = true;
                    return e
                });
                if(this.menage) {
                    this.list2.forEach(el2 => {
                        newList.forEach(el => {
                            el.repertoires_lies = el.repertoires_lies.filter(r => r !== el2.repertoire)
                        })
                    })
                }
                newList = newList.concat(this.list2.map(e => {
                    e.affiche = false;
                    return e;
                }));
                postDonneesRealisations(newList, -1, this.menage, this.password)
                    .then(() => {
                        if (this.menage) {
                            newList = newList.filter(e => e.affiche)
                        }
                        this.$emit('maj', newList)
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
            }
        },
        created() {
            if (this.ensemble.toLowerCase() === 'réalisations') {
                this.repObjets = 'contenu/realisations/'
            } else {
                this.repObjets = 'contenu/services/' + this.ensemble.toLowerCase() + '/'
            }
            this.menage = false;
            this.list = this.donneesRealisations.filter(p => p.affiche);
            this.list2 = this.donneesRealisations.filter(p => !p.affiche);
            this.indexCourant = 0;
        },
        watch: {
            indexCourant(val) {
                this.item.repertoire = this.list[val].repertoire;
                this.item.commentaire_prive = this.list[val].commentaire_prive;
                this.item.titre = this.list[val].titre;
                this.item.sous_titre = this.list[val].sous_titre;
                this.item.photo = this.list[val].photos.length === 0 ? "" : this.list[val].photos[0].image;
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
        }
    }
</script>

