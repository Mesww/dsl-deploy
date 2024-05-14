<template>
  <marquee v-if="isover" behavior="scroll" direction="right">
    <div class="flex">
      <h1 class="font-bold text-white mr-2">มีคิวที่รอเกิน </h1>
      <h1 class="font-bold text-red-500 mr-2">10</h1>
      <h1 class="font-bold text-white">นาทีแล้ว</h1>

    </div>
  </marquee>

  <v-data-table-server
    v-model:items-per-page="items_per_page"
    :headers="headers"
    :items="queue"
    :items-length="totalAllqueue"
    :loading="loading"
    @update:options="loadItems"
    style="width: 80vw; height: 70vh"
    class="mb-10"
  >
    <template v-slot:item.actions="{ item }">
      <v-btn
        class="me-2"
        size="small"
        color="blue"
        @click="callAction(item)"
        prepend-icon="mdi-room-service-outline"
      >
        เรียก
      </v-btn>
      <v-btn
        class="me-2"
        size="small"
        color="red"
        prepend-icon="mdi-cancel"
        @click="skipAction(item)"
      >
        ข้าม
      </v-btn>
      <v-btn
        size="small"
        color="green"
        @click="completeAction(item)"
        prepend-icon="mdi-account-check-outline"
      >
        เสร็จสิ้น
      </v-btn>
    </template>
  </v-data-table-server>
</template>

<script setup lang="ts">
import axios from "axios";
import Swal from "sweetalert2";
import { onMounted, ref } from "vue";
import { useCookies } from "vue3-cookies";
let time = 600000;
const { cookies } = useCookies();
let myChannel = ref(0);
let totalAllqueue = ref(0);
let is_called = ref(false);
let queue = ref([]);
const items_per_page = ref(5);
let loading = ref(false);
let timer = 5000;
let isover = ref(false);

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

let inter = setInterval(() => {
  fetchQueue();
}, timer);

let outer;

const headers = [
  { key: "orders", title: "ลำดับ", align: "center" },
  { key: "datetime", title: "วันเวลา", align: "center" },
  { key: "type", title: "งานบริการ", align: "center" },
  { key: "studentID", title: "รหัสนักศึกษา", align: "center" },
  { key: "channel", title: "ช่องบริการ", align: "center" },
  { key: "actions", title: "งานบริการ", align: "center" },
];
fetchQueue();
console.log(process.env.VUE_APP_BACK_PORT);

let waitingqueue = [];

async function fetchQueue() {
  try {
    const res = await axios.get(
      `http://localhost:${process.env.VUE_APP_BACK_PORT}/queue/getqueueDataspecificstatusrefuse?status1=FINISH&status2=SKIP&status3=CANCEL`
    );

    if (res.status === 200) {
      totalAllqueue.value = await res.data.length;

      queue.value = await res.data;

      let x: any[] = [];
      queue.value.forEach((value) => {
        value.type = convertType(value.type);
        if (value.status === "WAIT") {
          x.push(value);
        }
        value.datetime = `${new Date(value.datetime).toDateString()} ${new Date(value.datetime).toTimeString().split(' ')[0]}  `;
      });

      waitingqueue = x;
      console.log(waitingqueue);
      if (waitingqueue.length >= 1) {
        console.log(waitingqueue);
        const queuebelow = new Date(waitingqueue[0].datetime).getTime();
        console.log(new Date().getTime() > queuebelow + time);
        
        if (new Date().getTime() > queuebelow + time) {
          isover.value = true;
        } else {
          isover.value = false;
        }
      }else{
        isover.value = false;
      }

      loading.value = true;
      console.log("allqueue : ", res.data.length);
    } else {
      throw Error(`${res.status}`);
    }
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false; // Set loading to false after data is fetched
  }
}

async function updateHistory(queueid: number, status: string) {
  try {
    const res = await axios.put(
      `http://localhost:${process.env.VUE_APP_BACK_PORT}/history/getHistoryUpdate`,
      {
        queueid: queueid,
        status: status,
        channel: myChannel.value,
      }
    );
    if (res.status !== 200) {
      throw Error(res.statusText);
    }
  } catch (error) {
    console.error(error);
  }
}


console.log(queue.value);

function convertType(type: string): string {
  switch (type) {
    case "ONE":
      return "แบบคำขอกู้ยืมเงิน";
    case "TWO":
      return "สัญญากู้ยืมเงิน หรือ แบบยืนยันการเบิกเงินกู้ยืม";
    default:
      return "ประเภทอื่น ๆ";
  }
}



async function loadItems(options: any) {
  // Here you can handle the options object which contains the pagination, sorting, and searching options.
  // For example, you can use these options to make a new API request with the updated parameters.
  console.log("Updated options:", options);
  // Example: Make a new API request using the updated options
  await fetchQueue();
}

async function checkIs_called() {
  try {
    const res = await axios.get(
      `http://localhost:${process.env.VUE_APP_BACK_PORT}/queue/getQueueSpecific?channel=${myChannel.value}&status=PROCESS`
    );
    if (res.status === 200) {
      console.log(res.data);
      console.log(res.data.length);
      if (res.data.length >= 1) {
        return true;
      }
      return false;
    } else {
      throw Error(res.statusText);
    }
  } catch (error) {
    console.error(error);
  }
}



async function callAction(row: { queueid: number }) {
  console.log(row.queueid);
  console.log(myChannel);
  const is_called = await checkIs_called();
  if (is_called) {
    console.log(is_called);
    Swal.fire("โปรดทำคิวปัจจุบันให้เสร็จสิ้นก่อน");
  } else {
    try {
      const res = await axios.put(
        `http://localhost:${process.env.VUE_APP_BACK_PORT}/queue/getqueueupdateQueuechannel`,
        {
          queueid: row.queueid,
          channel: myChannel.value,
        }
      );
      // console.log(response);
      if (res.status === 200) {
        await updateHistory(row.queueid, "PROCESS");
        // find index qeueus
        const updatedItemIndex =
          queue.value?.findIndex((data) => data.queueid === row.queueid) ?? -1;
        console.log("success");
        if (queue.value && updatedItemIndex !== -1) {
          queue.value[updatedItemIndex].channel = myChannel.value;
          // console.log(queue.value);
          // console.log("success");
        }
      } else {
        throw Error(res.statusText);
      }
    } catch (error) {
      console.error(error);
    }
  }
}

async function skipAction(row: { queueid: number }) {
  console.log(row.queueid);
  const is_called = await checkIs_called();
  try {
    // if (is_called) {
    //   Swal.fire("โปรดทำคิวปัจจุบันให้เสร็จสิ้นก่อน");
    //   return;
    // }
    const res = await axios.put(
      `http://localhost:${process.env.VUE_APP_BACK_PORT}/queue/getqueueUpdatestatus`,
      {
        queueid: row.queueid,
        status: "SKIP",
      }
    );

    if (res.status === 200) {
      await updateHistory(row.queueid, "SKIP");
      console.log("put OK");
      console.log(await checkIs_called());

      await fetchQueue();
      // await refreshNuxtData("queueconvert");
    } else {
      throw Error(res.statusText);
    }
  } catch (error) {
    console.error(error);
  }
}
async function completeAction(row: { queueid: number }) {
  console.log(row);

  // if (is_called) {
  //     Swal.fire("โปรดทำคิวปัจจุบันให้เสร็จสิ้นก่อน");
  //     return;
  //   }

  try {
    const res = await axios.put(
      `http://localhost:${process.env.VUE_APP_BACK_PORT}/queue/getqueueUpdatestatus`,
      {
        queueid: row.queueid,
        status: "FINISH",
      }
    );
    if (res.status === 200) {
      console.log("put OK");
      await updateHistory(row.queueid, "FINISH");
      await fetchQueue();
    } else {
      throw Error(res.statusText);
    }
  } catch (error) {
    console.error(error);
  }
}
onMounted(getMyuser);
onMounted(fetchQueue);

function start() {
  inter = setInterval(() => {
    fetchQueue();
  }, timer);
}

function stop(interval: number | undefined) {
  clearInterval(interval);
}
</script>

<style scope lang="scss"></style>
