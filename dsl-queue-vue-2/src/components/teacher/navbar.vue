<template lang="">
  <nav id="navbar" class="bg-white border rounded-b-3xl">
    <div class="max-w-6xl mx-auto px-4">
      <div class="flex justify-between">
        <div class="flex space-x-4">
          <!-- logo -->
          <div>
            <a
              href="#"
              class="flex items-center py-5 px-2 text-gray-700 hover:text-gray-900"
            >
              <!-- <IconHome class="w-10 h-10" :fontControlled="false" />
              <img alt="Vue logo" class="logo" src="../../icons/Student_Loan_logo.svg" width="125" height="125"/> -->
              <v-img width="50" src="../../assets/dsl-logo.png" />
            </a>
          </div>
          <!-- primary nav -->
          <div class="head hidden md:flex items-center space-x-1">
            <h1 class="text py-5 px-3">
              บริการคิวออนไลน์ | ส่วนพัฒนานักศึกษา (ทุนเงินกู้ยืมเพื่อการศึกษา)
            </h1>
          </div>
        </div>
        <!--  hover:bg-blue-600 transition duration-300 -->
        
        <!-- mobile button goes here -->
        <div class="md:hidden flex items-center">
        </div>
      </div>
    </div>
    <!-- mobile menu -->
    <div class="md:hidden" :class="isOpen ? 'block' : 'hidden'">
      <div class="head flex m-3">
        <h1 class="text py-5 px-3">
          บริการคิวออนไลน์ | ส่วนพัฒนานักศึกษา (ทุนเงินกู้ยืมเพื่อการศึกษา)
        </h1>
      </div>
    </div>
  </nav>
</template>
<script lang="ts" setup>
// import IconHome from "../../assets/icons/Student_Loan_logo.svg";
import Swal from "sweetalert2";
import "animate.css";
import { onMounted, ref } from "vue";
let showMenu = ref(false);
let isOpen = ref(true);
let myChannel =ref(0);
import { useCookies } from "vue3-cookies";
import axios from "axios";
const { cookies } = useCookies();
const accesstoken = cookies.get("accesstoken");
const access_token_extract = parseJwt(accesstoken);
function parseJwt(token: string) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );
  return JSON.parse(jsonPayload);
}
async function getMyuser() {
  try {
    const res = await axios.get(
      `http://localhost:${process.env.VUE_APP_BACK_PORT}/users/getSpecificuser?email=${access_token_extract.email}`
    );
    if (res.status !== 200) {
      throw Error(res.statusText);
    }
    myChannel.value = res.data.channel;
    console.log("mychannel ", myChannel);
  } catch (error) {
    console.error(error);
  }
}



function error() {
  Swal.fire({
    title: "Error!",
    text: "Do you want to continue",
    icon: "error",
    confirmButtonText: "Cool",
  });
}

onMounted(getMyuser);

</script>
<style lang="scss" scoped>
.head {
  .text {
    text-decoration: none;
    font-size: medium;
    color: #191771;
    user-select: none;
  }
  .iconheader {
    font-size: 2rem;
    color: #191771;
    user-select: none;

    // &:hover {
    //   color: var(--primary-alt);
    // }
  }
}
</style>
