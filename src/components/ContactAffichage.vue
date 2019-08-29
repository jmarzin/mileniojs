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
                        <b-form-textarea rows="5" max-rows="10" class="form__input" v-model.trim="$v.contact.message.$model" :class="status($v.contact.message)" name="message"></b-form-textarea>
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
    import {endOfHour, addMilliseconds, addMinutes, addHours, addDays, addMonths, areRangesOverlapping,
            getDay, startOfDay, startOfHour, setHours, isWithinRange, isBefore} from 'date-fns';
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
                function premiere_plage_disponible(heure_au_plus_tot, ouvertures, duree) {
                    const jours = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
                    let jour = getDay(heure_au_plus_tot);
                    for (let j = 0; j < 8; j++) {
                        let plages_du_jour = ouvertures[jours[(jour + j) % 7]];
                        for (let i = 0; i < plages_du_jour.length; i++) {
                            let debut_plage = startOfHour(setHours(heure_au_plus_tot , plages_du_jour[i].debut));
                            if (isBefore(heure_au_plus_tot, debut_plage)) {
                                return {start: debut_plage, end: addMinutes(debut_plage, duree)}
                            }
                            let fin_plage = startOfHour(setHours(heure_au_plus_tot, plages_du_jour[i].fin));
                            if (isWithinRange(heure_au_plus_tot, debut_plage, fin_plage) && isWithinRange(addMinutes(heure_au_plus_tot, duree_rdv), debut_plage, fin_plage)) {
                                return {start: heure_au_plus_tot, end: addMinutes(heure_au_plus_tot, duree)};
                            }
                        }
                        heure_au_plus_tot = startOfDay(addDays(heure_au_plus_tot, 1));
                    }
                    return {}
                }

                const ouvertures = this.donneesContact.plages;
                const duree_rdv = this.donneesContact.duree_rdv;
                const frequence_rdv = this.donneesContact.frequence_rdv;
                let plages_occupees = this.donneesContact.busy;
                let  heure_au_plus_tot = new Date(Date.now());
                heure_au_plus_tot = addHours(addMilliseconds(endOfHour(heure_au_plus_tot), 1), 2);
                const heure_au_plus_tard = addMonths(heure_au_plus_tot, 2);
                const creneaux = [];
                let plage_occupee = plages_occupees.shift();
                while (isBefore(heure_au_plus_tot, heure_au_plus_tard)) {
                    const plage_disponible = premiere_plage_disponible(heure_au_plus_tot, ouvertures, duree_rdv);
                    if (plage_disponible === {}) break;
                    while (plage_occupee != null && isBefore(plage_occupee.end, addMinutes(plage_disponible.start, 1))) {
                        plage_occupee = plages_occupees.shift();
                    }
                    if(plage_occupee && areRangesOverlapping(plage_occupee.start, plage_occupee.end, plage_disponible.start, plage_disponible.end)) {
                        heure_au_plus_tot = plage_occupee.end;
                    } else {
                        creneaux.push(new Date(plage_disponible.start));
                        heure_au_plus_tot = addMinutes(plage_disponible.start, frequence_rdv);
                    }
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
