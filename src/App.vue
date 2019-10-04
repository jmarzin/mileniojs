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

.blue {
  border-style: solid;
  border-color: #007bff;
}

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
