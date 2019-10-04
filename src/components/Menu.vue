<template>
    <div id="menu">
        <b-navbar toggleable="md" fixed="top" type="dark" variant="dark">
            <div class="container">
                <div class="navbar-header mx-auto">
                    <b-navbar-brand to="/">Milénioconcept</b-navbar-brand>
                    <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
                </div>
                <b-collapse is-nav id="nav_collapse">
                    <b-navbar-nav class="ml-auto">
                        <b-nav-item to="/" :class="{ active: $route.path === '/' }">Accueil</b-nav-item>
                        <b-nav-item to="/actualites" v-bind:class="{ active: $route.path.indexOf('actualites') > 0 }">Actualités</b-nav-item>
                        <b-nav-item-dropdown v-bind:class="{ active: $route.path.indexOf('cuisines') > 0 || $route.path.indexOf('salles_de_bain') > 0 || $route.path.indexOf('rangements') > 0 }" text="Services" right>
                            <b-dropdown-item to='/cuisines' v-bind:class="{ active: $route.path.indexOf('cuisines') > 0 }">Cuisines</b-dropdown-item>
                            <b-dropdown-item to='/salles_de_bain' v-bind:class="{ active: $route.path.indexOf('salles_de_bain') > 0 }">Salles de bain</b-dropdown-item>
                            <b-dropdown-item to='/rangements' v-bind:class="{ active: $route.path.indexOf('rangements') > 0}">Rangements</b-dropdown-item>
                        </b-nav-item-dropdown>
                        <b-nav-item v-on:click="scrollTo" v-bind:class="{ active: $route.fullPath.indexOf('contact') > 0 }">Contact</b-nav-item>
                        <b-nav-item to='/realisations' v-bind:class="{ active: $route.path.indexOf('realisations') > 0 }">Réalisations</b-nav-item>
                    </b-navbar-nav>
                </b-collapse>
            </div>
        </b-navbar>
    </div>
</template>

<script>
    const TIMEOUT = 100;
    export default {
        name: 'Menu',
        updated () {
            // From testing, without a brief timeout, it won't work.
            if (this.$route.hash === "#contact") {
                setTimeout(() => this.scrollTo(), TIMEOUT)
            }
        },
        methods: {
            scrollTo: function () {
                if(this.$route.path !== "/") {
                    this.$router.push("/#contact")
                } else {
                    setTimeout(() => { location.href = "#contact" }, TIMEOUT)
                }
            }
        }
    }
</script>
