<template>
    <div
    class="grid h-screen bg-cover bg-scroll justify-center content-center "
    id="backgroundlogin"
  >
    <div
      class=""
    >
      <div class="flex justify-center">
        <!-- <IconHome class="w-56 h-56" :fontControlled="false" /> -->
        <v-img src="../../assets/DSL-01.png" class="element" cover ></v-img>
      </div>
  
      <div class="flex justify-center">
        <!-- <GoogleSignInButton @success="handleLoginSuccess" @error="handleLoginError"></GoogleSignInButton> -->
        <v-btn prepend-icon="mdi-google" color="red" @click="login"> Google</v-btn>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import Googlebutton from '../../components/login/loginbutton.vue';
import { googleSdkLoaded } from 'vue3-google-login';
import axios from 'axios';
import { useCookies } from "vue3-cookies";
import router from "@/router";
import Swal from 'sweetalert2';
const { cookies } = useCookies();
console.log(process.env.VUE_APP_BACK_PORT);
const google_client_id = process.env.VUE_APP_GOOGLE_CLIENT_ID;
// console.log(google_client_id);
// function alerts() {
//     alert("test");
// }
async function login() {
    // alert(google_client_id);
    googleSdkLoaded((google:any) =>{
    google.accounts.oauth2.initCodeClient({
        client_id: google_client_id,
        // client_secret: google_client_secret
         scope: "email profile openid",
            redirect_uri: `http://localhost:${process.env.VUE_APP_BACK_PORT}/auth/callback`,
            callback: (response: { code: any; }) => {
              if (response.code) {
                 sendCodeToBackend(response.code);
                // console.log( response.code);
                
              }
            }
    }).requestCode();        
    });
}
async function sendCodeToBackend(code:string) {
    try {
        const headers = {
          Authorization: code
        };
        const response = await axios.post(`http://localhost:${process.env.VUE_APP_BACK_PORT}/login/google`, null, { headers });
        const token = response.data;
        console.log("token: ", token);
        
        cookies.set("accesstoken",token.access_token);
        cookies.set("refreshtoken",token.refresh_token);
        
       const access_token_extract = await parseJwt(token.access_token);

        if (access_token_extract === null || access_token_extract === undefined) {
          throw Error("Token not found");
        }

        switch (access_token_extract.role) {
          case "STUDENT":
            router.push({name:"student",replace:true})
            break;
          case "ADMIN":
            router.push({name:"adminhome",replace:true})
            break;
          case "TEACHER":
            router.push({name:"teacherhome",replace:true})
            break;
          default:
            throw Error("Role not found");
            break;
        }



        // userDetails = userDetails;
        // Redirect to the homepage ("/")
        //this.$router.push("/rex");
      } catch (error) {
        console.error("Failed to send authorization code:", error);
      }
}

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

</script>

<style lang="scss" scoped>
#backgroundlogin {
  background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)),
    url("~/src/assets/background.png");
  height: 100vh;
}

.element{
  width:400px
}
@media screen and (max-width: 370px) {
  .element{
    width: 200px;
  }
}
@media screen and (max-width: 768px) {
  .element{
    width: 300px;
  }
}
</style>