<template lang="">
  <div class="appdashboard">
    <IncTeacherSidebardark />
    <main>
      <!-- <UButton variant="solid" >Button</UButton> -->
      <!-- <div class="channel"> -->
      <div v-if="is_loading" class="containers">
        <div class="channel-wrapper">
          <div
            v-for="(teacher, index) in teachers"
            :key="index"
            class="channel"
          >
            <div class="textchannel">
              ช่องรับบริการที่ {{ teacher.channel }}
            </div>
            <div class="blockchannel">
              <v-icon
                icon="mdi-account-tie"
                class="mb-10"
                style="font-size: 6rem"
                color="white"
                alt="Ellipse"
              />

              <v-icon
                icon="mdi-account"
                style="font-size: 4rem"
                color="white"
                alt="Ellipse"
              />

              <div class="textchannel" >
                {{findQueue(teacher.channel)}}

              </div>
            </div>
          </div>
        </div>
        <div class="box-right">
          <div class="box-inside">
            <h1 class="channel-text">ช่องรับบริการที่ {{ lastchannel }}</h1>
          </div>
          <h1 class="q-text">คิวที่ {{ lastchannelqueueid }}</h1>
        </div>
      </div>
      <div v-else-if="is_loading === false" class="containers">
        <v-skeleton-loader
          class="mx-auto border"
          max-width="300"
          type="card-avatar, actions"
        ></v-skeleton-loader>
      </div>
      <div v-if="is_over >= 250" class="text-250">
        จำนวนผู้ใช้บริการเกินกว่า 250 ท่าน
      </div>
    </main>
  </div>
</template>
<script setup lang="ts">
import Swal from "sweetalert2";
import "animate.css";
import { useIntervalFn } from "@vueuse/core";
import { ref, onMounted, Ref } from "vue";
import axios from "axios";
import { Teacherchannel, User } from "@/models/User";
import { Queue } from "@/models/Queue";

let teachers: Ref<User[]> = ref([]);
let channel: Ref<Teacherchannel[]> = ref([
  {
    channel: 0,
    orders: 0,
  },
]);

let allqueue: Ref<Queue[]> = ref([]);

let lastchannel = "";
let lastchannelqueueid = ref(0);
let is_over = ref(0);
let is_loading = ref(false);

// getQueue();
function convertChannel(data: string) {
  switch (data) {
    case "WAIT":
      data = "ยังไม่ได้เรียก";
      break;
    case "ONE":
      data = "1";
      break;
    case "TWO":
      data = "2";
      break;
    case "THREE":
      data = "3";
      break;
    default:
      break;
  }
  return data;
}
/// 250
function updateQueueClass(allQueues: any[]) {
  const divElement = document.querySelector(".text-250");
  if (divElement) {
    if (allQueues.length < 250) {
      divElement.classList.remove("text-250");
    } else {
      divElement.classList.add("text-250");
    }
  }
}
let test: Teacherchannel[] = [];
teachers.value.forEach((t)=>{
 test = channel.value.filter((value) => {
          return value.channel === t.channel ;
  })
})
console.log(test);
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

async function getQueue() {
  try {
    const queue = await axios.get(
      `http://localhost:${process.env.VUE_APP_BACK_PORT}/queue/getqueueDataspecificstatusrefuse?status1=FINISH&status2=SKIP&status3=CANCEL`
    );
    if (queue.status !== 200) {
      throw Error(queue.statusText);
    }
    is_over.value = queue.data.length - 1;
    let x: Teacherchannel[] = [];
    console.log(is_over.value);
    teachers.value.forEach((teacher) => {
      console.log("Teacher ", teacher.channel);
      queue.data.forEach((queues: { channel: number; orders: number }) => {
        console.log("Queue ", queues.channel);
        

        let lastqueue = queue.data.findLast(
          (item: { status: string }) => item.status === "PROCESS"
        );

        if (lastqueue !== undefined && lastqueue !== null) {
          console.log(lastqueue?.channel);

          lastchannel = lastqueue.channel;
          lastchannelqueueid.value = lastqueue.orders;
        }
      });
    });
    
    allqueue.value = queue.data;
    console.log(is_loading.value);
    if (channel.value.length > 0) {
      is_loading.value = true;
    }
    console.log("channel : ", channel.value);
  } catch (error) {
    console.error(error);
  }
}

function findQueue(channel:number) :number{
  const allqueues =  allqueue.value.filter((value)=>{
    return value.channel === channel && value.status === "PROCESS";
  })
  if (allqueues[0] === undefined) {
    return 0;
  }
  console.log(allqueues);
  return allqueues[0].orders;
}


onMounted(getQueue);
onMounted(getTeacher);

// Call getQueue() every 1 minute
setInterval(getQueue, 5000);
</script>
<style lang="scss" scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Fira sans", sans-serif;
}

button {
  cursor: pointer;
  appearance: none;
  border: none;
  outline: none;
  background: none;
}

.appdashboard {
  display: flex;

  main {
    padding: 2rem;
    @media (max-width: 1024px) {
      padding-left: 6rem;
    }
    .containers {
      display: flex;
    }
    overflow: scroll;
  }
}

.channel-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;

  .channel {
    margin: 2rem;

    .blockchannel {
      border: 1px solid black;
      border-radius: 2rem;
      padding: 1.5rem 2rem;
      width: 10rem;
      height: 22rem;
      text-align: center;
    }

    .blockchannel v-icon {
      width: 300px;
      height: 100px;
      padding: 1%;
      margin-bottom: 35%;
      box-sizing: border-box;
    }

    .blockchannel v-img {
      max-width: 100%;
      max-height: 100%;
      object-fit: cover;
      width: auto;
    }

    .textchannel {
      // margin-left: 0.7rem;
      margin-bottom: 0.5rem;
      font-family: "Inter-Bold", Helvetica;
      color: white;
      font-weight: 700;
      text-align: center;
    }
  }
}

.box-right {
  border-bottom-left-radius: 2rem;
  border-bottom-right-radius: 2rem;
  margin: 2rem 2.5rem;
  width: 40rem;
  height: 30rem;
  margin: auto;
  justify-content: center;
  align-items: center;
  text-align: center;
  background-color: #2958c8;
  color: white;

  .channel-text {
    padding: 1.5rem;
    font-size: 1.5rem;
    font-weight: 200;
    font-family: "Inter-Bold", Helvetica;
  }

  .box-inside {
    width: 40rem;
    height: 5rem;
    background-color: #1844ab;
  }

  .q-text {
    padding-top: 5rem;
    text-align: center;
    font-size: 7rem;
    font-weight: 700;
    font-family: "Inter-Bold", Helvetica;
  }
}

.text-250 {
  color: #ff0707;
  padding-top: 1.5rem;
  text-align: center;
  font-size: 2rem;
  animation: blink 5s linear infinite;
}
@keyframes blink {
  50% {
    opacity: 0;
  }
  80% {
    opacity: 0.5;
  }
}
</style>
