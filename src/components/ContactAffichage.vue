<template>
    <div id="contact-affichage">
            <div class="row">
                <div class="col-lg-12">
                    <h1 class="page-header">
                        Contact
                    </h1>
                </div>
            </div>
            <div class="row">
                <!-- Map Column -->
                <div class="col-md-8" v-html="donneesContact.openstreetmap"></div>
                <div class="col-md-4">
                    <h3>Coordonnées</h3>
                    <p><font-awesome-icon icon="map-marker-alt" size="xs"></font-awesome-icon>
                        <span>&nbsp;</span>
                        <abbr title="Adresse">A</abbr>: {{donneesContact.adresse}}</p>
                    <p><font-awesome-icon icon="phone" size="xs"></font-awesome-icon>
                        <span>&nbsp;</span>
                        <abbr title="Téléphone">T</abbr>: {{donneesContact.telephone}}</p>
                    <p><font-awesome-icon icon="envelope-open" size="xs"></font-awesome-icon>
                        <span>&nbsp;</span>
                        <abbr title="Email">E</abbr>: <a :href="'mailto:'+donneesContact.email">{{donneesContact.email}}</a>
                    </p>
                    <p><font-awesome-icon icon="clock" size="xs"></font-awesome-icon>
                        <span>&nbsp;</span>
                        <abbr title="Horaires">H</abbr>: {{donneesContact.horaires}}</p>
                    <a v-if="donneesContact.facebook" :href="donneesContact.facebook"><font-awesome-icon :icon="['fab', 'facebook']" size="lg"></font-awesome-icon></a>
                    <span>&nbsp;&nbsp;</span>
                    <a v-if="donneesContact.linkedin" :href="donneesContact.linkedin"><font-awesome-icon :icon="['fab', 'linkedin']" size="lg"></font-awesome-icon></a>
                    <span>&nbsp;&nbsp;</span>
                    <a v-if="donneesContact.twitter" :href="donneesContact.twitter"><font-awesome-icon :icon="['fab', 'twitter-square']" size="lg"></font-awesome-icon></a>
                    <span>&nbsp;&nbsp;</span>
                    <a v-if="donneesContact.googlePlus" :href="donneesContact.googlePlus"><font-awesome-icon :icon="['fab', 'google-plus-square']" size="lg"></font-awesome-icon></a>
                </div>
            </div>
            <div class="row">
                <div class="col-md-8">
                    <h3>Nous envoyer un message</h3>

                    <div class="form-group" :class="{ 'form-group--error': $v.contact.nom.$error }">
                        <label class="form__label">Nom et prénom:</label>
                        <span class="error" v-if="!$v.contact.nom.required"> obligatoire</span>
                        <br>
                        <input class="form__input" v-model.trim="$v.contact.nom.$model" :class="status($v.contact.nom)" name="nom"/>
                    </div>

                    <div class="form-group" :class="{ 'form-group--error': $v.contact.telephone.$error }">
                        <label class="form__label">Numéro de téléphone:</label>
                        <span class="error" v-if="!$v.contact.telephone.required"> obligatoire sans adresse mél</span>
                        <span class="error" v-if="!$v.contact.telephone.numeric"> numérique</span>
                        <span class="error" v-if="!$v.contact.telephone.minLength || !$v.contact.telephone.maxLength"> 10 chiffres</span>
                        <br>
                        <input class="form__input" v-model.trim="$v.contact.telephone.$model" :class="status($v.contact.telephone)" name="telephone"/>
                    </div>

                    <div class="form-group" :class="{ 'form-group--error': $v.contact.email.$error }">
                        <label class="form__label">Email:</label>
                        <span class="error" v-if="!$v.contact.email.required"> obligatoire sans numéro de téléphone</span>
                        <span class="error" v-if="!$v.contact.email.email"> adresse non conforme</span>
                        <br>
                        <input class="form__input" v-model.trim="$v.contact.email.$model" :class="status($v.contact.email)" name="email"/>
                    </div>

                    <div class="form-group">
                        <label>Joindre une demande de rendez-vous ?</label>
                        <section class="contact">
                            <input type="radio" v-model="contact.creneau" name="creneau" value="" checked> Pas de rendez-vous<br>
                            <div v-for="(creneau, index) in libres" :key="index">
                                <input type="radio" name="creneau" v-model="contact.creneau" :value="creneau.toISOString()">
                                {{creneau.toLocaleString()}}<br>
                            </div>
                        </section>
                    </div>

                    <div class="form-group" :class="{ 'form-group--error': $v.contact.message.$error }">
                        <label class="form__label">Message:</label>
                        <span class="error" v-if="!$v.contact.message.required"> obligatoire</span>
                        <br>
                        <textarea rows="10" cols = "100" maxlength="999" class="form__input" v-model.trim="$v.contact.message.$model" :class="status($v.contact.message)" name="message"/>
                    </div>

                    <div class="form-group" :class="{ 'form-group--error': $v.contact.$error }"></div>
                    <div class="error" v-if="$v.contact.$invalid">Le contact est incomplet ou invalide. Validation impossible.</div>
                    <button class="btn btn-primary" type="button" :disabled="$v.contact.$invalid || soumis" @click="envoyer">Envoyer le message</button>
                    <b-alert v-if="soumis && envoye" variant="success" show>Votre message a bien été envoyé !</b-alert>
                    <b-alert v-if="soumis && !envoye" variant="danger" show>Votre message n'a pas pu être envoyé. Veuillez réessayer dans un moment.</b-alert>
                </div>
            </div>

    </div>
</template>

<script>
    import {isAfter, addDays, addHours, areRangesOverlapping} from 'date-fns';
    import { required, email, numeric, minLength, maxLength, requiredUnless } from 'vuelidate/lib/validators'
    import { contact } from '@/js/ServiceApi';
    export default {
        name: "contactaffichage",
        props: ['donneesContact'],
        data() {
            return {
                contact: {
                    nom: '',
                    telephone: '',
                    email: '',
                    creneau: '',
                    message: '',
                },
                soumis: false,
                envoye: false
            }
        },
        validations: {
            contact: {
                nom: {
                    required
                },
                telephone: {
                    numeric,
                    minLength: minLength(10),
                    maxLength: maxLength(10),
                    required: requiredUnless('email')
                },
                email: {
                    email,
                    required: requiredUnless('telephone')
                },
                message: {
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
            envoyer() {
                contact(this.contact)
                    .then(() => {
                        this.envoye = true;
                        this.soumis = true;
                    })
                    .catch(() => {
                        this.envoye = false;
                        this.soumis = true;
                    })
          }
        },
        computed: {
            libres() {
                let localBusy = new Array(this.donneesContact.busy);
                let debut = new Date(Date.now());
                debut.setHours(debut.getHours() + 2);
                debut.setMinutes(0);
                debut.setSeconds(0);
                let fin = new Date(debut);
                fin.setMonth(fin.getMonth()+ 2);
                const jours = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
                const creneaux = [];
                var jour = debut.getDay();
                var enCours = new Date(debut);
                var continuer = true;
                var avant = new Date(debut);
                avant.setHours(0);
                var occupeeEnCours = {start: avant.toISOString(), end: debut.toISOString()};
                while(continuer) {
                    if(this.donneesContact.plages[jours[jour]].length > 0) {
                        let plageJour = this.donneesContact.plages[jours[jour]];
                        for(var ip = 0 ; ip < plageJour.length ; ip++) {
                            let seq = plageJour[ip];
                            for(var h = seq.debut ; h < seq.fin ; h++) {
                                enCours.setHours(h);
                                if(isAfter(enCours, fin)) { continuer = false; break; }
                                if(!occupeeEnCours || !areRangesOverlapping(enCours, addHours(enCours, 1), occupeeEnCours.start, occupeeEnCours.end)) {
                                    creneaux.push(new Date(enCours));
                                }
                                while(occupeeEnCours && isAfter(addHours(enCours, 1), occupeeEnCours.end)) {
                                    occupeeEnCours = localBusy.shift();
                                }
                            }
                        }
                    }
                    jour = jour === 6 ? 0 : jour + 1;
                    enCours = addDays(enCours, 1);
                }
                return creneaux;
            }
        }
    };
</script>

<style>
    section.contact {
        width: 100%;
        height: 100px;
        overflow-y: scroll;
        padding-left: 4px;
    }
    input {
        border: 1px solid silver;
        border-radius: 4px;
        background: white;
        padding: 5px 10px;
    }

    .form__input {
        border: 1px solid silver;
        border-radius: 4px;
        background: white;
        padding: 5px 10px;
    }

    .dirty {
        border-color: #5A5;
        background: #EFE;
    }

    .dirty:focus {
        outline-color: #8E8;
    }

    .error {
        border-color: red;
        color: red;
    }
</style>
