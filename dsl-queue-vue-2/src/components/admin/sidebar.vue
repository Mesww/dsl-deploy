<template>
    <aside :class="`${is_expanded ? 'is-expanded' : ''}`">

      <div class="logo">
              <v-img width="50" src="../../assets/dsl-logo.png" alt="DSL" /> 
          </div>
  
      <div class="menu-toggle-wrap">
        <button class="menu-toggle" @click="ToggleMenu">
            <v-icon class="togglesidebar">mdi-arrow-right-circle-outline</v-icon>
          <!-- <span class="i-heroicons-chevron-double-right"></span> -->
        </button>
      </div>
  
      <h3 >Menu</h3>
      <div class="menu">
        <router-link to="/admin/home" class="button">
          <v-icon class="iconsidebar">mdi-home-circle-outline</v-icon>
          <span class="text">แดชบอร์ด</span>
        </router-link>
        <router-link to="/admin/history" class="button">
          <v-icon class="iconsidebar">mdi-history</v-icon>
          <span class="text">รายงาน</span>
        </router-link>
        <router-link to="/admin/score" class="button">
          <v-icon class="iconsidebar">mdi-form-select</v-icon>
          <span class="text">คะแนนแบบประเมิน</span>
        </router-link>
        <router-link to="/admin/config" class="button">
          <v-icon class="iconsidebar">mdi-plus</v-icon>
          <span class="text">เพิ่มเจ้าหน้าที่</span>
        </router-link>
      </div>
  
      <div class="flex"></div>
  
      <div class="menu">
        <div class="button" @click="confirmLogut()" ref="logoutLink">
          <v-icon class="iconsidebar">mdi-logout</v-icon>
          <span class="text">Logout</span>
        </div>
      </div>
    </aside>
  </template>
  
  <script lang="ts" setup>
  import { ref } from "vue";
//   import logo from "../../assets/DSL-01.png";
  import Swal from "sweetalert2";
  import "animate.css";
  import { useCookies } from "vue3-cookies";
import router from "@/router";

const { cookies } = useCookies();  
//   import { storeToRefs } from "pinia";
//   import { useAuthStore  } from "~/store/auth";
//   const {logUserOut } = useAuthStore();
  
  const is_expanded = ref(
    localStorage.getItem("is_expanded") === "true"
  );
  
  const ToggleMenu = () => {
    is_expanded.value = !is_expanded.value;
    localStorage.setItem("is_expanded", `${is_expanded.value}`);
  };
  
  
  function confirmLogut() {
    Swal.fire({
    title: "คุณแน่ใจใช่ไหม?",
    text: "คุณกำลังจะออกจากระบบ!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#191771",
    cancelButtonColor: "#ED1C24",
    confirmButtonText: "ยืนยัน!",
    reverseButtons: true,
    cancelButtonText:'ยกเลิก',
    iconColor:'#ED1C24',
    color:'#191771'
  }).then((result) => {
    if (result.isConfirmed) {
    //   logUserOut();
    cookies.remove("accesstoken");
      cookies.remove("refreshtoken");
      router.push({name:"root",replace:true});
    }
  });
  }
  
  
  </script>
  
  <style lang="scss" scoped>
  
  :root {
      --primary: #191771;
      --primary-alt: #4175DF;
      --grey: #64748b;
      --dark: #1e293b;
      --dark-alt: #334155;
    --red:#ED1C24;
      --light: #f1f5f9;
      --sidebar-width: 300px;
  }
  aside {
    display: flex;
    flex-direction: column;
  
    background-color: #f1f5f9;
    color: #191771;
  
    border-radius: 0 1.5rem 1.5rem 0;
    width: calc(2rem + 32px);
    // overflow: hidden;
    min-height: calc(100vh - 11.5rem);
    padding: 1rem;
    margin-top: 1rem;
    margin-bottom: 1rem;
    transition: 0.2s ease-in-out;
  
    // กำหนดอัตราส่วนของsidebar
    .flex {
      flex: 1 1 0%;
    }
  
    // กำหนดlogo
    .logo {
      margin-bottom: 0.5rem;
  
      img {
        width: 3rem;
      }
    }
  
    .menu-toggle-wrap {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 0.1rem;
  
      position: relative;
      top: 0;
      transition: 0.2s ease-in-out;
  
      // กำหนดปุ่มเปิดปิดsidebar
      .menu-toggle {
        transition: 0.2s ease-in-out;
        .togglesidebar{
          font-size: 1.5rem;
          color: #191771;
          transition: 0.2s ease-out;
        }
  
        &:hover {
          .togglesidebar {
            color: var(--red);
            transform: translateX(0.5rem);
          }
        }
      }
    }
  
    h3,
    .button .text {
      opacity: 0;
      transition: opacity 0.3s ease-in-out;
    }
  
    h3 {
      color: #191771;
      font-size:  0%;
      margin-bottom: 0.5rem;
      text-transform: uppercase;
    }
  
    // กำหนดmenu
    .menu {
      margin: 0 -1rem;
  
      .button {
        display:block;
        align-items: center;
        align-content: center;
        // justify-content: center;
        text-decoration: none;
  
        transition: 0.2s ease-in-out;
        padding: 0.5rem 1rem;
  
        .iconsidebar {
          font-size: 2rem;
          color: #191771;
          transition: 0.2s ease-in-out;
        }
        .text {
          font-size: 0%;
          color: #191771;
          transition: 0.2s ease-in-out;
        }
  
        &:hover {
          background-color: #191771;
  
          .iconsidebar,
          .text {
            color: #f1f5f9;
          }
        }
  
        // &NuxtLink {
        //   background-color: var(--dark-alt);
        //   border-right: 5px solid #191771;
  
        //   .iconsidebar,
        //   .text {
        //     color: #191771;
        //   }
        // }
      }
    }
  
    .footer {
      opacity: 0;
      transition: opacity 0.3s ease-in-out;
  
          p {
            font-size: 0.875rem;
            color: #64748b;
      }
    }
  
    &.is-expanded {
      width: 300px;
      
      .menu-toggle-wrap {
        top: -3rem;
  
        .menu-toggle {
          transform: rotate(-180deg);
        }
      }
  
  
      h3,
      .button .text {
  
        opacity: 1;
      }
      h3{
        font-size: 0.875rem;
      }
  
      .button {
        display: flex;
        .text{
          font-size: 16px;
        }
        .iconsidebar {
          margin-right: 1rem;
        }
      }
  
      .footer {
        opacity: 0;
      }
    }
  
    @media (max-width: 1024px) {
      position: absolute;
      z-index: 99;
    }
  
  }
  </style>
  