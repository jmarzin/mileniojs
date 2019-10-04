<template>
    <div id="contact-edition">
            <div class="form-group" :class="{ 'form-group--error': $v.item.openstreetmap.$error }">
                <label class="form__label">Openstreetmap</label>
                <span class="error" v-if="!$v.item.openstreetmap.required"> obligatoire</span>
                <br>
                <editor api-key="lh3xxpstbhgq2iccd82j1360ry6ru7jjpwhof9ou3epb55gh" :init="tinyMceInit"
                        v-model.trim="$v.item.openstreetmap.$model" class="form__input"
                        :class="status($v.item.openstreetmap)"></editor>
            </div>
            <div class="form-group" :class="{ 'form-group--error': $v.item.adresse.$error }">
                <label for="adresse" class="form__label">Adresse</label>
                <span class="error" v-if="!$v.item.adresse.required"> obligatoire</span>
                <br>
                <input id="adresse" class="form__input" v-model.trim="$v.item.adresse.$model"
                       :class="status($v.item.adresse)" size="60"/>
            </div>
            <div class="form-group" :class="{ 'form-group--error': $v.item.telephone.$error }">
                <label for="tel" class="form__label">Téléphone</label>
                <span class="error" v-if="!$v.item.telephone.required"> obligatoire</span>
                <span class="error" v-if="!$v.item.telephone.telephoneformat"> (nn nn nn nn nn)</span>
                <br>
                <input id="tel" class="form__input" v-model.trim="$v.item.telephone.$model"
                       :class="status($v.item.telephone)" size="60"/>
            </div>
            <div class="form-group" :class="{ 'form-group--error': $v.item.email.$error }">
                <label for="email" class="form__label">Adresse mél</label>
                <span class="error" v-if="!$v.item.email.required"> obligatoire</span>
                <span class="error" v-if="!$v.item.email.email"> adresse invalide</span>
                <br>
                <input id="email" class="form__input" v-model.trim="$v.item.email.$model" :class="status($v.item.email)"
                       size="60"/>
            </div>
            <div class="form-group" :class="{ 'form-group--error': $v.item.horaires.$error }">
                <label for="hor" class="form__label">Horaires</label>
                <span class="error" v-if="!$v.item.horaires.required"> obligatoire</span>
                <br>
                <input id="hor" class="form__input" v-model.trim="$v.item.horaires.$model"
                       :class="status($v.item.horaires)" size="60"/>
            </div>
            <div>
                {{item.plages}}
                <table class="horairestable">
                    <tr class="horairestable" v-for="(heure, index1) in heures.slice(0,-1)" :key="index1">
                        <td :id="jour+'-'+heure"
                            v-bind:class="{ 'ouvert': ouverts[jour+'-'+heure], 'ferme': ouverts[jour+'-'+heure] === false }"
                            class="horairestable" v-for="(jour, index2) in jours" :key="index2" @click="click"><small>{{contenu(index1,index2)}}</small>
                        </td>
                    </tr>
                </table>
            </div>
            <div class="form-group" :class="{ 'form-group--error': $v.item.duree_rdv.$error }">
                <label for="dur" class="form__label">Durée du rendez-vous</label>
                <span class="error" v-if="!$v.item.duree_rdv.required"> obligatoire</span>
                <span class="error" v-if="!$v.item.duree_rdv.between"> la durée doit être comprise entre 30 et 240 minutes</span>
                <br>
                <input id="dur" type="number" class="form__input" v-model.trim.number="$v.item.duree_rdv.$model"
                       :class="status($v.item.duree_rdv)"/>
            </div>
            <div class="form-group" :class="{ 'form-group--error': $v.item.frequence_rdv.$error }">
                <label for="freq" class="form__label">Fréquence de recherche de rendez-vous possibles</label>
                <span class="error" v-if="!$v.item.frequence_rdv.required"> obligatoire</span>
                <span class="error" v-if="!$v.item.frequence_rdv.between"> la fréquence doit être comprise entre 30 et 120 minutes</span>
                <br>
                <input id="freq" type="number" class="form__input" v-model.trim.number="$v.item.frequence_rdv.$model"
                       :class="status($v.item.frequence_rdv)"/>
            </div>
            <div class="form-group" :class="{ 'form-group--error': $v.item.facebook.$error }">
                <label for="face" class="form__label">Facebook</label>
                <span class="error" v-if="!$v.item.facebook.url"> url non régulière</span>
                <br>
                <input id="face" class="form__input" v-model.trim="$v.item.facebook.$model"
                       :class="status($v.item.facebook)" size="60"/>
            </div>
            <div class="form-group" :class="{ 'form-group--error': $v.item.linkedin.$error }">
                <label for="link" class="form__label">Linkedin</label>
                <span class="error" v-if="!$v.item.linkedin.url"> url non régulière</span>
                <br>
                <input id="link" class="form__input" v-model.trim="$v.item.linkedin.$model"
                       :class="status($v.item.linkedin)" size="60"/>
            </div>
            <div class="form-group" :class="{ 'form-group--error': $v.item.twitter.$error }">
                <label for="twi" class="form__label">Twitter</label>
                <span class="error" v-if="!$v.item.twitter.url"> url non régulière</span>
                <br>
                <input id="twi" class="form__input" v-model.trim="$v.item.twitter.$model"
                       :class="status($v.item.twitter)" size="60"/>
            </div>
            <div class="form-group" :class="{ 'form-group--error': $v.item.googleplus.$error }">
                <label for="goog" class="form__label">Google Plus</label>
                <span class="error" v-if="!$v.item.googleplus.url"> url non régulière</span>
                <br>
                <input id="goog" class="form__input" v-model.trim="$v.item.googleplus.$model"
                       :class="status($v.item.googleplus)" size="60"/>
            </div>
            <button class="btn btn-secondary" @click="$emit('abandon')">Abandon</button>
            <span>&nbsp;</span>
            <button :disabled="$v.item.invalid" class="btn btn-primary" @click="validation">Validation</button>
        </div>
</template>

<script>
    import Editor from '@tinymce/tinymce-vue';
    import {TINYMCEINIT, postContactAccueil} from '@/js/ServiceApi';
    import {required, email, between, url} from 'vuelidate/lib/validators';

    export default {
        name: "contactedition",
        components: {
            'editor': Editor
        },
        props: ['donneesContact'],
        data() {
            return {
                jours: ['jblanc', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'],
                heures: ['hblanc', '8h00', '8h30', '9h00', '9h30', '10h00', '10h30', '11h00', '11h30', '12h00', '12h30',
                    '13h00', '13h30', '14h00', '14h30', '15h00', '15h30', '16h00', '16h30', '17h00', '17h30', '18h00', '18h30',
                    '19h00', '19h30', '20h00', '20h30'],
                ouverts: {},
                tinyMceInit: TINYMCEINIT,
                item: {
                    openstreetmap: '',
                    adresse: '',
                    telephone: '',
                    email: '',
                    horaires: '',
                    plages: {
                        lundi: [],
                        mardi: [],
                        mercredi: [],
                        jeudi: [],
                        vendredi: [],
                        samedi: [],
                        dimanche: []
                    },
                    duree_rdv: 0,
                    frequence_rdv: 0,
                    facebook: '',
                    linkedin: '',
                    twitter: '',
                    googleplus: ''
                }
            }
        },
        validations: {
            item: {
                openstreetmap: {
                    required
                },
                adresse: {
                    required
                },
                telephone: {
                    required,
                    telephoneformat(value) {
                        if (value === '') return true;
                        return !!value.match(/^\d\d \d\d \d\d \d\d \d\d$/);

                    }
                },
                email: {
                    required,
                    email
                },
                horaires: {
                    required
                },
                duree_rdv: {
                    required,
                    between: between(30, 240)
                },
                frequence_rdv: {
                    required,
                    between: between(30, 120)
                },
                facebook: {
                    url
                },
                linkedin: {
                    url
                },
                twitter: {
                    url
                },
                googleplus: {
                    url
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
            click(e) {
                let id = e.currentTarget.id;
                if (id.includes('blanc')) return;
                let j = id.split('-')[0];
                this.ouverts[id] = !this.ouverts[id];
                this.ouverts = Object.assign({}, this.ouverts);
                this.item.plages[j] = this.recalcul(j);
            },
            recalcul(j) {
                let _this = this;
                let tab = [];
                let obj = {};
                this.heures.slice(1,).forEach(function (h) {
                    if (_this.ouverts[j + '-' + h]) {
                        if (obj.debut) {
                            return true;
                        } else {
                            obj.debut = h;
                        }
                    } else {
                        if (obj.debut) {
                            obj.fin = h;
                            tab.push(obj);
                            obj = {};
                        } else {
                            return true;
                        }
                    }
                });
                return tab;
            },
            contenu(iheure, ijour) {
                if (iheure === 0) {
                    if (ijour === 0) {
                        return ''
                    } else return this.jours[ijour];
                }
                if (ijour === 0) return this.heures[iheure];
                return ''
            },
            validation() {
                postContactAccueil(this.item, this.password)
                    .then(() => {
                        this.$emit('maj', this.item)
                    })
                    .catch(e => {
                        this.networkError = e;
                    })
            }
        },
        computed: {
            password() {
                return this.$store.state.admin
            }
        },
        created() {
            this.item = this.donneesContact;
            let _this = this;
            this.jours.slice(1,).forEach(function (j) {
                _this.heures.slice(1,).forEach(function (h) {
                    _this.ouverts[j + '-' + h] = false;
                });
                _this.item.plages[j].forEach(function (p) {
                    let idebut = _this.heures.indexOf(p['debut']);
                    let ifin = _this.heures.indexOf(p['fin']);
                    for (var i = idebut; i < ifin; i++) {
                        _this.ouverts[j + '-' + _this.heures[i]] = true;
                    }
                })
            });
        }
    }
</script>
<style scoped>
    .horairestable {
        border-style: solid;
        table-layout: fixed;
        width: 5em;
        overflow: hidden;
        word-wrap: break-word;
        text-align: center;
    }
    .ouvert {
        background-color: lightgreen;
    }
    .ferme {
        background-color: lightcoral;
    }
</style>
