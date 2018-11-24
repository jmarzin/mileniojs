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

.img-portfolio {
  margin-bottom: 30px;
}

.img-hover:hover {
  opacity: 0.8;
}

/* Home Page Carousel */

header.carousel {
  height: 50%;
}

header.carousel .item,
header.carousel .item.active,
header.carousel .carousel-inner {
  height: 100%;
}

header.carousel .fill {
  width: 100%;
  height: 100%;
  background-position: center;
  background-size: cover;
}

/* 404 Page Styles */

.error-404 {
  font-size: 100px;
}

/* Pricing Page Styles */

.price {
  display: block;
  font-size: 50px;
  line-height: 50px;
}

.price sup {
  top: -20px;
  left: 2px;
  font-size: 20px;
}

.period {
  display: block;
  font-style: italic;
}

/* Responsive Styles */

@media(max-width:991px) {
  .customer-img,
  .img-related {
    margin-bottom: 30px;
  }
}

@media(max-width:767px) {
  .img-portfolio {
    margin-bottom: 15px;
  }

  header.carousel .carousel {
    height: 70%;
  }
}
</style>
