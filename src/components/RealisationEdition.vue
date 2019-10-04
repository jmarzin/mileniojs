<template>
    <div id="realisation-edition" class="blue">
            <div class="form_group">
                <label for="rep" class="form_label">Répertoire</label>
                <br>
                <input id="rep" class="form__input" size="30" readonly v-model.trim="$v.item.repertoire.$model" :class="status($v.item.repertoire)"/>
            </div>

            <div class="form-group" :class="{ 'form-group--error': $v.item.commentaire_prive.$error }">
                <label for="com" class="form__label">Commentaire privé</label>
                <br>
                <input id="com" class="form__input" v-model.trim="$v.item.commentaire_prive.$model" :class="status($v.item.commentaire_prive)" size="30"/>
            </div>

            <div class="form-group" :class="{ 'form-group--error': $v.item.titre.$error }">
                <label for="tit" class="form__label">Titre</label>
                <span class="error" v-if="!$v.item.titre.required"> obligatoire</span>
                <br>
                <input id="tit" class="form__input" v-model.trim="$v.item.titre.$model" :class="status($v.item.titre)" size="30"/>
            </div>

            <div class="form-group" :class="{ 'form-group--error': $v.item.sous_titre.$error }">
                <label for="stit" class="form__label">Sous-titre</label>
                <span class="error" v-if="!$v.item.sous_titre.required"> obligatoire</span>
                <br>
                <input id="stit" class="form__input" v-model.trim="$v.item.sous_titre.$model" :class="status($v.item.sous_titre)" size="60"/>
            </div>
            <div class="row no-gutters">
                <div class="col-md-5">
                    <div class="form-group" :class="{ 'form-group--error': $v.item.texte.$error }">
                        <label class="form__label">Description</label>
                        <span class="error" v-if="!$v.item.texte.required"> obligatoire</span>
                        <br>
                        <editor api-key="lh3xxpstbhgq2iccd82j1360ry6ru7jjpwhof9ou3epb55gh" :init="tinyMceInit" v-model.trim="$v.item.texte.$model" class="form__input" :class="status($v.item.texte)"></editor>
                    </div>
                </div>
            </div>

            <div>
                <label class="form__label">Items liés</label>
                <b-form-select v-model="item.repertoires_lies" :options="options" multiple :select-size="options.length"></b-form-select>
                <div class="mt-3">Sélectionnés: <strong>{{ item.repertoires_lies }}</strong></div>
            </div>

            <hr>
            <h2>Photos du carousel</h2>
            <b-row>
                <div class="col-md-4">
                    <h2>Sélectionnées</h2>
                    <draggable class="list-group" v-model="list" :options="dragOptions" :move="onMove"
                               @start="isDragging=true" @end="isDragging=false" @remove="decIndex">
                        <transition-group class="list-group" type="transition" :name="'flip-list'">
                            <li class="list-group-item" v-for="(element, index) in list" :key="index" @click="showAdressImage(element)">
                                <div v-if="element.image === ''">
                                    <font-awesome-icon icon="trash" size="xs"
                                                       @click="delItem(index)"></font-awesome-icon>
                                    <br>
                                </div>
                                <img v-if="adresse(item.repertoire, [element]) !== '#'" class="img-fluid" style="max-height: 40px; width: auto" :src="adresse(item.repertoire, [element])" alt="image">
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
                            <li class="list-group-item" v-for="(element, index) in list2" :key="index" @click="showAdressImage(element)">
                                <i :icon="element.fixed? 'anchor' : 'glyphicon glyphicon-pushpin'"
                                   @click=" element.fixed=! element.fixed" aria-hidden="true"></i>
                                <img class="img-fluid" style="max-height: 40px; width: auto" :src="adresse(item.repertoire, [element])" alt="image">
                            </li>
                        </transition-group>
                    </draggable>
                </div>

                <div class="list-group col-md-4">
                    <div v-if="list[indexCourant].image === ''">
                        <h2>Chargement photo</h2>
                        <div>
                            <label for="photo">Photo</label>
                            <input id="photo" type="file" name="photo" accept=".png, .jpg, .jpeg" @change="onChangePhoto">
                        </div>
                        <div v-if="networkError">
                            {{networkError.message}}
                        </div>
                    </div>
                    <div v-else>
                        <h2>Adresse de la photo</h2>
                        {{nomImage}}
                    </div>
                    <div v-if="list2.length > 0">
                        <h2>Gestion des photos en attente</h2>
                        <hr>
                        <input type="checkbox" id="checkbox" v-model="menage">
                        <label for="checkbox">Faire le ménage sur le serveur à la validation</label>
                    </div>
                </div>
            </b-row>
            <button class="btn btn-secondary" @click="$emit('abandon')">Abandon</button>
            <span>&nbsp;</span>
            <button :disabled="$v.item.invalid" class="btn btn-primary" @click="validation">Validation</button>
        </div>
</template>

<script>
    import draggable from "vuedraggable";
    import {photoUpload, postDonneesRealisations, toHttp} from '@/js/ServiceApi';
    import {required} from 'vuelidate/lib/validators';
    import Editor from '@tinymce/tinymce-vue';
    import {TINYMCEINIT} from '@/js/ServiceApi';

    export default {
        name: "realisationedition",
        components: {
            draggable,
            'editor': Editor
        },
        props: ['donneesRealisations', 'index'],
        data() {
            return {
                tinyMceInit: TINYMCEINIT,
                nomImage: '',
                networkError: null,
                isDragging: false,
                delayedDragging: false,
                editable: true,
                list: [],
                list2: [],
                indexCourant: 0,
                item: {
                    repertoire: "",
                    titre: "",
                    sous_titre: "",
                    texte: "",
                    photos: [],
                    repertoires_lies: [],
                    affiche: true
                },
                menage: false
            }
        },
        validations: {
            item: {
                repertoire: {
                },
                titre: {
                    required
                },
                sous_titre: {
                    required
                },
                commentaire_prive: {
                },
                texte: {
                    required
                }
            }
        },
        methods: {
            adresse: function(rep, photos) {
                if (photos[0].image === '') return '#';
                else
                    return toHttp(rep, photos)
            },
            onMove({relatedContext, draggedContext}) {
                if (this.list.length === 1) return false;
                const relatedElement = relatedContext.element;
                const draggedElement = draggedContext.element;
                return (
                    (!relatedElement || !relatedElement.fixed) && !draggedElement.fixed
                );
            },
            addItem() {
                this.list.push({image: '', affiche: true});
                this.indexCourant = this.list.length - 1;
            },
            decIndex() {
                this.indexCourant = this.indexCourant === 0 ? 0 : this.indexCourant - 1;
            },
            delItem(index) {
                this.list.splice(index, 1);
                this.decIndex();
            },
            onChangePhoto(event) {
                photoUpload(event.target, this.item.repertoire, this.password)
                    .then(() => {
                        this.list[this.indexCourant].image = event.target.files[0].name;
                        this.networkError = null;
                    }).catch(e => {
                    this.networkError = e;
                })
            },
            showAdressImage(value) {
                this.nomImage = this.item.repertoire + '/' + value.image;
            },
            status(validation) {
                return {
                    error: validation.$error,
                    dirty: validation.$dirty
                }
            },
            validation() {
                let newList = this.donneesRealisations;
                newList[this.index] = this.item;
                newList[this.index].photos = this.list.map(e => {
                    e.affiche = true;
                    return e
                }). concat(this.list2.map(e => {
                    e.affiche = false;
                    return e
                }));
                postDonneesRealisations(newList, this.index, this.menage, this.password)
                    .then(() => {
                        if (this.menage) {
                            newList[this.index].photos = newList[this.index].photos.filter(e => e.affiche);
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
            },
            options() {
                return this.donneesRealisations.filter( (_, idx) => idx !== this.index)
                    .map(_ => {
                        let p = _.repertoire.split("/");
                        let texte = p.pop() + '|' + _.titre + '|' + _.commentaire_prive + '|' + _.sous_titre;
                        return { value: _.repertoire, text: texte }})
            }
        },
        watch: {
            list(val) {
                if (this.indexCourant >= val.length) this.decIndex()
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
            this.menage = false;
            this.item = this.donneesRealisations[this.index];
            this.list = this.item.photos.filter(p => p.affiche);
            this.list2 = this.item.photos.filter(p => !p.affiche);
            this.indexCourant = 0;
            TINYMCEINIT.toolbar = 'undo redo | styleselect | bold italic';
        },
        mounted() {
            this.menage = false;
        }
    }
</script>

