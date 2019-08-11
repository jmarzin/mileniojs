<template>
  <div id="app">
    <Menu></Menu>
    <router-view id="router-view"></router-view>
    <hr>
    <Footer></Footer>
  </div>
</template>

<script>
    import Menu from '@/components/Menu.vue';
    import Footer from '@/components/Footer.vue';
    export default {
        name: 'home',
        components: {
            Menu,
            Footer
        }
    }
</script>


<style lang="scss">

/* Global Styles */

.panneau {
  height: 120px;
  overflow-y: hidden;
}

html,
body {
  height: 100%;
}

body {
  padding-top: 48px; /* Required padding for .navbar-fixed-top. Remove if using .navbar-static-top. Change if height of navigation changes. */
}

.img-hover:hover {
  opacity: 0.8;
}

header.carousel .fill {
  width: 100%;
  height: 100%;
  background-position: center;
  background-size: cover;
}

/* Responsive Styles */

@media(max-width:991px) {
  .img-related {
    margin-bottom: 30px;
  }
}

@media(max-width:767px) {
    margin-bottom: 15px;
}
</style>
