import * as axios from 'axios';
import {urlGoogleMail} from './urlGoogleMail';
import store from './../store';

const BASE_URL =  'https://milenioapi.jmarzin.fr';
const LOGIN = {username: 'utilisateur', password: 'message'};

let TINYMCEINIT = {
    selector: 'textarea',  // change this value according to your HTML
    "images_upload_handler": function (blobInfo, success, failure) {
        let xhr, formData;

        xhr = new XMLHttpRequest();
        xhr.open( 'POST', BASE_URL + '/photoupload', true);
        xhr.setRequestHeader("Authorization", "Basic " + Buffer.from("admin:" + store.state.admin).toString('base64'));

        xhr.onload = function() {
            var json;

            if (xhr.status !== 200) {
                failure('HTTP Error: ' + xhr.status);
                return;
            }

            json = JSON.parse(xhr.responseText);

            if (!json || typeof json.fichier != 'string') {
                failure('Invalid JSON: ' + xhr.responseText);
                return;
            }

            success(BASE_URL + '/' + json.fichier);
        };

        formData = new FormData();
        formData.append( 'photo', blobInfo.blob(), blobInfo.filename() );
        formData.append( 'destination', 'contenu/images_textes' );

        xhr.send(formData);
    },
    plugins: ['wordcount', 'image', 'autoresize', 'code', 'link', 'lists', 'table'],
    toolbar: 'undo redo | styleselect | bold italic | link image table | alignleft aligncenter alignright | numlist bullist | code',
    image_uploadtab: true,
    image_caption: true,
    image_advtab: true,
    image_title: true
};

function photoUpload(data, destination, password) {
    const formData = new FormData();
    formData.append(data.name, data.files[0], data.files[0].name);
    formData.append('destination', destination);
    // noinspection JSUnresolvedFunction
    return axios({
        method: 'post',
        url: BASE_URL + '/photoupload',
        data: formData,
        auth: { username: 'admin', password: password }
    })
        .then(
            res => {
                if (res.resultat === 'KO') throw "Problème serveur lors de la copie du fichier";
                return BASE_URL + '/' + res.data.fichier
            })
}

function getCarouselAccueil() {
    return axios.get(`${BASE_URL}/accueil/carousel`)
        .then(
            res => res.data.map(e => Object.assign({}, e, {photo: `${BASE_URL}/${e.photo}`})))
}

function postCarouselAccueil(list, menage, password) {
    const newList = list.map(e => Object.assign({}, e, {photo: e.photo.replace(`${BASE_URL}/`, '')}));
    return axios({
        method: 'post',
        url: `${BASE_URL}/accueil/carousel`,
        data: { liste: newList, menage: menage },
        auth: { username: 'admin', password: password }
    })

}

function postDonneesRealisations(list, index, menage, password) {
    return axios({
        method: 'post',
        url: `${BASE_URL}/realisations`,
        data: { liste: list, index: index, menage: menage },
        auth: { username: 'admin', password: password }
    })
}

function getPanneauxAccueil() {
    return axios.get(`${BASE_URL}/accueil/panneaux`)
        .then(
            res => res.data)
}

function postPanneauxAccueil(donnees, password) {
    return axios({
        method: 'post',
        url: `${BASE_URL}/accueil/panneaux`,
        data: donnees,
        auth: { username: 'admin', password: password }
    })
}

function getContactAccueil() {
    let p1 = axios.get(`${BASE_URL}/accueil/contact`);
    let debut = new Date(Date.now());
    debut.setHours(debut.getHours() + 2);
    debut.setMinutes(0);
    debut.setSeconds(0);
    let fin = new Date(debut);
    fin.setMonth(fin.getMonth()+ 2);
    let json_request = JSON.parse(
        "{\"items\": [{\"id\": \"9ua7u1mtcenp7ha665e7kpktmo@group.calendar.google.com\"}],\"timeMin\": \""
        + debut.toISOString() +
        "\",\"timeMax\": \""
        + fin.toISOString() +
        "\"}");
    let p2 = axios({
        method: 'post',
        url: urlGoogleMail,
        data: json_request,
    });
    return Promise.all([p1, p2])
        .then(reponses => {
            let rep = reponses[1];
            let busy = rep.data.calendars[Object.keys(rep.data.calendars)[0]].busy;
            return Object.assign({}, reponses[0].data, {busy: busy})
    })
}

function postContactAccueil(donnees, password) {
    return axios({
        method: 'post',
        url: `${BASE_URL}/accueil/contact`,
        data: donnees,
        auth: { username: 'admin', password: password }
    })
}

function litAccueil() {
    let p1 = getCarouselAccueil();
    let p2 = getPanneauxAccueil();
    let p3 = getContactAccueil();
    return Promise.all([p1, p2, p3]);
}

function contact(donnees) {
    donnees.creneau = new Date(donnees.creneau).toLocaleString();
    return axios({
        method: 'post',
        url: `${BASE_URL}/accueil/message`,
        data: donnees,
        auth: LOGIN
    })

}

function litRealisations(routeName) {
    return axios.get(`${BASE_URL}/${routeName}`)
        .then(res => res.data)
}

function litActualites() {
    return axios.get(`${BASE_URL}/a_propos`)
        .then(res => res.data)
}

function postDonneesActualites(donnees, menage, password) {
    return axios({
        method: 'post',
        url: `${BASE_URL}/a_propos`,
        data: { donnees_actualites: donnees, menage: menage },
        auth: { username: 'admin', password: password }
    })
}

function toHttp(rep, photos) {
    return BASE_URL + '/' + rep + '/' + photos[0].image
}

export { photoUpload, getCarouselAccueil, postCarouselAccueil, getPanneauxAccueil, getContactAccueil, litAccueil, contact,
litRealisations, postDonneesRealisations, litActualites, toHttp, postDonneesActualites, postPanneauxAccueil, postContactAccueil, BASE_URL, TINYMCEINIT}
