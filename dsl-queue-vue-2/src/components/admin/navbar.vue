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
                <v-img
                width="50"
          src="../../assets/dsl-logo.png"
        />
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
          <!-- secondary nav -->
          <div class="head hidden md:flex items-center space-x-1">
            <!-- <span
              class="iconheader i-heroicons-user-circle"
              @click="changeUsername"
              ref="iconRef"
              id="iconheaders"
            ></span> -->
          </div>
          <!-- mobile button goes here -->
          <div class="md:hidden flex items-center">
            <button @click="isOpen = !isOpen" class="md:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </button>
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
import { ref } from 'vue';
  let showMenu = ref(false);
  let isOpen = ref(true);
  function error() {
    Swal.fire({
          title: "Error!",
          text: "Do you want to continue",
          icon: "error",
          confirmButtonText: "Cool",
        });
  }
  
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
  