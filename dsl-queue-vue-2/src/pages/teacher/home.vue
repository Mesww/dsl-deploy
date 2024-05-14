<template>
  <div class=" m-auto ">
    <div class="flex justify-between">
      <div class="flex">
        <v-switch color="red" @click="breakAlert" v-model="tooglevalue" hide-details />
        <h1 class="text-red ml-5  mt-auto mb-auto">กดเพื่อพักระบบ</h1>
      </div>
      <div class="head items-center md:flex" > <h1 class=" text-white py-5 px-3"> ช่องบริการที่ {{myChannel}}</h1> </div>

    </div>
      <queuetable />
  </div>
</template>

<script setup lang="ts">
import Swal from "sweetalert2";
import queuetable from "../../components/teacher/home.table.vue";
import axios from "axios";
import { onMounted, ref } from "vue";
let tooglevalue = ref(true);
let timer = 5000;


let inter = setInterval(() => {
  checkBreak();
}, timer);

async function breakAlert() {

  const ishaveProcess = await checkStatusproccess();
  const ishaveWait = await checkStatuswait();
  if (ishaveProcess === true) {
    tooglevalue.value = true;
    return await Swal.fire({
      title: "มีคิวที่เรียกไว้แต่ยังไม่ได้สร็จสิ้น",
      icon: "warning",
      reverseButtons: true,
      confirmButtonColor: "#191771",
      cancelButtonColor: "#ED1C24",
      confirmButtonText: "ยืนยัน!",
      iconColor: "#ED1C24",
      color: "#191771",
    })
  }
  if (ishaveWait === false) {
    tooglevalue.value = true;
    return await Swal.fire({
      title: "ยังไม่มีคิวให้พัก",
      icon: "warning",
      reverseButtons: true,
      confirmButtonColor: "#191771",
      cancelButtonColor: "#ED1C24",
      confirmButtonText: "ยืนยัน!",
      iconColor: "#ED1C24",
      color: "#191771",
    })
  }

  

  const result = await Swal.fire({
    title: "คุณแน่ใจใช่ไหม?",
    text: "คุณกำลังจะพักระบบ!",
    icon: "warning",
    reverseButtons: true,
    showCancelButton: true,
    confirmButtonColor: "#191771",
    cancelButtonColor: "#ED1C24",
    confirmButtonText: "ยืนยัน!",
    cancelButtonText: "ยกเลิก",
    iconColor: "#ED1C24",
    color: "#191771",
  });

  if (result.isConfirmed) {
    //Change Status WAIT to STOP
    try {
      const res = await axios.put(
        `http://localhost:${process.env.VUE_APP_BACK_PORT}/queue/getqueueupdateAllQueuestatus`,
        {
          changeStatus: "WAIT",
          status: "STOP",
        }
      );
      if (res.status !== 200) {
        throw Error(res.statusText);
      }
      tooglevalue.value = false;
      exitingstatus = "STOP";
      await alertBreak();

      
    } catch (error) {
      console.error(error);
    }
  }
  tooglevalue.value = true;
  console.log(tooglevalue.value);
}

import { useCookies } from "vue3-cookies";
let myChannel =ref(0);


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

async function checkStatusproccess() {
  try {
    const res = await axios.get(
      `http://localhost:${process.env.VUE_APP_BACK_PORT}/queue/getqueueSpecificstatus?status=PROCESS`
    );
    if (res.status === 200) {
      console.log(res.data);
      console.log(res.data.length);
      if (res.data.length >= 1) {
          return true
      }else{
        return false;
      }
    } else {
      throw Error(res.statusText);
    }
  } catch (error) {
    console.error(error);
  }
}
async function checkStatuswait() {
  try {
    const res = await axios.get(
      `http://localhost:${process.env.VUE_APP_BACK_PORT}/queue/getqueueSpecificstatus?status=WAIT`
    );
    if (res.status === 200) {
      console.log(res.data);
      console.log(res.data.length);
      if (res.data.length >= 1) {
          return true
      }else{
        return false;
      }
    } else {
      throw Error(res.statusText);
    }
  } catch (error) {
    console.error(error);
  }
}

async function alertBreak() {
  const results = await Swal.fire({
        title: "กำลังพักระบบ!",
        html: '<div class="spin-loader"></div>',
        showCancelButton: true,
        showConfirmButton: false,
        reverseButtons: true,
        allowOutsideClick: false, // Prevent dismissing by clicking outside the modal
        allowEscapeKey: false, // Prevent dismissing by pressing the Escape key
        allowEnterKey: false, // Prevent dismissing by pressing the Enter key
        customClass: {
          htmlContainer: "spin-swal-container",
        },
        showClass: {
          popup: `
      animate__animated
      animate__fadeInDown
      animate__faster
    `,
        },
        hideClass: {
          popup: `
      animate__animated
      animate__fadeOutUp
      animate__faster
    `,
        },
        cancelButtonText: "ยกเลิก",
        cancelButtonColor: "#ED1C24",
        color: "#191771",
      });
      if (results.dismiss || results.isDenied) {
        tooglevalue.value = true;
        try {
            const ress = await axios.put(
        `http://localhost:${process.env.VUE_APP_BACK_PORT}/queue/getqueueupdateAllQueuestatus`,
        {
          changeStatus: "STOP",
          status: "WAIT",
        }
      );
      if (ress.status !== 200) {
        console.error(ress.statusText);
        exitingstatus = "";
      }
        } catch (error) {
            console.error(error);
        }
      }
}

let exitingstatus = "";

async function checkStatusChange(newStatus: string) {
  // Compare newStatus with previous status or any other necessary conditions
  // Trigger SweetAlalertBreak
  console.log("newStatus : "+newStatus);
  console.log("exitingstatus : "+exitingstatus);
  if (newStatus === exitingstatus) {
    return;
  }
  if (newStatus === "STOP") {
    await alertBreak();
    exitingstatus = "STOP";
    tooglevalue.value =false;
  } else {
    Swal.clickCancel();
    exitingstatus = "";
    tooglevalue.value  = true;
  }
}

async function checkBreak() {
  try {
    const res = await axios.get(
      `http://localhost:${process.env.VUE_APP_BACK_PORT}/queue/getqueueSpecificstatus?status=STOP`
    );
    if (res.status === 200) {
      console.log(res.data);
      console.log(res.data.length);
      if (res.data.length >= 1) {
        console.log("stop");
        checkStatusChange("STOP");
      }else{
        checkStatusChange("");
      }
    } else {
      throw Error(res.statusText);
    }
  } catch (error) {
    console.error(error);
  }
}

onMounted(getMyuser);
onMounted(checkBreak);



</script>

<style lang="scss" scoped>
.swal2-container .swal2-html-container {
  margin-left: auto;
  margin-right: auto;
  overflow: visible;
}
.spin-swal-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.spin-loader {
  border: 8px solid #f3f3f3; /* Light grey */
  border-top: 8px solid #191771; /* Blue */
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spins 1s linear infinite;
}

@keyframes spins {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
