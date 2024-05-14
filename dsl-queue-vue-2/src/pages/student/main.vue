<template>
  <div class="screens">
    <nav id="navbar" class="bg-white border rounded-b-3xl">
      <div class="max-w-6xl mx-auto px-10 mt-12 mb-6">
        <div class="flex justify-between">
          <div class="flex items-center">
            <h1 class="textHeaders">คิวของคุณคือคิวที่ {{ myqueueorder }}</h1>
          </div>
          <div class="flex items-center">
            <span class="i-heroicons-clock w-8 h-8 mr-3"></span>
            <h1 v-if="leftqueue >= 0" class="textHeaders">
              เหลืออีก {{ leftqueue }} คิว
            </h1>
            <h1 v-else class="textHeaders">เหลืออีก 0 คิว</h1>
          </div>
        </div>
      </div>
    </nav>
    <div class="maincontent">
      <div class="text-wrapper-2 mt-5 mb-16">
        กรุณามาให้ตรงเวลา&nbsp;&nbsp;
        <br />
        ถ้าถึงคิวคุณแล้วไม่อยู่ ระบบจะถือว่าสละสิทธิ์
      </div>

      <div class="channel-wrapper">
        <div v-for="(teacher, index) in teachers" :key="index" class="channel">
          <div class="textchannel">ช่องรับบริการที่ {{ teacher.channel }}</div>
          <div class="blockchannel">
            <v-img class="" alt="Ellipse" src="../../assets/Ellipse16.png" />
            <div class="flex items-center">
              <v-icon icon="mdi-account" size="x-large" class="mr-3"></v-icon>
              <!-- <p>{{ techerchannel[index] === undefined  || techerchannel[index] === null && techerchannel[index].channel === teacher.channel ? 0 : techerchannel[index].orders}}</p> -->
              <p
                v-if="
                  techerchannel[index] === undefined ||
                  techerchannel[index] === null
                "
              >
                {{ 0 }}
              </p>
              <p v-else-if="techerchannel[index].channel === undefined">0</p>
              <p v-else-if="techerchannel[index].channel === teacher.channel">
                {{ techerchannel[index].channel }}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="flex justify-end">
        <v-btn color="red" class="cancelbutton" @click="cancelqueue"
          >ยกเลิกคิว</v-btn
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, Ref } from "vue";
import navbars from "../../components/student/home.navbar.vue";
import Swal from "sweetalert2";
import axios from "axios";
import { useCookies } from "vue3-cookies";
import { MaybeRefOrGetter, useInterval } from "@vueuse/core";
import router from "@/router";
import { Teacherchannel, User } from "@/models/User";
import { getDatasetAtEvent } from "vue-chartjs";

const { cookies } = useCookies();
let channel1 = ref(0);
let channel2 = ref(0);
let channel3 = ref(0);
let leftqueue = ref(0);
let myqueueid = ref(0);
let myqueueorder = ref(0);
let allqueue = ref();
let status_ = ref("");
let channel = ref(0);
let timer = 3000;

let loading = ref(true);

let teachers: Ref<User[]> = ref([]);
let techerchannel: Ref<Teacherchannel[]> = ref([
  {
    channel: 0,
    orders: 0,
  },
]);

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

let inter = setInterval(() => {
  getAllqueue();
  getMyqueue();
  getLeftqueue();
  loading.value === false;
}, timer);

const accesstoken = cookies.get("accesstoken");
const access_token_extract = parseJwt(accesstoken);
// console.log(access_token_extract);
const studentID = access_token_extract.email.split("@")[0];

async function getTeacher() {
  try {
    const res = await axios.get(
      `http://localhost:${process.env.VUE_APP_BACK_PORT}/users/getAlluser`
    );
    if (res.status !== 200) {
      throw Error(res.statusText);
    }
    teachers.value = res.data.filter((value: User) => {
      return value.role === "TEACHER";
    });
    console.log(teachers.value);
  } catch (error) {
    console.error(error);
  }
}

async function getFirstmyqueue() {
  try {
    const myqueue = await axios.get(
      `http://localhost:${process.env.VUE_APP_BACK_PORT}/queue/getQueueSpecific?studentID=${studentID}`
    );
    if (myqueue.status !== 200) {
      throw Error(myqueue.statusText);
    }
    return myqueue;
  } catch (error) {
    console.error(error);
  }
}

let exitingqueue = ref([]);

async function getExitingqueue() {
  exitingqueue.value = await getFirstmyqueue();
}

console.log(exitingqueue.value);
// getMyqueue();
async function getMyqueue() {
  try {
    console.log("studentID : ", studentID);
    const myqueue = await getFirstmyqueue();
    const checkbreaks = await checkBreak();
    console.log(myqueue.data[0]);
    myqueueid.value = myqueue.data[0].queueid;
    myqueueorder.value = myqueue.data[0].orders;
    console.log(myqueue.data[0].queueid);
    console.log(myqueue.data[0]);
    status_.value = myqueue.data[0].status;
    channel.value = myqueue.data[0].channel;

    if (checkbreaks === true && status_.value !== "STOP" ) {
        await changeStatus({queueid: myqueueid.value});
        exitingstatus = "STOP";
        // return;
    }

    console.log(leftqueue.value);
    console.log(`${status_.value} ${channel.value} `);

    checkStatusChange(status_.value);
  } catch (error) {
    console.error(error);
  }
}

async function changeStatus(row: { queueid: number }) {
  console.log(row.queueid);
  try {
    // if (is_called) {
    //   Swal.fire("โปรดทำคิวปัจจุบันให้เสร็จสิ้นก่อน");
    //   return;
    // }
    const res = await axios.put(
      `http://localhost:${process.env.VUE_APP_BACK_PORT}/queue/getqueueUpdatestatus`,
      {
        queueid: row.queueid,
        status: "STOP",
      }
    );

    if (res.status === 200) {
      console.log("put OK");
      // await refreshNuxtData("queueconvert");
    } else {
      throw Error(res.statusText);
    }
  } catch (error) {
    console.error(error);
  }
}


let exitingstatus = "WAIT";

function checkStatusChange(newStatus: string) {
  // Compare newStatus with previous status or any other necessary conditions
  // Trigger SweetAlert based on the comparison result
  if (leftqueue.value === 5) {
    newStatus = "CLOSET";
  }

  if (exitingstatus === newStatus) {
    return;
  }
  if (newStatus === "FINISH") {
    showSuccessalert();
  } else if (newStatus === "SKIP") {
    showAlertpass();
  } else if (newStatus === "PROCESS") {
    showYourturn(`${channel.value}`);
    exitingstatus = "PROCESS";
  } else if (newStatus === "STOP") {
    showAlertwaiting();
    exitingstatus = "STOP";
  } else if (leftqueue.value === 5) {
    showLeftqueuealert();
    exitingstatus = "CLOSET"
  } else {
    Swal.close();
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
        return true;
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
async function getAllqueue() {
  try {
    const queue = await axios.get(
      `http://localhost:${process.env.VUE_APP_BACK_PORT}/queue/getqueueDataspecificstatusrefuse?status1=FINISH&status2=SKIP&status3=CANCEL`
    );
    if (queue.status !== 200) {
      throw Error(queue.statusText);
    }
    let x: Teacherchannel[] = [];
    teachers.value.forEach((teacher) => {
      console.log("Teacher ", teacher.channel);
      queue.data.forEach((queues: { channel: number; orders: number }) => {
        console.log("Queue ", queues.channel);
        console.log("Teacher ", teacher.channel);
        if (queues.channel === teacher.channel) {
          console.log("queue channel ", queues.channel);
          x.push({ channel: queues.channel, orders: queues.orders });
        }
      });
    });
    techerchannel.value = x;
    console.log("Techerchannel", techerchannel.value);
    // myqueueid.value = myqueue.data.queueid;

    console.log(loading.value);
    console.log(queue);
  } catch (error) {
    console.error(error);
  }
}

async function updateHistory(queueid: number, status: string) {
  try {
    const res = await axios.put(
      `http://localhost:${process.env.VUE_APP_BACK_PORT}/history/getHistoryUpdate`,
      {
        queueid: queueid,
        status: status,
      }
    );
    if (res.status !== 200) {
      throw Error(res.statusText);
    }
  } catch (error) {
    console.error(error);
  }
}
async function getLeftqueue() {
  try {
    const res = await axios.get(
      `http://localhost:${process.env.VUE_APP_BACK_PORT}/queue/getqueueCountqueuebefore?queueidstring=${myqueueid.value}`
    );
    if (res.status !== 200) {
      throw Error(res.statusText);
    }
    console.log("left queue: ", res.data);
    leftqueue.value = res.data.queuebefore - 1;
  } catch (error) {
    console.error(error);
  }
}

async function cancelqueue() {
  stop(inter);
  const result = await Swal.fire({
    title: "คุณแน่ใจใช่ไหม?",
    reverseButtons: true,
    text: "คุณกำลังจะยกเลิกคิว!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#191771",
    cancelButtonColor: "#ED1C24",
    confirmButtonText: "ยืนยัน!",
    cancelButtonText: "ยกเลิก",
    iconColor: "#ED1C24",
    color: "#191771",
  });
  if (result.isConfirmed) {
    try {
      const res = await axios.delete(
        `http://localhost:${process.env.VUE_APP_BACK_PORT}/queue/getqueuedeleteQueue?queueid=${myqueueid.value}`
      );
      if (res.status === 200) {
        await updateHistory(myqueueid.value, "CANCEL");
        router.push({ name: "student", replace: true });
        return;
      }
      throw Error(res.statusText);
    } catch (error) {
      console.error(error);
    }
  } else {
    start();
  }
}

async function showSuccessalert() {
  stop(inter);
  await Swal.fire({
    reverseButtons: true,
    color: "#191771",
    icon: "success",
    html: `<h1>สิ้นสุดการให้บริการ <br/> กรุณาทำแบบสอบถามในหน้าต่อไป</h1>`,
    showConfirmButton: false,
    timer: 3500,
    timerProgressBar: true,
  });
  router.push({ name: "studentstatisfaction", replace: true });
}

async function showYourturn(channel: string) {
  await Swal.fire({
    reverseButtons: true,
    title: `<h1 class="text-xl">ถึงคิวของคุณแล้ว</h1>`,
    icon: "warning",
    iconColor: "red",
    html: `

      <div class="flex items-center justify-center">
        <p class="mr-2">กรุณาไปที่ช่องบริการ </p>
        <p class="mr-2 text-red-500 font-bold">${channel}</p>
      </div>
    `,
    color: "#191771",
    allowOutsideClick: false,
    allowEscapeKey: false,
    allowEnterKey: false,
    showConfirmButton: false,
  });
}

async function showLeftqueuealert() {
  const result = await Swal.fire({
    reverseButtons: true,
    title: `<h1 class="text-xl">จะถึงคิวของคุณแล้ว</h1>`,
    html: `
  <span class="i-heroicons-user-solid w-40 h-40 "></span>
  <div class="flex items-center justify-center">
              <span class="i-heroicons-clock w-8 h-8 mr-3"></span>
              <p class="mr-2">เหลืออีก </p>
              <p class="mr-2 text-red-500 font-bold"> 5 </p>
              <p class="mr-2">คิว</p>
            </div>
  `,
    showConfirmButton: false,
    // showCloseButton: true,
    color: "#191771",
  });
}

function showAlertwaiting() {
  Swal.fire({
    reverseButtons: true,
    title: `<h1 class="text-xl">กรุณารอสักครู่ <br/> อยู่ในช่วงพักของเจ้าหน้าที่</h1>`,
    html: `<div class="custom-loaders"></div>
          <p>จะกลับมาเปิดทำการในไม่ช้า</p>  
    `,
    customClass: {
      htmlContainer: "custom-swal-container",
    },
    color: "#191771",
    allowOutsideClick: false, // Prevent dismissing by clicking outside the modal
    allowEscapeKey: false, // Prevent dismissing by pressing the Escape key
    allowEnterKey: false, // Prevent dismissing by pressing the Enter key
    showConfirmButton: false,
  });
}

async function showAlertpass() {
  stop(inter);
  const confirm = await Swal.fire({
    reverseButtons: true,
    title: `<h1 class="text-xl">คิวของคุณผ่านไปแล้ว</h1>`,
    html: `
  <span class="i-heroicons-exclamation-triangle-solid w-40 h-40 text-red-600 "></span>
  <div class="flex items-center justify-center">
    <p>กดยืนยันเพื่อกลับไปหน้าแรก</p>
    </div>
    `,
    allowOutsideClick: false, // Prevent dismissing by clicking outside the modal
    allowEscapeKey: false, // Prevent dismissing by pressing the Escape key
    allowEnterKey: false, // Prevent dismissing by pressing the Enter key
    // showCloseButton: true,
    confirmButtonText: `
    <div class="flex items-center">
      <span class="i-heroicons-arrow-uturn-left mr-1  "></span>
      ยืนยัน
      </div>
  `,
    confirmButtonColor: "#191771",
    color: "#191771",
  });
  // .then((value: { isConfirmed: any }) => {
  //   if (value.isConfirmed) {
  //     navigateTo("/student/", { replace: true });
  //   }
  // });
  if (confirm.isConfirmed) {
    try {
      const res = await axios.delete(
        `http://localhost:${process.env.VUE_APP_BACK_PORT}/queue/getqueuedeleteQueue?queueid=${myqueueid.value}`
      );
      if (res.status === 200) {
        router.push({ name: "student", replace: true });
        return;
      }
      throw Error(res.statusText);
    } catch (error) {
      console.error(error);
    }
  }
}
onMounted(getTeacher);
onMounted(getAllqueue);
onMounted(getExitingqueue);
onMounted(getMyqueue);

onMounted(getLeftqueue);

function start() {
  inter = setInterval(() => {
    getMyqueue();
    getAllqueue();
    getLeftqueue();
    loading.value === false;
  }, timer);
}

function stop(interval: number | undefined) {
  clearInterval(interval);
}
</script>

<style lang="scss" scoped>
img {
  width: fit-content;
}

.screens {
  background-color: #191770;
  height: 100vh;
  width: 100%;
  overflow: scroll;
}
.textHeaders {
  font-size: 16px;
  color: #191771;
}
.screens .maincontent {
  display: grid;
  align-content: start;
  align-items: center;
  align-self: center;
  justify-content: center;
  /* fullscreens - navbar = maincontent */
  height: calc(100vh - 98px);
  .cancelbutton {
    display: flex;
    justify-content: center;
  }

  .text-wrapper-2 {
    color: red;
    font-family: "Inter-Bold", Helvetica;
    font-size: 20px;
    font-weight: 700;
    letter-spacing: 0;
    line-height: normal;
    text-align: center;
  }

  .channel-wrapper {
    display: grid;
    align-items: center;
    align-self: center;
    justify-content: center;

    .channel {
      margin-bottom: 2rem;

      .blockchannel {
        display: flex;
        justify-content: space-between;
        background-color: #ffffff;
        width: 70vw;
        height: 5rem;
        border-radius: 2rem;
        padding-left: 1.5rem;
        padding-right: 2rem;
      }

      .textchannel {
        margin-left: 0.7rem;
        margin-bottom: 0.5rem;
        font-family: "Inter-Bold", Helvetica;
        color: #ffffff;
        font-weight: 700;
      }
    }
  }
}

.swal2-container .swal2-html-container {
  margin-left: auto;
  margin-right: auto;
  overflow: visible;
}

.custom-loaders {
  margin-left: auto;
  margin-right: auto;
  overflow: visible;
  border: 15px solid #f3f3f3;
  /* Light grey */
  border-top: 15px solid red;
  /* Blue */
  border-radius: 50%;
  margin-bottom: 1rem;
  width: 100px;
  height: 100px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
