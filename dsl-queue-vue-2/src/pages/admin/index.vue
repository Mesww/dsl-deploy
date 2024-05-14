<template lang="">
  <div class="bg w-screen min-h-screen">
          <navbar/>
          <div class="flex ">
              <sidebar/>
              <router-view></router-view>
              <!-- <router-link to="/teacher/home">home</router-link>
              <router-link to="/teacher/dashboard">dasboard</router-link> -->
          </div>            
      <footers/>
  </div>
</template>

<script lang="ts" setup>
  import { useIntervalFn } from '@vueuse/core';
  import { ref } from "vue";  
  import Swal from "sweetalert2";
  import "animate.css";
  import navbar from '../../components/admin/navbar.vue';
  import sidebar from "../../components/admin/sidebar.vue";
  import footers from '../../components/admin/footer.vue';

</script>

<style lang="scss">
  .bg{
      background-color: #191770;
  }
  footers{
      margin-top: auto;
}
</style>
