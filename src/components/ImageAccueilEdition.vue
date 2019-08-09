<template>
    <div id="image-accueil-edition">
        <div class="fluid container">
            <b-row>
                <div class="col-md-4">
                    <h2>Sélectionnées</h2>
                    <draggable class="list-group" v-model="list" :options="dragOptions" :move="onMove"
                               @start="isDragging=true" @end="isDragging=false" @remove="decIndex">
                        <transition-group class="list-group" type="transition" :name="'flip-list'">
                            <li class="list-group-item" v-for="(element, index) in list" :key="index">
                                <font-awesome-icon icon="pen" size="xs" @click="editItem(index)"></font-awesome-icon>
                                <span>&nbsp;</span>
                                <font-awesome-icon icon="trash" size="xs" v-if="element.photo === ''" @click="delItem(index)"></font-awesome-icon>
                                <br><img class="img-fluid" style="max-height: 40px; width: auto" :src="element.photo">
                                <br>{{element.caption}}
                            </li>
                        </transition-group>
                        <button slot="footer" @click="addImage">
                            <font-awesome-icon slot="footer" icon="plus" size="xs"></font-awesome-icon>
                        </button>
                    </draggable>
                </div>

                <div class="col-md-4">
                    <h2>En réserve</h2>
                    <draggable element="span" class="list-group" v-model="list2" :options="dragOptions" :move="onMove">
                        <transition-group name="no" class="list-group" tag="ul">
                            <li class="list-group-item" v-for="(element, index) in list2" :key="index">
                                <i :icon="element.fixed? 'anchor' : 'glyphicon glyphicon-pushpin'" @click=" element.fixed=! element.fixed" aria-hidden="true"></i>
                                <img class="img-fluid" style="max-height: 40px; width: auto" :src="element.photo">
                                <br>{{element.caption}}
                            </li>
                        </transition-group>
                    </draggable>
                </div>

                <div class="list-group col-md-4" v-if="list.length > 0">
                    <h2>Edition</h2>
                    <label for="texte">Texte</label>
                    <input id="texte" v-model="list[indexCourant].caption">
                    <div v-if="list[indexCourant].photo === ''">
                        <label for="photo">Photo</label>
                        <input id="photo" type="file" name="photo" accept=".png, .jpg, .jpeg" @change="onChangePhoto">
                    </div>
                    <div v-if="networkError">
                        {{networkError.message}}
                    </div>
                    <hr>
                    <input type="checkbox" id="checkbox" v-model="menage">
                    <label for="checkbox">Faire le ménage sur le serveur à la validation</label>
                </div>
            </b-row>
            <button class="btn btn-secondary" @click="$emit('abandon')">Abandon</button>
            <span>&nbsp;</span>
            <button class="btn btn-primary" @click="validation">Validation</button>
        </div>
    </div>
</template>

<script>
    import draggable from "vuedraggable";
    import { photoUpload, postCarouselAccueil } from '@/js/ServiceApi';
    export default {
        name: "imageaccueiledition",
        components: {
            draggable
        },
        props: ['donneesCarousel'],
        data() {
            return {
                list: [],
                list2: [],
                editable: true,
                isDragging: false,
                delayedDragging: false,
                indexCourant: 0,
                networkError: null,
                menage: false
            }
        },
        methods: {
            onSlideStart() {
                this.sliding = true
            },
            onSlideEnd() {
                this.sliding = false
            },
            onMove({ relatedContext, draggedContext }) {
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
            addImage() {
                for (var i = 0; i < this.list.length ; i++) {
                    if(this.list[i].caption === "" && this.list[i].photo === "") return;
                }
                this.list.push({caption: '', photo: '', affiche: true});
                this.indexCourant = this.list.length - 1;
            },
            onChangePhoto(event) {
                photoUpload(event.target, 'carousel_accueil', this.password)
                    .then((res) => {
                        this.list[this.indexCourant].photo = res;
                        this.networkError = null;
                    }).catch(e => {
                    this.networkError = e ;
                })
            },
            validation() {
                var newList = this.list.map(e => {
                    e.affiche=true;
                    return e});
                if(!this.menage) {
                    newList = newList.concat(this.list2.map(e => {
                        e.affiche=false;
                        return e;}))}
                postCarouselAccueil(newList, this.menage, this.password)
                    .then(() => {
                        this.$emit('maj', newList)
                    })
                    .catch(e => {
                        this.networkError = e ;
                    })

            }
        },
        computed: {
            carousel_accueil() {
                return this.donneesCarousel.filter(p => p.affiche);
            },
            dragOptions() {
                return {
                    animation: 0,
                    group: "description",
                    disabled: !this.editable,
                    ghostClass: "ghost",
                    draggable:'.list-group-item'
                };
            },
            password() {
                return this.$store.state.admin
            }
        },
        mounted() {
            this.menage = false;
            this.list = this.carousel_accueil;
            this.list2 = this.donneesCarousel.filter(p => !p.affiche);
        },
        watch: {
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

<style>
    .flip-list-move {
        transition: transform 0.5s;
    }
    .no-move {
        transition: transform 0s;
    }
    .ghost {
        opacity: 0.5;
        background: #c8ebfb;
    }
    .list-group {
        min-height: 20px;
        display: block;
    }
    .list-group-item {
        cursor: move;
    }
    .list-group-item svg {
        cursor: pointer;
    }

</style>
