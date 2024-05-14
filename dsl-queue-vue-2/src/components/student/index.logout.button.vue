<template>
  <div class=" me-4 mb-4">
    <v-btn @click="logout" color="red" prepend-icon="mdi-logout" rounded="xl" class="">
       logout</v-btn>
  </div>


</template>

<script setup lang="ts">
import router from "@/router";
import axios from "axios";
import Swal from "sweetalert2";
import { useCookies } from "vue3-cookies";

const { cookies } = useCookies();

async function logout() {

  const { isConfirmed } = await Swal.fire({
  title: "คุณแน่ใจใช่ไหม?",
  text: "คุณกำลังจะออกจากระบบ!",
  icon: "warning",
  showCancelButton: true,
  confirmButtonColor: "#191771",
  cancelButtonColor: "#ED1C24",
  confirmButtonText: "ยืนยัน!",
  cancelButtonText:'ยกเลิก',
  iconColor:'#ED1C24',
  reverseButtons: true,
  color:'#191771'
})
    if (isConfirmed) {
      cookies.remove("accesstoken");
      cookies.remove("refreshtoken");
      router.push({name:"root",replace:true});
    }
}
</script>

<style scoped></style>
