<template>
    <div id="menu">
        <b-navbar toggleable="md" fixed="top" type="dark" variant="dark" class="py-1">
            <div class="container">
                <div class="navbar-header mx-auto">
                    <b-navbar-brand class="active" to="/">Milénioconcept</b-navbar-brand>
                    <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
                </div>
                <b-collapse is-nav id="nav_collapse">

                    <b-navbar-nav class="ml-auto">
                        <b-nav-item to="/" v-bind:class="{ active: $route.path === '/' }">Accueil</b-nav-item>
                        <b-nav-item href="#" v-bind:class="{ active: $route.path.indexOf('actualites') > 0 }">Actualités</b-nav-item>
                        <b-nav-item-dropdown v-bind:class="{ active: $route.path.indexOf('services') > 0 }" text="Services" right>
                            <b-dropdown-item href="#" v-bind:class="{ active: $route.path.indexOf('cuisines') > 0 }">Cuisines</b-dropdown-item>
                            <b-dropdown-item href="#" v-bind:class="{ active: $route.path.indexOf('sallesdebain') > 0 }">Salles de bain</b-dropdown-item>
                            <b-dropdown-item href="#" v-bind:class="{ active: $route.path.indexOf('rangements') > 0}">Rangements</b-dropdown-item>
                        </b-nav-item-dropdown>
                        <b-nav-item href="#contact" v-bind:class="{ active: $route.path.indexOf('contact') > 0 }">Contact</b-nav-item>
                        <b-nav-item to='/realisations' v-bind:class="{ active: $route.path.indexOf('realisations') > 0 }">Réalisations</b-nav-item>
                    </b-navbar-nav>
                </b-collapse>
            </div>
        </b-navbar>
    </div>
</template>

<script>
    export default {
        name: 'Menu',
    }
</script>

<style>

</style>
