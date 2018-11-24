import * as axios from 'axios';

const BASE_URL = 'http://localhost:3000';
const LOGIN = {username: 'admin', password: '51julie2'};

function photoUpload(data, destination) {
    const formData = new FormData();
    formData.append(data.name, data.files[0], data.files[0].name);
    formData.append('destination', destination);
    return axios({
        method: 'post',
        url: BASE_URL + '/photoupload',
        data: formData,
        auth: LOGIN
    })
        .then(x => BASE_URL + x.data.name)
}

function getCarouselAccueil() {
    return axios.get(`${BASE_URL}/accueil/carousel`)
        .then(res => res.data.map(e => Object.assign({}, e, {photo: `${BASE_URL}/${e.photo}`})))
}

function postCarouselAccueil(list, menage) {
    const newList = list.map(e => Object.assign({}, e, {photo: e.photo.replace(`${BASE_URL}/`, '')}));
    return axios({
        method: 'post',
        url: `${BASE_URL}/accueil/carousel`,
        data: { liste: newList, menage: menage },
        auth: LOGIN
    })

}

function getPanneauxAccueil() {
    return axios.get(`${BASE_URL}/accueil/panneaux`)
        .then(res => res.data)
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
        url: "https://www.googleapis.com/calendar/v3/freeBusy?fields=calendars%2Cgroups%2Ckind%2CtimeMax%2CtimeMin&key=AIzaSyCvvurPk_6StASYk_eNeXj3sWYOhx6pYm4",
        data: json_request,
    });
    return Promise.all([p1, p2])
        .then(reponses => {
            let rep = reponses[1];
            let busy = rep.data.calendars[Object.keys(rep.data.calendars)[0]].busy;
            return Object.assign({}, reponses[0].data, {busy: busy})
    })
}

function litAccueil() {
    let p1 = getCarouselAccueil();
    let p2 = getPanneauxAccueil();
    let p3 = getContactAccueil();
    return Promise.all([p1, p2, p3]);
}

function contact(donnees) {
    return axios({
        method: 'post',
        url: `${BASE_URL}/accueil/message`,
        data: donnees,
        auth: LOGIN
    })

}

function litRealisations() {
    return axios.get(`${BASE_URL}/realisations`)
        .then(res => res.data)
}

function toHttp(rep, photos) {
    return BASE_URL + '/' + rep + '/' + photos[0].image
}

export { photoUpload, getCarouselAccueil, postCarouselAccueil, getPanneauxAccueil, getContactAccueil, litAccueil, contact,
litRealisations, toHttp}
