<template>
    <div id="actualites-edition" :class="{ blue: !viewMode}">
            <div class="form_group">
                <label for="rep" class="form_label">Répertoire</label>
                <br>
                <input id="rep" class="form__input" size="30" readonly v-model.trim="$v.item.repertoire.$model"
                       :class="status($v.item.repertoire)"/>
            </div>
            <div class="row no-gutters">
                <div class="col-md-8">
                    <div class="form-group" :class="{ 'form-group--error': $v.item.texte.$error }">
                        <label class="form__label">Description</label>
                        <span class="error" v-if="!$v.item.texte.required"> obligatoire</span>
                        <br>
                        <editor api-key="lh3xxpstbhgq2iccd82j1360ry6ru7jjpwhof9ou3epb55gh" :init="tinyMceInit"
                                v-model.trim="$v.item.texte.$model" class="form__input"
                                :class="status($v.item.texte)"></editor>
                    </div>
                </div>
            </div>

            <hr>
            <h2>Photos du carousel</h2>
            <b-row>
                <div class="col-md-4">
                    <h2>Sélectionnées</h2>
                    <draggable class="list-group" v-model="list" :options="dragOptions" :move="onMove"
                               @start="isDragging=true" @end="isDragging=false" @remove="decIndex">
                        <transition-group class="list-group" type="transition" :name="'flip-list'">
                            <li class="list-group-item" v-for="(element, index) in list" :key="index"
                                @click="showAdressImage(element)">
                                <div v-if="element.image === ''">
                                    <font-awesome-icon icon="trash" size="xs"
                                                       @click="delItem(index)"></font-awesome-icon>
                                    <br>
                                </div>
                                <img v-if="adresse(item.repertoire, [element]) !== '#'" class="img-fluid"
                                     style="max-height: 40px; width: auto" :src="adresse(item.repertoire, [element])"
                                     alt="image">
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
                            <li class="list-group-item" v-for="(element, index) in list2" :key="index"
                                @click="showAdressImage(element)">
                                <i :icon="element.fixed? 'anchor' : 'glyphicon glyphicon-pushpin'"
                                   @click=" element.fixed=! element.fixed" aria-hidden="true"></i>
                                <img class="img-fluid" style="max-height: 40px; width: auto"
                                     :src="adresse(item.repertoire, [element])" alt="image">
                            </li>
                        </transition-group>
                    </draggable>
                </div>

                <div class="list-group col-md-4">
                    <div v-if="list[indexCourant].image === ''">
                        <div>
                            <label for="photo">Photo</label>
                            <input id="photo" type="file" name="photo" accept=".png, .jpg, .jpeg"
                                   @change="onChangePhoto">
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
    import Editor from '@tinymce/tinymce-vue';
    import {TINYMCEINIT, photoUpload, toHttp, postDonneesActualites} from '@/js/ServiceApi';
    import draggable from "vuedraggable";
    import {required} from 'vuelidate/lib/validators';

    export default {
        name: "actualitesedition",
        props: ['donneesActualites'],
        data() {
            return {
                tinyMceInit: TINYMCEINIT,
                networkError: null,
                isDragging: false,
                delayedDragging: false,
                editable: true,
                list: [],
                list2: [],
                indexCourant: 0,
                nomImage: '',
                menage: false,
                item: {
                    repertoire: '',
                    texte: '',
                    photos: []
                }
            }
        },
        validations: {
            item: {
                repertoire: {},
                texte: {
                    required
                }
            }
        },
        components: {
            draggable,
            'editor': Editor // <- Important part
        },
        methods: {
            status(validation) {
                return {
                    error: validation.$error,
                    dirty: validation.$dirty
                }
            },
            adresse: function (rep, photos) {
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
            addItem: function () {
                this.list.push({image: '', affiche: true});
                this.indexCourant = this.list.length - 1;
            },
            decIndex: function () {
                this.indexCourant = this.indexCourant === 0 ? 0 : this.indexCourant - 1;
                this.nomImage = '';
            },
            delItem: function (index) {
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
            validation() {
                this.item.photos = this.list.map(e => {
                    e.affiche = true;
                    return e
                }).concat(this.list2.map(e => {
                    e.affiche = false;
                    return e
                }));
                postDonneesActualites(this.item, this.menage, this.password)
                    .then(() => {
                        if (this.menage) {
                            this.item.photos = this.item.photos.filter(e => e.affiche)
                        }
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
            this.item = this.donneesActualites;
            this.list = this.item.photos.filter(p => p.affiche);
            this.list2 = this.item.photos.filter(p => !p.affiche);
            this.indexCourant = 0;
        }
    }
</script>

